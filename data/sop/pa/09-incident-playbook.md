# 09 · Incident Playbook

**Purpose**: Plan B for the things that go wrong on Sunday morning. Each incident has a 60-second fix; if you can't fix in 60s, follow the **escalation** line and keep the service moving.
**Audience**: PA volunteer on duty.
**Last reviewed**: 2026-05-08 — Shine Zhang

> **Print this. It's the doc you grab when your hands are shaking.**

---

## Mindset

Two principles:

1. **The service is more important than the gear.** A perfect mix nobody hears is worse than an imperfect mix everyone hears.
2. **Calm fixes faster than panic.** Take a breath. Look at the LED that should be on. 90% of incidents are a single thing.

---

## Top 10 incidents

### 1. Pastor mic suddenly silent

**Symptoms**: Pastor speaks, nothing comes through. Channel meter shows no signal.

**60-sec fix**:
- Look at wireless **receiver LED** on the rack — battery indicator there
- If battery dying: hand a backup mic to the pastor at next pause (have a wired backup ready in booth kit)
- If receiver shows signal but channel is silent: PFL Ch 11/12 — check fader, check mute (no mute button on this mixer, but check master fader)

**Escalation**: Hand the pastor your spare wired SM58 plugged into Ch 5 or 6. Ride that fader. Sort the wireless system after service.

---

### 2. Slide didn't advance with clicker

**Symptoms**: Click button, nothing on screen.

**60-sec fix**:
- Walk to laptop, advance via **arrow keys**
- Replace clicker AAA battery at next natural break

**Escalation**: Run the rest of the service from the laptop keyboard. Replace clicker entirely after service.

---

### 3. Preacher emails / hands you a NEW deck at T-5

**Symptoms**: USB stick or "actually I changed slide 12" at the worst possible moment.

**60-sec fix**:
- Don't panic. The T-15 freeze rule exists for this reason — politely defer if possible: "I'll see what I can do."
- If only one slide changed: edit in PowerPoint directly, save, reload presenter view
- If full deck swap: load on the laptop, save as `service.pptx` (overwrite), launch presenter view, **do not delete the old version** (might need to revert)

**Escalation**: Run the deck you have. The world won't end if slide 12 says last week's date.

---

### 4. WiFi drops

**Symptoms**: Google Drive sync icon shows offline. Browser-loaded Google Slides freezes.

**60-sec fix**:
- Local `service.pptx` on the laptop continues running fine — PowerPoint doesn't need internet
- If you were running slides directly from Google Slides web (don't do this): close browser, open the local `service.pptx`

**Escalation**: Service runs fine without WiFi. Reconcile any pending Google Drive edits after service.

---

### 5. Speaker pop on power-up (or worse, mid-service)

**Symptoms**: Loud "thump" through the speakers when something gets powered on or unplugged.

**60-sec fix**:
- During power-on: you violated the source-first-amp-last sequence. Power down everything; restart in order. (See `02-pre-service.md`.)
- Mid-service: usually a phantom-power button bumped, or a cable yanked. PFL each channel to find which.

**Escalation**: Pull the master fader if a sustained pop is happening. Stop, restart sequence cleanly.

---

### 6. Feedback (squealing)

**Symptoms**: Loud high-pitched whine.

**60-sec fix**:
- **Pull AUX 1 send** on the offending channel down. The cause is monitor → mic feedback loop, not FOH.
- If unsure which channel: pull the master AUX 1 fader down briefly (whole monitor mix); identify the channel by elimination, then bring AUX 1 back up
- Mic too close to monitor → ask the singer to step back

**Escalation**: If feedback persists with all monitor sends down, problem is FOH-side: pull the FOH fader of that channel.

---

### 7. DJI storage full / battery died

**Symptoms**: Recording stops mid-service.

**60-sec fix**:
- Note the time. Don't disrupt service.
- At next break: swap battery or storage card if you have spares; restart recording
- If no spares: leave it. Single-piece recording with a gap is fine; we're a small church, not Netflix.

**Escalation**: After service, copy what you have. Note the gap in the archive folder's `notes.txt`.

---

### 8. PowerPoint freezes

**Symptoms**: Click, nothing. Spinning beach ball. Slides stuck.

**60-sec fix**:
- ⌘+Q PowerPoint → relaunch → reopen `service.pptx` → resume from current slide via "Custom Show" or by dragging in presenter view to the right slide
- Use **Keynote** as backup — open the same .pptx in Keynote (Keynote opens PowerPoint files natively)

**Escalation**: Run from Keynote for the remainder. Diagnose PowerPoint after service.

---

### 9. Equipment missing from office (Sunday morning)

**Symptoms**: You arrive, something's not where it should be.

**60-sec fix**:
- Check obvious alternative spots (someone moved it for cleaning, a Saturday event, etc.)
- Tag Shine in the team chat **immediately** — don't wait until you're set up
- If it's the mixer or laptop and there's no quick alternative: this is a major problem, not a minor one — the senior pastor should know

**Escalation**: Improvise — wired backup mic into a borrowed laptop with PowerPoint, run reduced. Better than no service. Worship leader can lead acapella for one Sunday.

---

### 10. You don't know what's wrong

**Symptoms**: Something's off, you can't tell what.

**60-sec fix**:
- **Ask the rotation buddy** if there's another PA volunteer in the room. Two pairs of ears beat one.
- **Check the master meter** — if it's silent, the issue is upstream of the master.
- **PFL each channel in turn** — find the silent or distorted one.
- **Sniff test**: any burning smell? Smoke? Power off immediately, escalate.

**Escalation**: If something seems unsafe (smoke, burning smell, hot transformer): power everything off, evacuate the booth, get a deacon. Service can pause. Safety first.

---

## After any incident

- Note what happened, when, and what you did, in the team chat or volunteer log
- Bigger incidents: tag Shine. We learn from each one and add to this playbook.

---

## Open items

- [ ] **`@followup-shine`** — confirm wired backup mic location (in booth kit? in office?)
- [ ] **`@followup-shine`** — confirm spare DJI battery and storage card availability
- [ ] After 6 months of service: review this playbook, add new incidents, retire ones that never happened
