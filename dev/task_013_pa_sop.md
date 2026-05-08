# Task 013: PA SOP & Volunteer Training Curriculum

## Status: Scaffolded — filling in TBDs (2026-05-08)

## Description
Build out the production / A/V (PA) function for Sunday service — covering the mixer, speakers, cables, laptop, presentation clicker, USB-stick handoff, Google Slides sync, prayer-set pads & beds, Sunday school A/V, and incident response. Two deliverables:

1. **Reference SOP** — versioned markdown under `data/sop/pa/`, the source of truth.
2. **Volunteer training curriculum** — six 45-minute classes with PPTX slide decks, designed so a brand-new volunteer can shadow → solo → train others.

Per user direction: **iterate on this task doc first**; the SOP markdown and training PPTX are downstream artifacts produced once the design is locked.

---

## Locked Decisions (2026-05-08)

| Item | Decision | Implication |
| --- | --- | --- |
| Mixer | **Yamaha MG16XU** (16-ch analog with USB I/O + onboard SPX effects) | No scene recall — every Sunday starts from physical knob positions. SOP needs a "Sunday baseline" reference photo + a channel map; volunteers learn to read knobs, not to recall presets. |
| Slide application | **PowerPoint (.pptx)** | Cross-platform, opens in Keynote / Google Slides / Office. Mac/Windows-agnostic for whichever laptop is on duty. |
| Slide source of truth | **Triple-source pattern** — USB handoff (preacher's sermon deck), Google Slides (collaboration / last-minute edits for worship & announcements), GitHub repo (archive + PPTX generation pipeline) | SOP `05-slides-and-laptop.md` documents merge protocol: which deck wins, when each is loaded, where final PPTX is archived after service. |
| Pain points | **(a)** Need more youth + volunteers in rotation (onboarding scale-out). **(b)** Experienced volunteers needed for setup/teardown so cables and gear are protected. | Curriculum emphasis: gear-care + onboarding scaffolding. De-emphasize deep audio theory. Class 2 leads with "how to handle gear" before "how audio works." |
| Sunday school A/V | **Same room as main service** (shared gear) | No separate `07-sunday-school.md` SOP file needed — fold into the main runsheet as a "ministry segments" subsection. SOP file count drops 10 → 9. |
| Recording | **DJI camera** (DJI's onboard mic — MG16XU USB-out **not** used yet) | v1 SOP documents the DJI-only workflow as-is (press record / stop / archive). Flag the audio-quality improvement opportunity for v2: feed MG16XU USB-out into the laptop or DJI mic-in for line-level audio capture instead of relying on a camera mic in a roomy space. |
| Clicker | **USB dongle (2.4 GHz RF)** | Confirmed correct call — 2.4 GHz RF dongles outperform Bluetooth at 100 ft with bodies in the path (Bluetooth Class 2 is ~33 ft and absorbed by humans). SOP `05-slides-and-laptop.md` includes a **range test at every setup** (back-of-room check) and **spare batteries** in the booth kit. |
| Language | **English first** for v1 SOP and training | Simplifies content production. zh-TW / bilingual translation deferred to a v2 task — primary audience is youth + emerging volunteers, English skews younger anyway. |
| Clicker | **Norwii N29** (2.4 GHz USB dongle, AAA battery, ~100 ft range, integrated air-mouse + laser pointer) | SOP `05-slides-and-laptop.md`: dongle stays in laptop's USB-A (or via USB-C dongle hub on newer MacBooks), spare AAAs in booth kit, range test at every setup. |
| DJI recorder | **ASB01** (model code per Sean's device — verify against label) | TBD: confirm exact model on device label. Likely a DJI Pocket / Action / Mic system. SOP `07-recording.md` documents pre-roll → record → archive workflow. |
| Training cadence | **On-demand, 1-on-1** (when a new volunteer joins) | Curriculum is delivered by trainer-to-trainee, not as a class of 6. Reframes Class 1–6 from "weekly cohort" → "self-paced milestone progression." Each class becomes a checkpoint, not a calendar event. |
| SOP owner / approver | **Shine Zhang** | "Last reviewed by: Shine Zhang — YYYY-MM-DD" footer in each SOP file. |
| Team size | **5 volunteers including Shine** | Realistic rotation: 1-in-5 weeks if everyone solos, or 2-deep pairs across the month. Small enough that knowledge sharing happens organically — but also small enough that one absence breaks the schedule. Onboarding focus is right. |
| Venue / load-in | **Hybrid — fixed building, locked-office storage**. Mixer (and TBD: laptop, mics, etc.) lives in a locked office between Sundays; permanent gear (speakers, projector, stage cabling) stays at its booth/stage position. | `02-pre-service.md` becomes a ~20–30 min retrieve-and-connect routine, not a 90-min load-in. `08-teardown.md` mirrors it: disconnect, return to office, lock. `01-equipment-inventory.md` annotates each item with **office** vs. **booth/stage** vs. **permanent install**. Inventory check (nothing missing or mis-stored) becomes part of pre-service. |

### Pain-point-driven emphasis

The two pain points converge on one principle: **the most valuable PA training is the part that protects gear and shortens onboarding, not the part that teaches mixing artistry.** That reframes priorities:

- **Higher** priority: cable handling (over-under coil, no yanking, no stepping on, strain relief), connector care (pull plug not cable, dust caps), speaker-pop prevention (power-on sequence: source first, amp last; power-off reverse), gain staging basics (no red lights), labeling, channel map.
- **Lower** priority: advanced EQ, compression theory, multi-bus routing, complex monitor mixes — the MG16XU is small enough that the basics carry most Sundays.

### MG16XU-specific notes

- **Channel layout** (locked 2026-05-08).
  MG16XU has **8 mono channels (1–8) and 4 stereo pairs (9/10, 11/12, 13/14, 15/16)** — each stereo pair has a single linked fader.
  | Fader | Source | Notes |
  | --- | --- | --- |
  | 1–4 (mono) | Instruments | DI / line for guitar, bass, keys, etc. — independent fader each |
  | 5–8 (mono) | Microphones (worship vocals) | Wireless handhelds / wired vocal mics — independent fader each |
  | 9/10 (stereo) | Extra instruments | **XLR inputs only** (TRS/1/4" not used). One linked fader for the pair |
  | 11/12 (stereo) | Pastor wireless mic (line-level) | **Single balanced XLR** from the wireless receiver direct into one Ch 11/12 input. The MG16XU auto-mono-sums to L+R internally when only one side is connected — no Y-cable, no hard-pan, full level |
  | 13/14 (stereo) | **Open / spare** (intentional) | Reserved for guest speakers, second laptop, ad-hoc use. Leave fader down by default; label "OPEN" on the console |
  | 15/16 (stereo) | Computer (laptop audio) | One linked fader — slides music, pads, pre-service music |
  | Aux 1 | Monitor speaker send | Stage monitor |
- **"Sunday baseline" photo** — after a confirmed-good Sunday, photograph the console front. Print A5, laminate, post inside the booth. Volunteers compare on setup day.
- **Onboard SPX effects** — usually one preset (small hall reverb on vocal aux). Lock and label, don't tweak weekly.
- **USB I/O** — useful for recording the service direct-to-laptop. Out of scope for v1 unless livestreaming is a goal (open question).

### Laptop policy (proposed — needs your sign-off)

Given **MacBook preferred**, **5-volunteer team**, **on-demand training**, here's a draft policy. Push back on anything that doesn't fit:

**Device**
- **One church-owned booth MacBook** (single shared device). Eliminates "did you bring the right files?" Sunday-morning chaos and standardizes the whole team on one set of installed apps.
- If a dedicated booth Mac isn't in budget yet, designate **Shine's MacBook** as the official booth machine; plan to acquire dedicated hardware in the next budget cycle.
- **Backup laptop**: a second MacBook (a volunteer's personal device) registered as the emergency fallback, with at least PowerPoint + Google Drive desktop installed and the team aware it can be pressed in.

**User account**
- Single shared **`PA` macOS user account** (not individual logins). Keeps slide app open in known position, files in known location, and avoids "but it works on my login" issues during volunteer rotation.
- Password known to all 5 volunteers; rotate annually or when someone leaves the team.
- FileVault on (standard hygiene); no PII on this laptop is expected, so the bar is low.

**Software baseline**
- macOS — current major minus 1 (don't run beta or the just-released version on Sunday)
- **PowerPoint** (Office 365 — pinned to dock)
- **Keynote** (built-in, fallback for opening .pptx on the off chance)
- **Google Drive desktop** (sync `LSC-Service` folder)
- **Google Chrome** (Google Slides, occasional web embeds)
- **VLC** (any media file that PowerPoint chokes on)
- **Norwii N29 dongle**: just plug in, no driver needed
- macOS Auto-update **off**; Shine triggers updates manually on a non-Sunday

**File locations**
- `~/Documents/LSC-Service/` — the canonical service folder, mirrored to Google Drive
  - `YYYY/MM-DD/` per-Sunday subfolder
  - `service.pptx`, `sermon.pptx`, `merged.pptx`, `bulletin.pdf`
- `~/Documents/LSC-Service/templates/` — master worship slides, lyric slides, announcement template
- USB sticks copy here, never run-from-USB (USBs fail mid-service)

**Sunday-morning settings**
- **Caffeinate** the display (`caffeinate -d` in Terminal, or use Amphetamine app) — never let the screen sleep mid-service
- **Do Not Disturb** on (no Slack / Messages popups during sermon)
- Notifications, AirDrop banners, screen-sharing prompts all silenced
- Power adapter plugged in (don't trust battery)
- Display mirroring set to projector before service, **tested with the actual deck**

**Updates & maintenance**
- Shine owns: macOS updates, Office updates, Google Drive sync verification
- Cadence: monthly check on a non-Sunday; emergency only if security patch is critical
- Quarterly: clear old `LSC-Service/YYYY/` folders that are already in Drive

**What this policy does NOT do** (intentional simplifications):
- No MDM / device management (overkill for 5 people).
- No per-volunteer SSH keys or fancy access control.
- No automated backup scripts beyond Google Drive sync.

---

### Slide-handoff workflow (triple-source)

```
Preacher                 Worship/Announcements              Archive
   │                           │                              │
   │ USB stick                 │ Google Slides (live edits)   │
   ▼                           ▼                              │
[Sermon.pptx]              [Worship.pptx]                     │
   │                           │                              │
   └────────── merged ─────────┘                              │
                  │                                           │
                  ▼                                           │
        Service.pptx on laptop ◄─── runs Sunday ───►  GitHub archive
                                                       (post-service push)
```

Key rules to enforce in `05-slides-and-laptop.md`:
1. **USB virus / sanity check first** — open in a sandbox or scan; sermon USB sticks travel between machines.
2. **File naming**: `YYYY-MM-DD-service.pptx`, `YYYY-MM-DD-sermon.pptx`.
3. **Last-edit window closes T-15** (15 min before service). After that, slides are frozen except for emergencies.
4. **Post-service archive** — final deck pushed to `data/sermons/YYYY/MM/` (path TBD with `task_010` website integration).
5. **Offline fallback** — final merged deck always lives on the laptop locally even if pulled from Google Slides; WiFi drop must not break the service.

---

## Why both SOP and training

- **SOP without training**: volunteers get a wall of text and never read it. SOP becomes a binder no one opens.
- **Training without SOP**: knowledge lives in one person's head. When that person is sick, Sunday breaks.
- **Both, with the training built from the SOP**: the SOP is the canonical content; the slides are the teaching layer. They stay in sync because the slides are derived.

---

## Scope

**In scope (the PA role, broadly)**:
- Audio: mixer, mics (handheld, lavalier, headset, drum mics), monitors / IEMs, FOH speakers, cables, DI boxes
- Slides & visuals: laptop, slide application, presentation clicker, USB-stick handoff, Google Slides cloud sync, projector / screens
- Music underscoring: worship pads, prayer beds, key changes, pre-service music
- Adjacent rooms: Sunday school A/V (separate-room setup)
- Recording / livestream (if applicable — TBD per open questions)
- Incident response: last-minute deck swaps, mic failures, WiFi drops, clicker batteries, application freezes
- Onboarding: shadow → solo → trainer progression

**Out of scope** (lives elsewhere):
- Worship-team song selection (worship leader's domain)
- Sermon content (preacher's domain)
- Video editing / post-production
- Building infrastructure (electrical, network) — escalate to deacons

---

## Deliverable A — Reference SOP

Proposed file layout:

```
data/sop/pa/
├── README.md                    — index, how to use, change log
├── 01-equipment-inventory.md    — gear list, locations, ownership, replacement cost,
│                                  including DJI camera & USB clicker dongle
├── 02-pre-service.md            — T-90 → T-0 checklist (incl. clicker range test)
├── 03-rehearsal.md              — sound check sequence, monitor mix
├── 04-service-runsheet.md       — cue-by-cue: pre-service → call to worship → worship
│                                  set → announcements → offering → sermon → response
│                                  → benediction → post-service music
│                                  (Sunday school = ministry segment in same room)
├── 05-slides-and-laptop.md      — laptop boot, slide app, USB clicker pairing,
│                                  USB-stick sermon handoff, Google Slides sync,
│                                  GitHub archive, offline fallback
├── 06-pads-and-beds.md          — pads library, prayer-bed transitions, key changes
├── 07-recording.md              — DJI camera workflow: pre-roll, record start/stop,
│                                  storage, post-service archive (v2: route MG16XU
│                                  USB-out for line-level audio)
├── 08-teardown.md               — power-down sequence, cable wrap (over-under),
│                                  gear stow, lock-up
├── 09-incident-playbook.md      — Plan B for everything: deck-swap-at-9:55, mic dies
│                                  mid-prayer, WiFi drops, clicker battery dead,
│                                  DJI storage full, slide app freezes, feedback loop
└── 10-onboarding.md             — shadow → solo → trainer progression, sign-off checklist
```

Format conventions:
- Each file opens with a 2-sentence purpose, a "who reads this" line, and a "last reviewed" date.
- Checklists are GitHub-flavored markdown so the same files can be exported to PDF for the booth.
- Keep each file printable on 1–2 pages where possible — A/V volunteers reference these mid-service.

---

## Deliverable B — Training Curriculum (6 × 45min classes)

Pedagogical arc: **theory → audio → mixer → slides → service flow → solo + incidents**.

| # | Class | Maps to SOP | Hands-on |
| --- | --- | --- | --- |
| 1 | **Why PA serves the church** — role, mindset, gear tour, service flow at a glance | README, 01 | Listen + observe; gear-name quiz at end |
| 2 | **Gear & cables — protect what we have** — cable types, over-under coil, strain relief, connectors, dust caps, power-on / power-off sequence (no speaker pops), labeling. *Just enough audio theory to motivate the care.* | 01, 02, 08 | Coil 5 cables correctly; identify connectors; practice power sequence |
| 3 | **MG16XU hands-on** — channel strip walkthrough, gain staging (no red lights), EQ basics, monitor sends, the SPX reverb preset, the **Sunday baseline photo** | 01, 03 | Set gain on 4 mics; build a basic worship mix from rehearsal |
| 4 | **Slides workflow — triple-source merge** — PPTX, USB virus check, Google Slides live edits, GitHub archive, T-15 freeze rule, offline fallback, clicker pairing | 05 | Load preacher USB → merge with worship deck → run with clicker |
| 5 | **Sunday runsheet — setup to teardown** — T-90 → T-0 checklist, cue-by-cue service flow, teardown sequence (gear protection emphasized), watching a recorded service together | 02, 04, 08 | Run setup against the checklist; teardown in correct sequence |
| 6 | **Incidents + final solo** — top-10 incidents drill, mock service solo (trainer observes silently), sign-off rubric | 09, 10 | Solo a mock service start-to-finish, then debrief |

Class format:
- 5 min: opening + recap
- 25 min: teach (slides + live demo at the booth)
- 10 min: hands-on practice
- 5 min: take-home (read SOP file X, watch video Y)

### Slide authoring strategy

- **Markdown is source of truth.** Each class has a `data/sop/pa/training/class-N.md` with talk script + slide-by-slide content.
- **PPTX is derived.** We have prior feedback that python-pptx output doesn't hit NotebookLM quality (`feedback_slide_quality.md`). For training decks, treat PPTX as the rendered artifact:
  - Author content in markdown.
  - Use Google Slides or Keynote for visual polish, OR
  - Try Gemini / NotebookLM slide generation from the markdown source.
- Repo commits the markdown; PPTX/PDF live alongside but are regenerated when content changes.

### YouTube reference videos

Captured for inclusion in the curriculum (specific class TBD once content is reviewed):

- https://youtu.be/o_0F8mdlARE  ← TODO: review and tag with class number + 1-line summary
- https://youtu.be/EEa3d0N9S3Q  ← TODO: review and tag with class number + 1-line summary

Likely homes (best guess until reviewed):
- Beginner overview / theology of serving → Class 1
- Audio / signal flow / gain staging → Class 2
- Mixer-specific walkthrough → Class 3 (only if it matches our console)
- Worship pads / underscoring → Class 4 (or 6)

---

## Iteration Plan

This task gets refined before any SOP markdown is written. Order of operations:

1. **Lock the scope** (you + me, async) — answer the five questions below.
2. **First-pass SOP outline** — populate each `01–10` file with H2/H3 headings only, no content. Review together.
3. **Fill SOP content** — one file at a time, starting with `01-equipment-inventory.md` (foundation for everything else).
4. **Draft training curriculum markdown** — class 1 first, review, then iterate.
5. **Render first training PPTX** — Google Slides or NotebookLM, review for visual quality.
6. **Pilot with one volunteer** — they shadow with the SOP in hand; gaps surface fast.
7. **Revise from the pilot.**
8. **Roll out to the team.**

---

## Open Questions

Resolved (2026-05-08): mixer (MG16XU), slide app (PPTX), slide source of truth (USB + Google Slides + GitHub), pain points (onboarding scale-out + gear protection), Sunday school A/V (same room), recording (DJI camera), clicker (Norwii N29 USB dongle 2.4 GHz), language (English first), channel map (Ch 1–8 mono / 9–16 stereo pairs; pastor mic = single balanced XLR auto-summed), training cadence (on-demand 1-on-1), SOP owner (Shine), team size (5).

Still open:

1. **Office-storage scope** — the mixer goes into the locked office. What else? Likely: laptop, wireless receivers, handheld mics, USB clicker dongle, USB sticks, spare batteries. Stage cabling, FOH speakers, projector, screen presumably stay at the booth/stage as permanent installs. Need a definitive list per item to populate `01-equipment-inventory.md` correctly.
2. **DJI model code verification** — "ASB01 or similar" recorded; needs a label-on-device check next time at church to lock the exact model and any firmware/SD-card specifics for `07-recording.md`.

---

## Cross-References

- **`task_002` slide generator** & `feedback_slide_quality.md` — PPTX automation isn't yet at NotebookLM quality; influences slide-authoring strategy above.
- **`task_010` website** — PA SOP could surface a public "serve with us" page linking to the volunteer onboarding sequence.
- **`task_008` LINE bot** — class scheduling / reminders for new volunteers could route through the bot in v2.
