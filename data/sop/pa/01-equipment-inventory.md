# 01 · Equipment Inventory

**Purpose**: Authoritative list of every piece of A/V gear we own, where it's stored between Sundays, and how the mixer's channels are mapped.
**Audience**: All PA volunteers — read once on onboarding, reference when a piece is missing.
**Last reviewed**: 2026-05-08 — Shine Zhang

---

## Storage map

Three categories — **where the gear lives between Sundays**:

- **Office (locked)** — anything portable and theftable. Retrieved each Sunday morning, returned after service.
- **Booth / stage** — set up at its operating position, but not bolted down. Stays setup between weeks.
- **Permanent install** — physically mounted (ceiling speakers, projector, in-wall cabling). Not moved.

When in doubt: put it in the office.

---

## Mixer

### Yamaha MG16XU

- **Storage**: Office (locked)
- **Type**: 16-channel analog mixer with USB I/O and onboard SPX effects
- **Note**: Analog — **no scene/preset recall**. Every Sunday starts from physical knob positions. The "Sunday baseline" is captured in a printed photo posted in the booth — volunteers compare on setup day.
- **Power**: Built-in IEC, 100–240V. Uses a standard kettle cable.
- **USB-out**: capable of feeding the laptop direct for line-level recording. **Not used yet** (we currently rely on DJI camera for recording — see `07-recording.md`).
- **Serial / asset tag**: <!-- TBD: serial number from rear label -->

### Channel map (locked)

MG16XU has **8 mono channels (1–8)** and **4 stereo pairs (9/10, 11/12, 13/14, 15/16)** — each stereo pair has a single linked fader.

| Fader | Source | Wiring | Notes |
| --- | --- | --- | --- |
| 1–4 (mono) | Instruments | DI / line | Independent fader each. Bass on one of these — HPF stays OFF on the bass channel. |
| 5–8 (mono) | Microphones (worship vocals) | XLR | Wireless handhelds / wired vocal mics. HPF ON. |
| 9/10 (stereo) | Extra instruments | **XLR only** (TRS not used) | One linked fader. |
| 11/12 (stereo) | Pastor wireless mic | **Single balanced XLR** into one input | Auto-mono-summed by the mixer to L+R internally. No Y-cable, full level. |
| 13/14 (stereo) | **Open / spare** (intentional) | — | Reserved for guest speakers, second laptop, ad-hoc. Fader stays down. Label "OPEN" on the console. |
| 15/16 (stereo) | Computer (laptop audio) | — | One linked fader — slides music, pads, pre-service music. |
| Aux 1 | Monitor speaker send | Stage monitor cable | **All channels feeding the monitor must have AUX 1 PRE pressed** — see `03-rehearsal.md`. |

### Sunday baseline (channel defaults — Sean's cheat sheet)

| Control | Default | When to change |
| --- | --- | --- |
| HPF | ON for mics/guitar/keys; OFF for drums/bass | Almost never |
| PAD | OFF | Only if channel clips at min TRIM |
| PRE (AUX 1) | ON | Always — the rule, not the exception |
| PFL | OFF | Only when checking gain or troubleshooting |
| PAN / BAL | Center for vocals & pastor mic | Light spread for instruments |
| HIGH EQ | 12 o'clock | Boost slightly for dull vocals |
| MID EQ | 12 o'clock | **Don't touch** unless hunting a specific problem |
| LOW EQ | 12 o'clock | Boost slightly for thin bass |
| Compressor | OFF | Only for unstable vocalists |

Source: `training/sean-mixer-setup/notes.md` (full explanation per control).

---

## Microphones

| Type | Qty | Storage | Notes |
| --- | --- | --- | --- |
| Pastor wireless (handheld / lav / headset) | <!-- TBD --> | Office | Receiver outputs single balanced XLR → Ch 11/12 |
| Wireless handheld (worship vocals) | <!-- TBD --> | Office | XLR receivers → Ch 5–8 |
| Wired vocal mics (SM58 / similar) | <!-- TBD --> | Office | Backup for wireless |
| Instrument mics (drums, etc.) | <!-- TBD --> | Office | Used on Ch 1–4 if applicable |

**Battery policy**: Always check wireless mic batteries during setup (`02-pre-service.md`). Spare AAs/AAAs in the booth kit. Replace, don't just check level.

---

## Speakers & monitors

| Item | Storage | Notes |
| --- | --- | --- |
| FOH (main) speakers | <!-- TBD: permanent install or booth? --> | <!-- TBD: model, qty --> |
| Subwoofer | <!-- TBD --> | Receives 80 Hz and below from HPF |
| Stage monitor | <!-- TBD --> | Fed by AUX 1 |

---

## Cables

| Type | Qty | Storage | Notes |
| --- | --- | --- | --- |
| XLR (3-pin) — mic and line | <!-- TBD --> | Office (in cable bag) | Coil **over-under** every time. Never wrap around the elbow. |
| 1/4" TRS | <!-- TBD --> | Office | Less used since Ch 9–12 are XLR-only |
| Speaker cable (Speakon / 1/4") | <!-- TBD --> | <!-- TBD: stay on stage or in office? --> | Don't substitute with instrument cable |
| Power / IEC | <!-- TBD --> | Office | |
| HDMI / display | <!-- TBD --> | Office | Laptop → projector |
| USB extension | <!-- TBD --> | Office | For Norwii N29 dongle if MacBook ports are far |

**Cable care rules** — see `02-pre-service.md` and `08-teardown.md`. The shortest summary:

1. Pull the **plug**, not the cable
2. Coil **over-under** (alternating loops); never wrap around the elbow
3. No stepping, no chairs on, no foot traffic across cables
4. Strain relief at every connector (no 90° kinks)

---

## Laptop & slide peripherals

### Booth MacBook

- **Storage**: <!-- TBD: office, or booth-locked? -->
- **Owner**: <!-- TBD: church-owned or designated personal device -->
- **Account**: shared `PA` user (password known to all 5 volunteers)
- **Software baseline**: PowerPoint, Keynote, Google Drive desktop, Chrome, VLC. macOS auto-update **off**.
- **Files**: canonical service folder `~/Documents/LSC-Service/YYYY/MM-DD/`, mirrored to Google Drive.
- Full policy: see `dev/task_013_pa_sop.md` § "Laptop policy".

### Norwii N29 presentation clicker

- **Storage**: Office (in booth kit)
- **Connection**: USB-A 2.4 GHz dongle (no driver needed on macOS)
- **Battery**: 1× AAA — keep 4 spares in the booth kit
- **Range**: ~100 ft line-of-sight; tested at every setup (back-of-room check is in `02-pre-service.md`)

### USB sticks

- **Storage**: Office (in booth kit)
- **Use**: receive sermon decks from the preacher Sunday morning. Always **scan + copy to laptop** — never run slides from a USB. See `05-slides-and-laptop.md`.

---

## Recording

### DJI camera (model: ASB01 — verify on label)

- **Storage**: Office
- **Battery / charging**: <!-- TBD: charging cradle in office? -->
- **Storage card**: <!-- TBD: SD card class & capacity, hours per service -->
- **Workflow**: see `07-recording.md`

---

## Booth kit (the "go bag")

A single bag/box that travels with the mixer between office and booth each Sunday. Contents:

- [ ] Norwii N29 clicker + USB dongle
- [ ] 4× spare AAA batteries (clicker)
- [ ] 4× spare AA batteries (wireless mics, if applicable)
- [ ] 2× USB sticks (1 for sermon receive, 1 spare)
- [ ] Gaffer tape (or sturdy electrical tape) — for cable runs across walkways
- [ ] Sharpie + masking tape — for ad-hoc labeling
- [ ] Small flashlight or headlamp (booth lighting often dim)
- [ ] Printed Sunday baseline photo (channel reference)
- [ ] Printed `02-pre-service.md`, `04-service-runsheet.md`, `09-incident-playbook.md` (laminated)

Inventory the booth kit during teardown (`08-teardown.md`).

---

## Open items

- [ ] Fill in all `<!-- TBD: -->` placeholders above (mics, cables, speakers, DJI specifics)
- [ ] **`@followup-shine`** — confirm whether the booth MacBook is church-owned or Shine's personal device
- [ ] Take and post the **Sunday baseline photo** of the MG16XU after a confirmed-good Sunday
