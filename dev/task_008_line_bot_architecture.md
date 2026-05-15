# Task 008: LINE Official Account Bot Architecture

## Status: Active

## Description
Repurpose the LSC repo into a LINE Official Account bot for Living Spring Church (活泉靈糧堂). The bot serves as the church's admin automation platform — handling promotion, scheduling, newcomer info, small groups, events, registration, giving, prayer requests, staff directory, and general Q&A.

The lyrics/slide generation work has moved to `lsc-pptx` (Python, separate repo).

---

## Tech Stack

- **Runtime**: Node.js + TypeScript (existing setup)
- **LINE SDK**: `@line/bot-sdk`
- **HTTP Server**: Express
- **Database**: SQLite via `better-sqlite3` (upgrade to PostgreSQL later if needed)
- **Config**: `dotenv`
- **Deployment**: Cloudflare Workers + D1 (free tier; unified with `lsc.church` on Cloudflare Pages). See `task_014_cloudflare_deployment.md` for the full migration plan.

---

## Directory Structure

```
lsc/
├── src/
│   ├── index.ts                 # App entry point
│   ├── config.ts                # Env config loader
│   ├── server.ts                # Express webhook server
│   ├── line/
│   │   ├── client.ts            # LINE client singleton
│   │   ├── webhook.ts           # Event router → modules
│   │   ├── richMenu.ts          # Rich menu provisioning
│   │   └── messages/
│   │       ├── flex.ts          # Flex message builders
│   │       ├── quickReply.ts    # Quick reply builders
│   │       └── templates.ts     # Reusable message templates
│   ├── modules/
│   │   ├── types.ts             # ModuleHandler interface
│   │   # --- Admin / info ---
│   │   ├── info/handler.ts      # Church info, location, times, beliefs
│   │   ├── schedule/handler.ts  # Sunday service, worship team
│   │   ├── groups/handler.ts    # Small group listing, sign-up
│   │   ├── events/handler.ts    # Event listing, registration
│   │   ├── registration/handler.ts  # New member registration
│   │   ├── giving/handler.ts    # Giving/offering links
│   │   ├── prayer/handler.ts    # Prayer request submission
│   │   ├── staff/handler.ts     # Staff org chart
│   │   ├── promotion/handler.ts # Broadcast announcements
│   │   ├── qa/handler.ts        # FAQ, fallback responses
│   │   ├── songs/handler.ts     # Song search (reuses existing lib/)
│   │   # --- Spiritual formation ---
│   │   ├── qt/handler.ts        # Daily Quiet Time devotional push
│   │   ├── rpg/handler.ts       # Revival Prayer Group content (rpg.777gtv.com)
│   │   # --- Media + content ---
│   │   ├── media/handler.ts     # Inbound photo/video upload + outbound gallery
│   │   ├── slidesFromYoutube/handler.ts  # /slides <YT url> → PPTX via lsc-pptx worker
│   │   └── mixFromYoutubes/handler.ts    # /mix <YT urls...> → audio mix (worship pads / pre-service bed)
│   ├── lib/
│   │   ├── types.ts             # KEEP — song types + extend
│   │   ├── parser.ts            # KEEP — lyrics parser
│   │   ├── pinyin.ts            # KEEP — pinyin generation
│   │   ├── youtube.ts           # KEEP — YouTube metadata
│   │   └── db.ts                # NEW — SQLite abstraction
│   └── db/
│       ├── schema.ts            # Table definitions / migrations
│       └── seed.ts              # Seed data loader
├── data/                        # Static seed JSON
│   ├── faq.json
│   ├── staff.json
│   ├── church-info.json
│   └── beliefs.json
├── scripts/
│   ├── setup-rich-menu.ts       # One-time rich menu provisioning
│   └── migrate.ts               # DB migration runner
├── songs/                       # KEEP — song JSON library
├── worship/                     # KEEP — worship history
└── dev/                         # KEEP — design docs
```

---

## Module Architecture

Each module implements:

```typescript
interface ModuleHandler {
  canHandle(event: WebhookEvent): boolean;
  handle(ctx: ModuleContext): Promise<void>;
}
```

The webhook router iterates modules in priority order; first match wins.

### Admin / church operations

| Module | Trigger (postback / keyword) | LINE Message Type |
|--------|------------------------------|-------------------|
| info | `action=info`, "教會" | Flex bubble (address, map, times) |
| schedule | `action=schedule`, "主日" | Flex bubble (service order table) |
| groups | `action=groups`, "小組" | Flex carousel (one per group) |
| events | `action=events`, "活動" | Flex carousel (image + register btn) |
| registration | `action=register`, "報名" | Quick replies (multi-step form) |
| giving | `action=giving`, "奉獻" | Flex bubble (bank + online links) |
| prayer | `action=prayer`, "代禱" | Text + quick replies (submit → confirm) |
| staff | `action=staff`, "同工" | Flex carousel (photo, name, role) |
| promotion | Admin push / scheduled | Flex bubble (image header + body) |
| qa | Default fallback | Text (FAQ match or auto-response) |
| songs | `action=songs`, "詩歌" | Flex bubble (title + lyrics) |

### Spiritual formation

| Module | Trigger | LINE Message Type | Source |
|--------|---------|-------------------|--------|
| qt | `action=qt`, "靈修", "QT" + daily cron push | Text + image bubble (verse, devotional snippet, "open in browser" button) | Source TBD — likely a JSON of devotionals committed to repo, or pulled from an external feed. Pick a source before building (e.g., 每日活水 / OurDailyBread / hand-curated). `@followup-shine` |
| rpg | `action=rpg`, "RPG", "復興禱告" | Flex bubble linking to relevant `rpg.777gtv.com` page + summary | <https://rpg.777gtv.com/> — Revival Prayer Group resources. No RSS/API; we either curate links manually (low effort) or scrape the teach/speaker pages (more work, fragile). Start with a curated `data/rpg.json` |

### Media + content generation

These three are the heaviest modules — they accept LINE input and produce / store binary assets. They likely need R2 (storage) and/or a separate worker for CPU-bound work.

| Module | Trigger | LINE Message Type | Backend |
|--------|---------|-------------------|---------|
| media (inbound) | Member sends image/video message | Confirmation reply ("Got it, thanks!") | Worker pulls media via LINE Content API → uploads to R2 with `event-id/user-id/timestamp` key. PII note: collect consent in onboarding flow, see `task_012_pii_handling.md` |
| media (outbound) | `action=gallery`, "相簿" | Flex carousel (latest event galleries) | Reads R2 listing; thumbnails served via R2 public URL |
| slidesFromYoutube | `/slides <YT url>` or quick-reply flow | Text "working on it…" → follow-up push with download URL when done | Queues job to **lsc-pptx** (Python repo at `/Users/xlj/workspace/75033us/lsc-pptx`). Mechanism TBD: Worker → Cloud Run / Modal / GitHub Action that runs Python and uploads PPTX to R2 → LINE push with link. `@followup-shine` decide trigger mechanism |
| mixFromYoutubes | `/mix <YT urls...>` | Text "working on it…" → follow-up push with audio URL when done | Same shape as slides: queue → external worker (ffmpeg + yt-dlp) → R2 → push. Use case: pre-service prayer pad track, worship interlude beds. See `data/sop/pa/06-pads-and-beds.md` |

---

## Data Model (SQLite)

### Key Tables

- **users** — line_user_id (PK), display_name, role (member/leader/admin/pastor), phone, email, qt_opt_in (bool)
- **small_groups** — id, name, leader_user_id, meeting_day, meeting_time, location, description, max_members
- **group_members** — group_id, user_id, joined_at
- **events** — id, title, description, date, location, registration_deadline, max_attendees, image_url
- **event_registrations** — event_id, user_id, status (confirmed/waitlisted/cancelled)
- **prayer_requests** — id, user_id, content, is_anonymous, is_shared, created_at
- **announcements** — id, title, body, image_url, scheduled_at, sent_at, created_by
- **service_schedule** — id, date, worship_leader, speaker, topic, song_list (JSON), volunteers (JSON)
- **faq** — id, question, answer, keywords, category, sort_order
- **qt_entries** — id, scheduled_date, passage_ref, devotional_text, image_url, source (one row per day)
- **media_uploads** — id, user_id, event_id (nullable), r2_key, mime_type, caption, uploaded_at, consent_to_share (bool)
- **media_galleries** — id, event_id (or "general"), title, cover_r2_key, sort_order
- **generation_jobs** — id, user_id, type (slides/mix), input_urls (JSON), status (queued/running/done/failed), output_r2_key, error, created_at, completed_at

Songs remain as JSON files in `songs/` — no DB migration needed. RPG curated link list lives in `data/rpg.json` (no DB needed; small static list).

---

## Rich Menu Layout (2×3)

```
┌─────────────┬─────────────┬─────────────┐
│   主日崇拜   │   每日靈修   │    小組      │
│  (Schedule)  │    (QT)     │  (Groups)   │
├─────────────┼─────────────┼─────────────┤
│   代禱請求   │   奉獻      │   更多       │
│  (Prayer)   │  (Giving)   │   (More)    │
└─────────────┴─────────────┴─────────────┘
```

"More" opens: 活動 (Events), 教會 (Info), 同工 (Staff), 詩歌 (Songs), FAQ, 報名 (Registration), 相簿 (Media gallery), RPG, /slides, /mix.

The 6 rich-menu slots are reserved for the highest-frequency actions. `qt` was promoted into the menu because it's a daily-touch module — every user who opens the bot in the morning will tap it. `media`, `rpg`, `slidesFromYoutube`, `mixFromYoutubes` live behind "More" or are surfaced only to specific roles (e.g., worship-team members get a `/mix` quick-reply, regular members don't).

---

## Existing Files Disposition

| File | Action |
|------|--------|
| `src/lib/types.ts` | **KEEP + extend** with bot entities |
| `src/lib/parser.ts` | **KEEP** — songs module uses it |
| `src/lib/pinyin.ts` | **KEEP** — songs module uses it |
| `src/lib/youtube.ts` | **KEEP** — songs module uses it |
| `src/cli.ts` | **REMOVE** — replaced by webhook server |
| `src/commands/import.ts` | **MOVE** logic into songs module |
| `package.json` | **MODIFIED** — swapped deps |
| `.gitignore` | **MODIFIED** — added .env, *.db, dist/, .DS_Store |

---

## Phased Implementation

### Phase 1 — Foundation ✅ COMPLETE
- [x] Update package.json (swap deps)
- [x] Update .gitignore
- [x] Express + @line/bot-sdk webhook server (`src/server.ts`, `src/line/webhook.ts`)
- [x] Event router with module dispatch (`src/line/webhook.ts`, `src/modules/types.ts`)
- [x] `info` module (static church data) (`src/modules/info/handler.ts`)
- [x] `qa` module (FAQ from JSON) (`src/modules/qa/handler.ts`)
- [x] Rich menu setup script (`scripts/setup-rich-menu.ts`)
- [x] .env config (`src/config.ts` + `.env.example`)

### Phase 1.5 — Cloudflare port (parallel to Phase 2 logic) ← CURRENT
- [x] Phase 0 compatibility spike — see `task_014_cloudflare_deployment.md` (done 2026-05-14)
- [ ] Port skeleton (`info`, `qa`) to Hono on Workers — `task_014` Phase 1

### Phase 2 — Core Features
- [ ] D1 schema + migration (`src/db/` exists but empty; `scripts/migrate.ts` referenced in `package.json` but file not yet written)
- [ ] `registration` module (multi-step conversation)
- [ ] `prayer` module (submit + notify pastors)
- [ ] `giving` module (static links)
- [ ] `staff` module (static data)

### Phase 3 — Scheduling, Groups, Songs
- [ ] `schedule` module (reads worship/ + DB)
- [ ] `groups` module (DB-backed, sign-up flow)
- [ ] `songs` module (reuses lib/parser, lib/pinyin)

### Phase 4 — Spiritual formation (daily-touch features)
- [ ] `qt` module — schema, daily Cron Trigger push, opt-in flow. **Decide content source first.**
- [ ] `rpg` module — curated `data/rpg.json` of best RPG links; respond with summary + link

### Phase 5 — Events & Broadcasts
- [ ] `events` module (carousel, registration)
- [ ] `promotion` module (admin broadcast via push API)
- [ ] Scheduled broadcasts (Cron Triggers — see `task_014`)

### Phase 6 — Media (storage-heavy)
- [ ] R2 bucket provision + binding in `wrangler.toml`
- [ ] Consent flow during onboarding (PII baseline — see `task_012`)
- [ ] `media` inbound — receive image/video messages, fetch via LINE Content API, store in R2
- [ ] `media` outbound — gallery carousel reading R2 listings
- [ ] Admin moderation queue (admin reviews uploads before they appear in shared galleries)

### Phase 7 — Generation modules (external-worker-heavy)
- [ ] Pick job-runner mechanism: GitHub Action / Cloud Run / Modal / self-hosted (`@followup-shine`)
- [ ] `slidesFromYoutube` — Worker enqueues job → lsc-pptx runs → uploads PPTX to R2 → pushes link to user
- [ ] `mixFromYoutubes` — Worker enqueues job → ffmpeg/yt-dlp pipeline → uploads audio to R2 → pushes link
- [ ] `generation_jobs` table for status tracking; user can query "status" mid-job

### Phase 8 — Polish
- [ ] Rich menu graphics design
- [ ] LIFF mini-apps for complex forms (if needed)
- [ ] Error handling, logging, monitoring
- [ ] Admin text commands from LINE
- [ ] Role-aware rich menu (worship team sees `/mix`, regular members don't)

---

## Deployment

See `task_014_cloudflare_deployment.md` for the full Workers + D1 migration plan.

- **Dev**: `wrangler dev` (local) / `wrangler dev --remote` (public preview URL for LINE webhook testing)
- **Prod**: Cloudflare Workers + D1 (free tier; same Cloudflare account as `lsc.church`)
- **Database**: D1 (serverless SQLite, same dialect as `better-sqlite3`)

## Environment Variables

Set as Workers secrets via `wrangler secret put`:

```
LINE_CHANNEL_ACCESS_TOKEN
LINE_CHANNEL_SECRET
ADMIN_LINE_USER_IDS    # comma-separated
```

Non-secret config in `wrangler.toml` `[vars]`:

```
NODE_ENV = "production"
```

D1 binding is named `DB` (declared in `wrangler.toml`, not env). `PORT` and file-based `DATABASE_URL` no longer apply on Workers.
