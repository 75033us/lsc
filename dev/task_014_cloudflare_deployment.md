# Task 014: Cloudflare Workers Deployment — Migration Plan

## Status: Phase 0 ✅ — ready for Phase 1 (skeleton port)

## Why Cloudflare Workers (not Cloud Run)

The original `task_008` deployment plan was Google Cloud Run. We are switching to **Cloudflare Workers + D1** so the LINE bot lives in the same ecosystem as `lsc.church` (Cloudflare Pages, see `task_010`). One dashboard, one billing, one set of secrets, one mental model.

This doc supersedes the Deployment section of `task_008`.

---

## Target Stack

| Layer | Choice | Why |
|---|---|---|
| Compute | **Cloudflare Workers** (V8 isolate) | Free tier 100k req/day (~3M/month) is generous; <10ms cold start; native HTTPS |
| HTTP framework | **Hono** | Workers-native, Express-like API, TypeScript-first, ~14kB |
| Database | **Cloudflare D1** | Serverless SQLite, same dialect as `better-sqlite3`; 5M reads + 100k writes/day on free tier |
| Scheduled jobs | **Cron Triggers** | Native to Workers; replaces planned `node-cron` |
| Secrets | **Wrangler secrets** (`wrangler secret put`) | LINE channel token, channel secret, admin IDs |
| Static data (JSON) | Bundled into Worker code | `import faq from "../data/faq.json"` — small files, no I/O needed |
| Images (rich menu, event posters) | **R2** (deferred) | Only when we actually start hosting media; rich menu setup uploads directly to LINE |
| Local dev | `wrangler dev` + `wrangler dev --remote` for webhook testing | Replaces `tsx watch` + `cloudflared` |
| Deploy | `wrangler deploy` from CLI; later GitHub Action | One command, ~20s |

---

## File-by-File Migration

### Files that change

| Current | Action | Notes |
|---|---|---|
| `src/index.ts` (18 lines) | **Rewrite** | Export `{ fetch, scheduled }` as Worker module instead of starting Express server |
| `src/server.ts` (48 lines) | **Replace with Hono app** | `app.fetch` handler; ~40 lines |
| `src/config.ts` (16 lines) | **Rewrite** | Read from Worker `env` binding, not `process.env` |
| `src/line/client.ts` (6 lines) | **Verify or rewrite** | Try `@line/bot-sdk` first with `nodejs_compat` flag; fall back to hand-rolled `fetch` if incompatible |
| `src/line/webhook.ts` (54 lines) | **Light edit** | Swap signature verification from Node `crypto.createHmac` to Web Crypto `crypto.subtle.verify` |
| `src/modules/types.ts` (43 lines) | **Light edit** | `ModuleContext` gains `env.DB` (D1) and other bindings |
| `src/modules/info/handler.ts` (64 lines) | **Light edit** | Read JSON via import, not `fs.readFile` (likely already does) |
| `src/modules/qa/handler.ts` (56 lines) | **Light edit** | Same |
| `package.json` | **Modify** | Add `wrangler`, `hono`, `@cloudflare/workers-types`. Remove `express`, `better-sqlite3`. Script: `dev` → `wrangler dev`, `deploy` → `wrangler deploy`. |
| `tsconfig.json` | **Modify** | Add `@cloudflare/workers-types`, set `module: ESNext`, `moduleResolution: bundler` |

### Files that stay as-is

- `src/line/messages/flex.ts` (110 lines) — pure data, no runtime deps
- `src/lib/types.ts`, `src/lib/parser.ts`, `src/lib/pinyin.ts`, `src/lib/youtube.ts` — pure logic
- `scripts/setup-rich-menu.ts` — one-time provisioning, runs as a local Node script with secrets from `.env`; does **not** need to be a Worker
- `scripts/donor-frequency.ts` — internal data tool, not part of the deployed bot
- All `data/*.json`, `songs/*.json`, `worship/*` files
- `dev/` task docs

### Files added

- `wrangler.toml` — Worker config (see template below)
- `src/db/schema.sql` — D1 schema, applied via `wrangler d1 execute --file`
- `src/db/client.ts` — thin D1 query helper
- `src/db/migrations/*.sql` — incremental schema changes (versioned)
- `scripts/migrate.ts` (already declared in `package.json`) — wraps `wrangler d1 migrations apply`

### Files removed

- `src/server.ts` (replaced by Hono app inside `src/index.ts` or `src/app.ts`)
- Express, better-sqlite3 from `package.json`

---

## `wrangler.toml` starter

```toml
name = "lsc-line-bot"
main = "src/index.ts"
compatibility_date = "2026-05-01"
compatibility_flags = ["nodejs_compat"]  # try first; remove if not needed

[[d1_databases]]
binding = "DB"
database_name = "lsc-bot"
database_id = "<filled in after `wrangler d1 create`>"

[triggers]
# Phase 4: scheduled broadcasts
crons = ["0 14 * * 6"]  # example: Sat 2pm UTC → Sunday-morning reminder in TW timezone

[vars]
NODE_ENV = "production"

# Secrets are NOT in this file — set via:
#   wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
#   wrangler secret put LINE_CHANNEL_SECRET
#   wrangler secret put ADMIN_LINE_USER_IDS
```

---

## D1 schema (first cut)

Identical to the SQLite schema planned in `task_008`. D1 is SQLite-compatible at the dialect level — no schema changes needed.

```sql
-- src/db/schema.sql (initial migration)

CREATE TABLE users (
  line_user_id TEXT PRIMARY KEY,
  display_name TEXT,
  role TEXT CHECK(role IN ('member','leader','admin','pastor')) DEFAULT 'member',
  phone TEXT,
  email TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE small_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  leader_user_id TEXT REFERENCES users(line_user_id),
  meeting_day TEXT,
  meeting_time TEXT,
  location TEXT,
  description TEXT,
  max_members INTEGER
);

-- (events, registrations, prayer_requests, announcements,
--  service_schedule, faq — same as task_008 § Data Model)
```

Apply with:

```bash
wrangler d1 create lsc-bot
wrangler d1 execute lsc-bot --file=src/db/schema.sql
```

For repeated dev: `wrangler d1 execute lsc-bot --local --file=...` against the local SQLite simulator.

---

## Compatibility verified in Phase 0

### `@line/bot-sdk` on Workers — ✅ confirmed working

`@line/bot-sdk@10.6.0` loads cleanly under `nodejs_compat`. `validateSignature()` and `messagingApi.MessagingApiClient` constructor both work. File-upload helpers were not tested (we don't use them yet) — verify if/when we need image upload to LINE.

Original concern (kept for context): the SDK depends on `axios` + `form-data` + some Node streams. None of that surfaced as a problem in the spike. Fallback hand-rolled client below is no longer needed but kept for reference in case future SDK upgrades break compatibility:

```typescript
// fallback shape if SDK is incompatible
const replyMessage = async (replyToken: string, messages: LineMessage[]) => {
  return fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
};
```

### Signature verification — risk: low

Web Crypto handles HMAC-SHA256 natively. ~10 lines:

```typescript
const verify = async (body: string, signature: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    Uint8Array.from(atob(signature), c => c.charCodeAt(0)),
    new TextEncoder().encode(body),
  );
};
```

### JSON imports — risk: zero

Workers + Wrangler bundle static JSON imports directly into the JS bundle. `import faq from "../data/faq.json"` works as-is.

---

## Local dev workflow

```bash
# one-time setup
npm install -D wrangler @cloudflare/workers-types hono
wrangler login
wrangler d1 create lsc-bot                    # writes id to wrangler.toml manually
wrangler d1 execute lsc-bot --local --file=src/db/schema.sql
wrangler secret put LINE_CHANNEL_ACCESS_TOKEN # paste from LINE console
wrangler secret put LINE_CHANNEL_SECRET

# daily dev loop
wrangler dev                  # runs Worker locally with local D1
wrangler dev --remote         # runs on Cloudflare's edge with a *.workers.dev preview URL
                              # → use this URL as LINE webhook for live testing
```

`cloudflared` is no longer needed — `wrangler dev --remote` gives us a public preview URL straight from Cloudflare's edge.

---

## Deployment workflow

```bash
wrangler deploy                            # one command, ~20s
wrangler tail                              # stream production logs
wrangler d1 execute lsc-bot --file=...     # run migrations against prod
```

Future: GitHub Action that runs `wrangler deploy` on push to `main`. Defer until basic deployment is stable.

---

## Migration phases

### Phase 0 — Compatibility spike ✅ DONE (2026-05-14)
- [x] Created throwaway Worker at `spike/cloudflare-workers/` (wrangler 4.91.0, nodejs_compat flag)
- [x] `@line/bot-sdk@10.6.0` imports under workerd — `messagingApi.MessagingApiClient`, `validateSignature`, `webhook.Event` types all resolve
- [x] Signature verification: HMAC-SHA256 via `validateSignature()` correctly accepts valid sig and rejects bad sig (verified with `curl -X POST` + openssl-computed HMAC)
- [x] Webhook routing via Hono works — `/` and `/webhook` both respond as expected
- [x] **Decision**: keep `@line/bot-sdk`. No hand-rolled fallback needed for signature + reply. `client.replyMessage` was not tested against a real LINE channel (would need real access token), but the SDK loads + the type signature matches, so confidence is high. Test live in Phase 1 when we point a real channel at `wrangler dev --remote`.

**Spike artifacts**: `spike/cloudflare-workers/wrangler.toml`, `src/worker.ts`, `tsconfig.json`. Keep as smoke test until Phase 1 ports the real bot; can delete after Phase 1 ships.

**Compat note**: had to import `webhook.Event` not `WebhookEvent` (top-level export name in v10 SDK is `webhook` namespace, not the older `WebhookEvent` symbol).

### Phase 1 — Skeleton on Workers (3–4 hours)
- [ ] `wrangler.toml`, `tsconfig.json` updated, install Hono + wrangler
- [ ] Rewrite `src/index.ts` + replace `src/server.ts` with Hono fetch handler
- [ ] Rewrite `src/config.ts` to use `env` bindings
- [ ] Update `src/line/webhook.ts` for Web Crypto signature verification
- [ ] `info` + `qa` modules ported, tested with `wrangler dev --remote`
- [ ] Rich menu setup script unchanged (still runs as local Node script)
- [ ] Point LINE webhook at the preview URL — verify end-to-end on phone

### Phase 2 — D1 + DB-backed modules (1–2 sessions)
- [ ] `wrangler d1 create`, write `schema.sql`, apply locally
- [ ] `src/db/client.ts` query helper
- [ ] `scripts/migrate.ts` wraps `wrangler d1 migrations apply`
- [ ] `registration`, `prayer`, `giving`, `staff` modules wired up
- [ ] Deploy + apply migrations against prod D1

### Phase 3 — Scheduling & groups
- [ ] `schedule`, `groups`, `songs` modules
- [ ] (Songs module reuses `lib/parser.ts`, `lib/pinyin.ts` — verify they run in Workers; `pinyin-pro` claims to be ESM-compatible)

### Phase 4 — Events & broadcasts
- [ ] `events`, `promotion` modules
- [ ] Cron Trigger handler in Worker `scheduled` export (e.g., Sat-evening Sunday-prep reminder)
- [ ] R2 bucket for event poster images (when actually needed, not before)

### Phase 5 — Polish
- [ ] GitHub Action for `wrangler deploy` on `main`
- [ ] Error logging via `wrangler tail` or Workers Logs / Logpush
- [ ] LIFF mini-apps for complex forms (if needed)

---

## Cost estimate (small-church-realistic)

Active users: ~20 families × ~3 devices avg = ~60 LINE users. Webhook traffic: probably <1000 req/day even with rich activity.

| Resource | Free tier limit | Expected usage | Status |
|---|---|---|---|
| Workers requests | 100k / day | <1k / day | ✅ Well within |
| Workers CPU time | 10ms × 100k / day | <1ms/req × 1k/day | ✅ |
| D1 reads | 5M / day | <10k / day | ✅ |
| D1 writes | 100k / day | <500 / day | ✅ |
| D1 storage | 5 GB | <50 MB realistically | ✅ |
| R2 (if used later) | 10 GB storage, 1M reads/month | tiny | ✅ |
| Cron Triggers | unlimited | <10 / day | ✅ |

**Expected monthly cost: $0.** Even if the church grew 10×, still free tier.

---

## Risks & open items

- [ ] **`@line/bot-sdk` compatibility** — settle in Phase 0 (see above)
- [ ] **`pinyin-pro` in Workers** — claims ESM compatibility; verify before Phase 3
- [ ] **Cron Trigger time zones** — Workers crons are UTC only; need to express TW-time (UTC+8) reminders in UTC
- [ ] **D1 backup strategy** — D1 has automatic point-in-time recovery on paid plans; on free tier we should `wrangler d1 export` periodically to a local file or R2
- [ ] **`wrangler dev --remote` preview URL** — preview URLs change per deploy; for live testing you may want to bind a permanent route (e.g., `bot-dev.lsc.church`) for a stable LINE webhook in dev
- [ ] **Secrets for `setup-rich-menu.ts`** — local Node script still reads `.env`, so we need to keep `.env.example` even after Workers migration

---

## Decision needed before starting

This is a **draft plan**, not committed work. Before any code change:

1. Confirm Cloudflare Workers + D1 is the deployment target (alternative considered: Pages Functions, Containers — see chat history)
2. Confirm dropping Cloud Run as backup (decided 2026-05-12: yes, full Cloudflare commit)
3. Run **Phase 0 spike** before sinking more time — if `@line/bot-sdk` is incompatible we have a small extra cost, not a blocker, but better to know early

After Phase 0, the rest of the migration is mechanical.

---

## Reference

- Hono docs: <https://hono.dev>
- Wrangler docs: <https://developers.cloudflare.com/workers/wrangler/>
- D1 docs: <https://developers.cloudflare.com/d1/>
- `nodejs_compat` flag: <https://developers.cloudflare.com/workers/runtime-apis/nodejs/>
- LINE Messaging API HTTP reference (for hand-rolled fallback): <https://developers.line.biz/en/reference/messaging-api/>
