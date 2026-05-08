# Sean's Mixer Setup Walkthrough — Training Notes

**Source**: 100s vertical video by Sean (youth volunteer) explaining MG16XU operating principles — `input/2026-05-08-sean-mixer-setup/sean-mixer-setup.mp4` (gitignored).
**Recorded**: 2026-05-08
**Status**: Draft — needs Shine review (and Sean verification of EQ phrasing) before going into Class 3 deck.

A youth volunteer walks through the channel-strip controls of the Yamaha MG16XU, explaining the "what to press / what not to press" philosophy on each. The video is informal and bilingual (English with some Mandarin); this document distills the technical content into topic-organized notes for the **Class 3 — MG16XU hands-on** training deck.

> **Important context**: We did not yet have the physical mixer when this was recorded. Sean is teaching from the **printed product photo on the cardboard box** — pointing at the picture, not at real knobs. The technical content is still valid; the screenshots from this video are box-photo references and will be **replaced with photos of the real mixer** once it's in service.
>
> Implication: Class 3 will use this video as **theory prep material** (watch before the hands-on session), not as a live demo. Hands-on practice requires the actual MG16XU.

---

## 1. HPF — High Pass Filter

> **Sean**: "Don't press the HPF on drums and bass.
> Press the HPF on microphones, guitar, and keyboard.
> It filters 80 Hz down to the subwoofer."
>
> **(zh-TW)**: 鼓和貝斯不要按 HPF。麥克風、吉他、鍵盤要按 HPF — 它會把 80 Hz 以下的低頻濾掉送到超低音喇叭。

**Why this matters**: HPF removes low-frequency rumble (handling noise, stage vibration, room boom) from sources that don't have meaningful content below 80 Hz. Drums and bass *live* in the low end — high-passing them cuts their fundamental tone.

**Default state on our setup**:
- Ch 1–4 (instruments): **OFF for bass channel, ON for guitar/keys**
- Ch 5–8 (vocals): **ON**
- Ch 11/12 (pastor mic): **ON**

---

## 2. PAD switch

> **Sean**: "Don't press the PAD unless there is a really loud sound."
>
> **(zh-TW)**: 沒有特別大聲的訊號就不要按 PAD。

**Why**: PAD attenuates the input by ~26 dB. It's for hot signals (close-miked drums, line outputs that overload the preamp). Pressing it when not needed forces you to raise gain to compensate, adding noise.

**Default**: PAD stays **OFF**. Only engage if the channel clips even with TRIM at minimum.

---

## 3. PRE switches + AUX 1 (the monitor send)

> **Sean**: "PRE is all pressed, so the fader will not interfere with the sound of the monitor.
> The monitor volume uses AUX1 to adjust."
>
> **(zh-TW)**: PRE 全部按下，這樣推桿不會影響監聽喇叭的音量。監聽喇叭的音量用 AUX1 控制。

**Why this matters — this is *the* monitor mix concept**: When PRE is engaged on AUX1, the monitor send is **independent of the main FOH (front-of-house) fader**. The worship team hears a stable monitor mix even when the FOH operator pulls the channel fader down for the congregation. That's the entire point of monitor sends.

**Rule for our setup**: Every channel feeding worship monitors must have AUX1 PRE **pressed**. If a worship-team member can't hear themselves on stage:

✅ Turn up the AUX1 knob on their channel
❌ Don't touch the channel fader (that's the congregation's mix)

---

## 4. PFL — Pre-Fader Listen

> **Sean**: "PFL is Pre-Fader Listen.
> If you want to see the balance of a signal, you can look here, or listen with headphones."
>
> **(zh-TW)**: PFL = Pre-Fader Listen（推桿前監聽）。要看訊號的電平，可以從這裡看，也可以接耳機聽。

**What it does**: PFL solos a single channel into the headphone output and the meter, regardless of where the channel fader sits. Used for:
- Setting gain on a new mic / instrument
- Checking what a single source actually sounds like (mic problem? buzz?)
- Verifying signal is arriving at all

**Workflow**: Press PFL → meter shows *that channel's* level → adjust TRIM (gain) until peaks hit the yellow zone, **never red** → un-press PFL when done so the headphones return to the master mix.

---

## 5. PAN / Balance

> **Sean**: "PAN or balance is to adjust the balance — you want one sound here, one sound there."
>
> **(zh-TW)**: PAN 或 Balance 是調左右平衡 — 一邊放一個聲音，另一邊放另一個。

**Mono vs. stereo channels**:
- **Mono channels (Ch 1–8)** use **PAN** — places the channel in the L/R image of the master.
- **Stereo channels (Ch 9/10, 11/12, 13/14, 15/16)** use **BAL** — adjusts the L vs. R balance of the already-stereo source.

**Defaults for our setup**:
- Pastor mic (Ch 11/12) → **center**
- Worship vocals (Ch 5–8) → **center** (slight spread for harmony parts is okay)
- Instruments → light spread; never extreme L or R for live church

---

## 6. EQ — HIGH and LOW only, leave MID alone

> **Sean**: "High frequency: if there is a lower sound and you want to make it better, adjust it higher.
> Low frequency: like bass — to make it brighter, adjust it a little bigger.
> Try not to move the MID."
>
> **(zh-TW)**: 高頻 (HIGH)：訊號聽起來偏暗就把 HIGH 轉高一點，聲音會更亮。低頻 (LOW)：像貝斯這種，想讓它更紮實就把 LOW 轉大一點。中頻 (MID) 盡量不要動。

**Why MID is dangerous**: The MG16XU's MID is a **swept (parametric) mid** — you set both the frequency and the boost/cut. Get either wrong and the sound becomes harsh, hollow, or muddy. HIGH and LOW are simpler **shelving** EQs that are much harder to mess up.

**Rule of thumb**:
- Vocals sound dull → boost HIGH a touch
- Bass sounds thin → boost LOW a touch
- **Don't touch MID** unless you're hunting a specific problem (feedback frequency, vocal clarity gap) and you know what you're listening for.

> **`@followup-sean`**: His phrasing "lower sound, adjust higher" is ambiguous. Best interpretation: "if the signal sounds *dark*, boost HIGH." Run this with Sean and update the note when confirmed.

---

## 7. Compressor

> **Sean**: "Compressor should not be needed unless the sound is very shaky."
>
> **(zh-TW)**: 壓縮器一般不用，除非聲音很不穩定。

**What a compressor does**: Evens out dynamic range — makes loud parts quieter and quiet parts (relatively) louder. Useful when a vocalist's level swings widely.

**Why we default OFF**:
- Misused compression makes vocals lifeless and over-processed.
- Small-church live mixing with steady vocalists rarely needs it.
- More controls to manage = more things that can go wrong on a Sunday morning.

**Default**: Comp OFF. Engage only on a vocalist whose level swings wildly. Start mild (ratio 2:1, slow attack) and ease into it.

---

## Summary — Sean's "Default state of every channel" cheat sheet

| Control | Default state | When to change |
| --- | --- | --- |
| HPF | ON for mics/guitar/keys; OFF for drums/bass | Almost never change |
| PAD | OFF | Only if channel clips at min TRIM |
| PRE (AUX1) | ON | Always — the rule, not the exception |
| PFL | OFF | Only when checking gain or troubleshooting |
| PAN / BAL | Center for vocals & pastor mic | Light spread for instruments |
| HIGH EQ | 12 o'clock | Boost slightly for dull vocals |
| MID EQ | 12 o'clock | **Don't touch** unless hunting a problem |
| LOW EQ | 12 o'clock | Boost slightly for thin bass |
| Compressor | OFF | Only for unstable vocalists |

This is the **"Sunday baseline"** — the configuration the booth photo should show. Volunteers compare to this on setup day.

---

## Items needing follow-up

- [ ] **`@followup-sean`** — Verify EQ phrasing in Section 6 (the "lower sound → adjust higher" line)
- [ ] Shine to review the bilingual translations — confirm zh-TW phrasing reads naturally
- [ ] **Reshoot screenshots** with the real MG16XU once it's in service (current images would have been box-photo references and have been removed)

## Cross-references

- `dev/task_013_pa_sop.md` — umbrella PA SOP & training task
- `data/sop/pa/01-equipment-inventory.md` (TBD) — full MG16XU channel map lives here
- `data/sop/pa/03-rehearsal.md` (TBD) — sound-check sequence builds on these channel-strip defaults
- Class 3 deck (TBD) — this notes file is the seed content
