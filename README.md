# LSC LINE Bot

LINE Official Account bot for Living Spring Church (活泉靈糧堂).

A church admin automation platform handling announcements, scheduling, small groups, events, registration, giving, prayer requests, staff directory, and more — all through LINE.

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **LINE Official Account** with Messaging API enabled
- **cloudflared** (for local development) — `brew install cloudflared`

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your LINE credentials:

```
LINE_CHANNEL_ACCESS_TOKEN=<from LINE Developers Console>
LINE_CHANNEL_SECRET=<from LINE Developers Console>
PORT=3000
```

To get these values:
1. Go to [LINE Developers Console](https://local-developers.line.biz/console/)
2. Create a **Provider** (or use existing)
3. Create a **Messaging API** channel
4. Under **Basic settings** → copy **Channel secret**
5. Under **Messaging API** → issue and copy **Channel access token (long-lived)**

### 3. Local development

Use the Claude Code skill to start everything at once:

```
/local-dev
```

This starts the dev server + cloudflared tunnel and gives you the webhook URL.

**Or manually:**

```bash
# Terminal 1: start dev server (hot reload)
npm run dev

# Terminal 2: expose via cloudflared tunnel
cloudflared tunnel --url http://localhost:3000
```

### 4. Set webhook URL in LINE (first time only)

1. Go to LINE Developers Console → your channel → **Messaging API** tab
2. Set **Webhook URL** to: `https://xxxx.trycloudflare.com/webhook`
3. Click **Verify** — should show success
4. Enable **Use webhook**
5. Disable **Auto-reply messages** in LINE Official Account Manager (under Response settings)

> **Note:** The cloudflared URL changes each restart. Update the webhook URL in LINE Developers Console each time, or set up a named tunnel with a Cloudflare account for a stable domain.

### 5. Test it

Open your LINE app, add the bot as a friend (via QR code from LINE Developers Console), and send:

- **「教會」** — get church info flex message
- **「幾點」** or **「地址」** — FAQ auto-reply
- Any other text — get the default menu guide

### 7. Set up rich menu (optional)

```bash
npm run setup-rich-menu
```

Then upload a 2500×1686 image via LINE Official Account Manager.

## Project Structure

```
lsc/
├── src/
│   ├── index.ts              # App entry, module registration
│   ├── config.ts             # Env config
│   ├── server.ts             # Express webhook server
│   ├── line/
│   │   ├── client.ts         # LINE API client
│   │   ├── webhook.ts        # Event router → modules
│   │   ├── richMenu.ts       # Rich menu setup
│   │   └── messages/
│   │       └── flex.ts       # Flex message builders
│   └── modules/
│       ├── types.ts          # ModuleHandler interface
│       ├── info/handler.ts   # Church info
│       ├── qa/handler.ts     # FAQ / fallback
│       └── ...               # Future: schedule, groups, events, etc.
├── data/                     # Static JSON (church info, FAQ, staff)
├── scripts/                  # Setup scripts
├── songs/                    # Song library (JSON)
├── worship/                  # Worship history
└── dev/                      # Design docs & tasks
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled production server |
| `npm run setup-rich-menu` | Provision LINE rich menu |

## Module System

Each feature is a self-contained module implementing `ModuleHandler`:

```typescript
interface ModuleHandler {
  name: string;
  canHandle(event: WebhookEvent): boolean;
  handle(ctx: ModuleContext): Promise<void>;
}
```

Modules are registered in priority order in `src/index.ts`. First match wins.

| Module | Trigger | Status |
|--------|---------|--------|
| info | "教會", postback `action=info` | ✅ |
| qa | Any unmatched text (fallback) | ✅ |
| schedule | "主日", postback `action=schedule` | Planned |
| groups | "小組", postback `action=groups` | Planned |
| events | "活動", postback `action=events` | Planned |
| registration | "報名", postback `action=register` | Planned |
| giving | "奉獻", postback `action=giving` | Planned |
| prayer | "代禱", postback `action=prayer` | Planned |
| staff | "同工", postback `action=staff` | Planned |
| promotion | Admin broadcast | Planned |
| songs | "詩歌", postback `action=songs` | Planned |

## License

Internal use for Living Spring Church.
