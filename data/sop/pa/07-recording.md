# 07 · Service Recording (DJI)

**Purpose**: How to capture each Sunday service on the DJI camera, store the footage, and keep the workflow simple enough that nobody forgets to press record.
**Audience**: PA volunteer on duty.
**Last reviewed**: 2026-05-08 — Shine Zhang

---

## Current state

We use a DJI camera (model **ASB01** or similar — verify on device label) to record the service. Audio is captured by the **DJI's onboard mic** (room sound).

The MG16XU has a USB-out that could feed line-level audio directly to the laptop or DJI mic-in for noticeably better recording quality. **We are not using it yet** — that's a v2 improvement (see "Future" below).

---

## Pre-service (T-45)

- [ ] Retrieve DJI from office charging cradle
- [ ] Battery ≥ 80% — if lower, swap battery or top up before continuing
- [ ] **Storage card check** — verify enough free space for full service (~ <!-- TBD: GB needed for typical 90-min service at the resolution we use -->)
- [ ] Wipe lens
- [ ] Position DJI on tripod / shelf at <!-- TBD: location — typically rear-of-room facing pulpit -->
- [ ] Test record 30 seconds
- [ ] Play back: confirm audio + video are present and frame is right
- [ ] **Don't start recording yet** — that's T-5

---

## T-5 — start recording

- [ ] Press record
- [ ] **Verify red dot / record LED is on**
- [ ] Walk away. Don't touch it during service unless you have to.

---

## During service

If something goes wrong (ran out of card space, battery died, accidentally stopped):

- Note what happened and at what timestamp
- Don't disrupt service to fix
- Restart at next natural break (between segments)
- The post-service archive folder gets a `notes.txt` describing the gap

---

## Post-service (during teardown)

- [ ] Stop recording
- [ ] Power off DJI
- [ ] Retrieve the file(s) — connect DJI to laptop OR pop the storage card
- [ ] Copy footage to: <!-- TBD: e.g., `~/Documents/LSC-Service/YYYY/MM-DD/recording/` -->
- [ ] Verify the copy completed (file sizes match, ideally play first 10 seconds)
- [ ] Once verified: delete from DJI card to free up space for next week
- [ ] Return DJI to charging cradle in office

---

## Storage / archive

- Local primary: `~/Documents/LSC-Service/YYYY/MM-DD/recording/`
- Cloud backup: <!-- TBD: Google Drive folder? -->
- Long-term: <!-- TBD: keep all forever? Rolling 1-year? Decide with Shine -->
- **Do NOT commit recording files to GitHub** — they're large binary, inappropriate for git. Use `.gitignore`.

---

## What's in the file

Each Sunday's recording typically:

- 1 video file (whole service)
- 0 separate audio files (DJI captures embedded audio only)
- Resolution: <!-- TBD: confirm DJI default — probably 4K @ 30 or 60 fps -->
- File size: <!-- TBD: rough size for typical service -->

---

## Future improvement (v2)

The DJI's onboard mic captures room sound — this includes congregation noise, room reverb, and is generally muddy compared to a direct feed. Two paths to better audio capture:

1. **MG16XU USB-out → laptop direct recording** (e.g., Logic Pro, GarageBand, OBS, or simple ffmpeg). Audio is line-level, post-mix. Sync with DJI video in post-production if needed.
2. **MG16XU USB-out → DJI mic-input** (if the DJI accepts external audio via 3.5mm or USB-C). Single file, mixed audio, no sync needed.

Option 2 is simpler if the DJI supports it. Option 1 is more flexible.

Either way, this involves:
- Configuring the MG16XU's USB output (check manual for which channels are sent)
- Adding a recording app to the laptop's software baseline
- Updating this SOP

Defer until: (a) we want better recordings for archive / livestream, or (b) we have time outside Sunday-morning crunch.

---

## Open items

- [ ] **`@followup-shine`** — verify DJI model code on the device label (currently noted as "ASB01 or similar")
- [ ] **`@followup-shine`** — confirm DJI position (tripod / shelf / wall mount)
- [ ] **`@followup-shine`** — decide retention policy for old recordings
- [ ] **`@followup-shine`** — fill in resolution + per-service file size after the next recording
