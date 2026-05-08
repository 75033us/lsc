# 03 · Rehearsal & Sound Check

**Purpose**: How to do a proper sound check — gain staging, monitor mix, EQ defaults — so the worship team and the pastor sound great with minimum mid-service intervention.
**Audience**: PA volunteer on duty + worship leader.
**Last reviewed**: 2026-05-08 — Shine Zhang

---

## When does sound check happen?

- **Saturday rehearsal** if scheduled — full check, dial in the monitor mix, save reference photo of the console.
- **Sunday morning T-30** — quick verification + adjustments. If Saturday was missed, this becomes the full check (and pre-service starts earlier).

---

## Channel-strip starting point

Start every channel from the **Sunday baseline** (see `01-equipment-inventory.md`). The booth photo posted on the wall is the visual reference. If a knob is in a wildly different position from the photo, return it before adjusting.

Quick recap:

| Control | Default | Why |
| --- | --- | --- |
| HPF | ON (mics/guitar/keys) / OFF (drums/bass) | Cuts handling rumble; preserves bass fundamentals |
| PAD | OFF | Only for hot signals that clip at min TRIM |
| PRE (AUX 1) | ON | Monitor mix independent of FOH fader |
| PFL | OFF | Only when checking |
| PAN / BAL | Center | Spread instruments lightly |
| HIGH | 12 | Boost a touch for dull vocals |
| MID | 12 | **Don't touch** |
| LOW | 12 | Boost a touch for thin bass |
| Comp | OFF | Only for unstable vocalists |

---

## Sound-check sequence (one channel at a time)

For each channel that has a source, in this order:

1. **PFL on** that channel
2. Source plays / speaks at **performance volume** (not soundcheck volume — actual performance level)
3. **Set TRIM (gain)** so peaks land in the yellow zone, never red. The PFL meter shows you that channel's level regardless of fader.
4. **EQ check**:
   - Vocals dull? Boost HIGH a touch.
   - Bass thin? Boost LOW a touch.
   - **Don't touch MID** unless you have a specific reason and you know what you're hunting for.
5. **PFL off**
6. Bring the channel fader up to ~unity (the line marked "0" or "U")
7. Adjust **AUX 1 send** for monitor — ask the musician what they need
8. Adjust PAN / BAL — center for vocals/pastor, light spread for instruments
9. Move to the next channel

Repeat for all live channels. Last channel: laptop on Ch 15/16 (stereo) — pre-service music playing softly to verify routing.

---

## Monitor mix — the AUX 1 way

The single most important rule on this mixer:

> **All channels feeding the monitor have AUX 1 PRE pressed.**

What this gives you:
- Worship team's monitor mix is **independent** of the congregation's FOH mix.
- Pulling down a channel fader for the congregation does NOT silence it from the monitor.
- A musician who can't hear themselves: **turn up that channel's AUX 1 knob, not the fader**.

How to dial in:

1. With the worship team in position, ask each member in turn: "What do you need more of?"
2. Adjust AUX 1 knob for the source they need
3. Watch their face / get verbal confirmation
4. Repeat until everyone gives a thumbs-up

If one musician needs a wildly different mix from the others, the MG16XU's single AUX 1 send can't deliver per-musician monitoring. Workarounds:
- IEMs with personal mixers (out of scope for v1)
- Compromise mix everyone can live with (most common)
- Move that musician closer to a different monitor

---

## Common sound-check problems

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Channel meters but no sound | Channel fader down, or master fader down | Check both. Bring up fader. |
| Sound but distorted | TRIM too high (clipping) | PFL the channel, lower TRIM until peaks are yellow. |
| Sound is faint, hissy | TRIM too low (under-gained) | PFL, raise TRIM. Don't compensate with the fader. |
| Hum on a mic line | Bad cable, ground loop, or phantom power on a mic that doesn't need it | Swap cable first. Then check phantom (48V button). |
| Squealing feedback | Mic too close to monitor, or AUX 1 too hot | Pull AUX 1 down on that channel. Move the mic. |
| One side of stereo channel silent | Mono source plugged into stereo channel as L only — should auto-sum | Re-seat the XLR; verify it's clicked in. MG16XU auto-mono-sums when only L is connected. |
| Pastor mic centered but quiet | TRIM low, or wireless battery dying | PFL Ch 11/12, raise TRIM, check battery LED on receiver |

For more, see `09-incident-playbook.md`.

---

## After sound check

- Take a **fresh photo of the console** if anything material changed from the posted baseline. Print, replace the booth photo.
- Note any quirks in the volunteer log (if we keep one) — e.g., "Ch 7 mic kept feeding back, swapped to wired backup"

---

## Open items

- [ ] **`@followup-shine`** — decide whether to keep a per-Sunday volunteer log and where it lives
- [ ] **`@followup-sean`** — verify EQ phrasing in `training/sean-mixer-setup/notes.md` § 6
