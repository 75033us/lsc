---
name: local-dev
description: Start local dev environment for LINE bot — runs npm dev server and cloudflared tunnel, returns webhook URL
disable-model-invocation: true
---

# Start Local Development Environment

Start the LINE bot development stack and provide the webhook URL.

## Steps

1. **Kill any existing processes** on port 3000 (lsof -ti:3000 | xargs kill 2>/dev/null) and any running cloudflared processes (pkill cloudflared 2>/dev/null). Do not ask for confirmation — these are safe cleanup steps.

2. **Start the dev server** in the background:
   ```bash
   npm run dev
   ```
   Run this with `run_in_background: true`. Do not wait for it.

3. **Start cloudflared tunnel** in the background:
   ```bash
   cloudflared tunnel --url http://localhost:3000 2>&1
   ```
   Run this with `run_in_background: true`. Do not wait for it.

4. **Wait 5 seconds** then read the cloudflared background task output file to find the tunnel URL. Look for a line containing `https://` and `.trycloudflare.com`.

5. **Report to the user** with:
   - The dev server status (running on port 3000)
   - The cloudflared tunnel URL
   - The full webhook URL: `<tunnel-url>/webhook`
   - A reminder to set this URL in LINE Developers Console if it changed

## Stopping

To stop the dev environment, the user can just kill the processes:
```bash
pkill cloudflared; lsof -ti:3000 | xargs kill
```
