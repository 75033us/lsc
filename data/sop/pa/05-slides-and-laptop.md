# 05 · Slides, Laptop, and the Triple-Source Workflow

**Purpose**: How to handle the slide pipeline — preacher's USB stick, worship/announcement edits in Google Slides, and the GitHub archive — without losing material, missing deadlines, or running stale versions on Sunday morning.
**Audience**: PA volunteer on duty + slides operator (often the same person).
**Last reviewed**: 2026-05-08 — Shine Zhang

---

## The triple-source pattern

We have **three source-of-truth locations** for slide content. Each plays a different role:

```
Preacher                 Worship & Announcements          Archive
   │                            │                            │
   USB stick                    Google Slides                GitHub repo
   (Sunday-morning              (collaborative,              (post-service
    handoff)                     last-minute edits)           PPTX archive)
   │                            │                            │
   ▼                            ▼                            │
[Sermon.pptx]                [Worship.pptx]                  │
   │                            │                            │
   └────── merged on ───────────┘                            │
            laptop                                           │
              │                                              │
              ▼                                              │
       Service.pptx ──────── runs Sunday ──────────►   committed after
       (canonical)                                       the service
```

---

## Hard rules

These five rules exist because each one has been broken by someone, somewhere, on a Sunday. Don't be the next.

1. **USB virus / sanity check first.** Sermon USBs travel between machines. Open the deck in PowerPoint Protected View; never auto-run macros; copy the file to `~/Documents/LSC-Service/YYYY/MM-DD/sermon.pptx` before opening normally.
2. **File naming**: `YYYY-MM-DD-service.pptx`, `YYYY-MM-DD-sermon.pptx`, `YYYY-MM-DD-worship.pptx`. The merged Sunday-of-service deck is `service.pptx` in today's folder.
3. **T-15 freeze**: 15 min before service start, the slide deck is **frozen**. No further edits — Google Slides closed, local file saved. Emergencies only.
4. **GitHub archive after service**: post-service, the final `service.pptx` (and `sermon.pptx`) gets committed to the repo's archive folder. <!-- TBD: exact path — likely `data/sermons/YYYY/MM/` -->
5. **Offline fallback**: the final merged deck **must always live locally on the laptop**, even if pulled from Google Slides. WiFi drop must not break the service.

---

## Sunday-morning handoff workflow

### When the preacher arrives with a USB

1. Plug USB into laptop
2. Open Finder; **don't auto-open** the deck
3. Right-click the .pptx → "Open with → PowerPoint" (Protected View loads)
4. Close it; copy the .pptx to `~/Documents/LSC-Service/YYYY/MM-DD/sermon.pptx`
5. Eject the USB
6. Re-open the **copied** file from the laptop, not from the USB

### When worship/announcements live in Google Slides

1. Sign in (PA user account is already signed in)
2. Open today's Google Slides deck
3. **File → Download → Microsoft PowerPoint (.pptx)**
4. Save to `~/Documents/LSC-Service/YYYY/MM-DD/worship.pptx`

### Merging the two decks

The simplest reliable approach:

1. Open `worship.pptx` in PowerPoint
2. **Insert → Reuse Slides** (or "Insert Slides from File")
3. Browse to `sermon.pptx`, select all slides, **insert at the right place** (after worship set, before benediction — depends on order of service)
4. **Save As**: `~/Documents/LSC-Service/YYYY/MM-DD/service.pptx`
5. This `service.pptx` is what runs.

### After service

1. Final `service.pptx` (with any in-service modifications) is the canonical record
2. Commit / archive: <!-- TBD: archive path + git command or manual upload -->
3. Original USB returned to preacher

---

## Norwii N29 clicker

- **USB-A 2.4 GHz dongle** — plug into laptop, no driver needed
- **Battery**: 1× AAA. Replace if it shows weak. Don't conserve batteries on Sunday morning.
- **Range**: up to ~100 ft, but bodies (a packed congregation) absorb signal. **Range-test at every setup**: walk to the back of the room, advance a slide, retreat. If it fails, swap the battery before service starts.
- **Why USB dongle, not Bluetooth**: 2.4 GHz RF outperforms Bluetooth (Class 2 ≈ 33 ft) at distance with people in the path. We chose USB deliberately.

If the clicker dies during service: **walk to the laptop, use arrow keys**. Don't mid-service-troubleshoot the clicker; just keep slides moving with the keyboard.

---

## Offline / WiFi-drop fallback

If WiFi drops during the service:

- The local `service.pptx` runs **without internet**. PowerPoint doesn't need a connection.
- Google Drive sync can be offline — pending changes flush when connection returns.
- Do **not** load slides directly from Google Slides web in the browser as your primary pipeline — if WiFi drops, your slides freeze.

If WiFi drops during pre-service slide prep:

- Use the most recent local copy. Note the version mismatch in the volunteer log; reconcile after service.

---

## What a good slide-handoff looks like

- Preacher hands USB at T-60, not T-5
- Worship Google Slides finalized **Saturday night** ideally, **T-30 absolute latest**
- Merged `service.pptx` saved by T-30
- T-15 freeze respected
- Clicker tested, battery fresh
- Display mirroring tested with the actual deck
- DJI recording started at T-5

---

## Open items

- [ ] **`@followup-shine`** — define the GitHub archive path convention (e.g., `data/sermons/YYYY/MM/YYYY-MM-DD-{sermon,service}.pptx`)
- [ ] **`@followup-shine`** — write a small script to auto-archive the deck post-service (optional v2 — can do manually for now)
- [ ] **`@followup-shine`** — designate who owns the worship Google Slides each week (worship leader? rotating?)
