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
- **Deployment**: Google Cloud Run (free tier, auto-HTTPS)

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
│   │   └── songs/handler.ts     # Song search (reuses existing lib/)
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

---

## Data Model (SQLite)

### Key Tables

- **users** — line_user_id (PK), display_name, role (member/leader/admin/pastor), phone, email
- **small_groups** — id, name, leader_user_id, meeting_day, meeting_time, location, description, max_members
- **group_members** — group_id, user_id, joined_at
- **events** — id, title, description, date, location, registration_deadline, max_attendees, image_url
- **event_registrations** — event_id, user_id, status (confirmed/waitlisted/cancelled)
- **prayer_requests** — id, user_id, content, is_anonymous, is_shared, created_at
- **announcements** — id, title, body, image_url, scheduled_at, sent_at, created_by
- **service_schedule** — id, date, worship_leader, speaker, topic, song_list (JSON), volunteers (JSON)
- **faq** — id, question, answer, keywords, category, sort_order

Songs remain as JSON files in `songs/` — no DB migration needed.

---

## Rich Menu Layout (2×3)

```
┌─────────────┬─────────────┬─────────────┐
│   主日崇拜   │    小組     │    活動      │
│  (Schedule)  │  (Groups)   │  (Events)   │
├─────────────┼─────────────┼─────────────┤
│   代禱請求   │   奉獻      │   更多       │
│  (Prayer)   │  (Giving)   │   (More)    │
└─────────────┴─────────────┴─────────────┘
```

"More" opens: Church Info, Staff, Songs, FAQ, Registration.

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

### Phase 1 — Foundation ← CURRENT
- [x] Update package.json (swap deps)
- [x] Update .gitignore
- [ ] Express + @line/bot-sdk webhook server
- [ ] Event router with module dispatch
- [ ] `info` module (static church data)
- [ ] `qa` module (FAQ from JSON)
- [ ] Rich menu setup script
- [ ] .env config

### Phase 2 — Core Features
- [ ] SQLite schema + migration
- [ ] `registration` module (multi-step conversation)
- [ ] `prayer` module (submit + notify pastors)
- [ ] `giving` module (static links)
- [ ] `staff` module (static data)

### Phase 3 — Scheduling & Groups
- [ ] `schedule` module (reads worship/ + DB)
- [ ] `groups` module (DB-backed, sign-up flow)
- [ ] `songs` module (reuses lib/parser, lib/pinyin)

### Phase 4 — Events & Broadcasts
- [ ] `events` module (carousel, registration)
- [ ] `promotion` module (admin broadcast via push API)
- [ ] Scheduled broadcasts (node-cron)

### Phase 5 — Polish
- [ ] Rich menu graphics design
- [ ] LIFF mini-apps for complex forms (if needed)
- [ ] Error handling, logging, monitoring
- [ ] Admin text commands from LINE

---

## Deployment

- **Dev**: `npm run dev` + ngrok for webhook tunnel
- **Prod**: Google Cloud Run (free tier, auto-HTTPS)
- **Database**: SQLite file on persistent volume; upgrade to PostgreSQL if needed later

## Environment Variables

```
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
PORT=3000
DATABASE_URL=./data/lsc.db
NODE_ENV=production
ADMIN_LINE_USER_IDS=  # comma-separated
```
