# Worship Leader — Music Licensing Quick Guide

**Purpose**: A 5-minute read so the worship leader knows which songs are legal to use, where, and what to put on the slide. Full policy details: `data/copyright/README.md`.
**Audience**: LSC worship leader, song-selection volunteers.
**Owner**: Shine Zhang
**Last reviewed**: 2026-05-12

---

## TL;DR

- **Live band performing** in service: ✅ All sources OK (CCLI / SOP / Joshua / ROLCC / public domain).
- **Playing official YouTube video** during service (no live band): ✅ Joshua / ROLCC / SOP from their official channels; ⚠️ CCLI-catalog Western songs are gray.
- **Recording / uploading our service to YouTube** (today): Only **SOP** + public domain. Nothing else, until we get more licenses.
- **When in doubt**: ask Shine before adding a new song to the set list.

---

## In-person worship — the two ways we present a song

The same song can be presented two ways during service: (1) our worship team plays it live, or (2) we project the publisher's official YouTube video and the congregation sings along. **These are different rights**, so we check each separately.

### Reference table

| Source | Live band performs it | Play official YouTube video |
| --- | --- | --- |
| CCLI catalog (Hillsong, Bethel, etc.) | ✅ Covered by our **CCLI Copyright License #<!-- TBD -->**. Add CCLI Song # to song JSON. | ⚠️ Gray. CCLI Copyright License covers projecting lyrics, **not** publicly playing a recording. Check the publisher's church-use policy individually. |
| SOP (讚美之泉) | ✅ Free for service, fellowship, small group, weddings, retreats | ✅ Presumed OK (their policy is broad and explicitly mentions ProPresenter / projection use). **Use only SOP's official YouTube channel.** |
| Joshua Band (約書亞樂團) | ✅ Need **legitimately-obtained sheet music**. If song is in CCLI, report via CCLI. | ✅ Per Ada Wang's email 2026-05: official Joshua Band YouTube channel only, **no download / edit / re-upload / livestream / saved recording**. Keep original source attribution on screen. |
| ROLCC (矽谷生命河靈糧堂) | ✅ Slide must credit composer + "Copyright: 矽谷生命河靈糧堂" | ✅ Per their policy: <https://www.youtube.com/user/ROLCCmedia> **only** — unauthorized re-uploads on other channels are not safe. |
| Public domain (pre-1925 original) | ✅ Verify translation/arrangement isn't separately copyrighted | ⚠️ The composition is PD, but the **specific recording** (the YouTube video itself) may still be under a sound-recording copyright. Default to the official publisher / artist's channel if available. |
| Anything else | ❌ → ask Shine | ❌ → ask Shine |

### Hard rules when playing YouTube during service (any source)

- ▸ **Official channel only.** Random fan uploads are not safe even if the publisher's policy allows their content.
- ▸ **No downloading** to local file for offline playback (even if you'd be playing offline during service).
- ▸ **No editing, trimming, or re-uploading.**
- ▸ **No livestreaming or DJI recording** while the YouTube video is playing (it goes into the recording's audio track).
- ▸ **Don't save it** to share with members who missed service.
- ▸ Keep the original source / attribution visible on screen (don't crop out the publisher's watermark).
- ▸ **Pre-check on Saturday** that the YouTube link still works — videos sometimes get taken down by their authors.

### YouTube / livestream / upload (today's posture)

| Source | Use? | Why |
| --- | --- | --- |
| CCLI catalog song | ❌ | We have Copyright License, **not** Streaming License |
| SOP (讚美之泉) | ✅ | SOP explicitly allows non-commercial YouTube. **Video description must include SOP copyright case #** |
| Joshua Band | ❌ | Email reply 2026-05 from Ada Wang: any livestream/upload needs separate written permission |
| ROLCC | ⚠️ Gray — ask first | Policy bans editing/re-upload of their content; silent on our own performance recording. Email ROLCC before using |
| Public domain | ✅ | Original work only; modern arrangement/translation may not be |

> If the service set list includes a single song we can't stream, the **whole** recording can't go up. Either don't stream that week, or pick streamable songs for that service.

---

## Adding a new song — decision flow

```
                       ┌─────────────────────────┐
                       │   New song requested    │
                       └────────────┬────────────┘
                                    ↓
                ┌───────────────────────────────────────┐
                │  Is it in CCLI SongSelect?            │
                │  → search by title at songselect.com  │
                └───────────────┬───────────────────────┘
                                │
                  ┌─────────────┴─────────────┐
                 YES                          NO
                  ↓                            ↓
       ┌─────────────────┐         ┌───────────────────────┐
       │ ✅ Live use OK   │         │ Is it from SOP /      │
       │ ❌ Stream:       │         │ Joshua / ROLCC?       │
       │   needs CCLI     │         └────────┬──────────────┘
       │   Streaming Lic  │                  │
       └─────────────────┘            ┌──────┴──────┐
                                     YES            NO
                                      ↓              ↓
                            ┌──────────────┐  ┌──────────────────┐
                            │ ✅ Live OK   │  │ Is it pre-1925   │
                            │ See stream   │  │ public domain?   │
                            │ table above  │  └──────┬───────────┘
                            └──────────────┘         │
                                              ┌──────┴──────┐
                                             YES            NO
                                              ↓              ↓
                                       ┌──────────┐   ┌────────────┐
                                       │ ✅ Both  │   │ ❌ Ask     │
                                       │ live and │   │   Shine    │
                                       │ stream   │   │   first    │
                                       └──────────┘   └────────────┘
```

After the song is approved, fill in its `songs/song-XXXX.json` `copyright` block:

```json
"copyright": {
  "author": "<original author(s)>",
  "publisher": "<publisher | 'Public Domain'>",
  "year": <original publication year>,
  "ccli": "<CCLI Song # | empty string>"
}
```

If the publisher isn't CCLI, add a `notes` field (e.g., `"covered under SOP church-use policy"`).

---

## Slide attribution — what to put on every worship slide

Pick the template that matches the song's source. Use small text at the bottom of every lyric slide.

| Source | Attribution text |
| --- | --- |
| CCLI catalog | `© <year> <author/publisher>. Used by permission. CCLI License #<our number>.` |
| SOP | `© <year> Stream of Praise. Used by permission per SOP church-use policy.` |
| Joshua Band | `© <year> Asia for Jesus / Joshua Band. Used by permission.` |
| ROLCC | `<composer>. Copyright: 矽谷生命河靈糧堂. Used by permission.` |
| Public domain | `Words: <author> (<year>). Music: <author> (<year>). Public Domain.` |

The slide-generation pipeline reads these from each song's JSON `copyright` block — accurate JSON means accurate slides.

---

## CCLI reporting — semi-annual

CCLI requires us to report which songs we used so publishers get paid.

**Cadence**: every 6 months (or as required by our license tier — `<!-- TBD: confirm tier -->`)

**How**:
1. Pull the past 6 months from `data/worship-history.json` (or wherever sets are tracked)
2. Log into CCLI SongSelect → Reporting
3. Submit the list of songs used (CCLI catalog songs only; SOP / Joshua / ROLCC do **not** report through CCLI)

**Who**: the worship leader is the natural reporter. Add a calendar reminder for Jan 1 + Jul 1 (or align with CCLI's window).

---

## "Can I upload this clip to LINE / WeChat / Instagram?"

Same rules as YouTube — these are public uploads. Today's safe list: **SOP + public domain + sermon-only (with music stripped)**.

Private 1:1 forwarding of a recording to a member who missed service is a different gray area — small-scale, generally tolerated. Don't make it routine.

---

## "We want to start streaming Sunday services"

That's a real cost + onboarding project. The work to unlock it is in `data/copyright/README.md` § "What to do when recording or considering streaming". Short version:

1. Buy **CCLI Streaming License** (~ USD 100–200/year for our size)
2. Email Joshua Band at `licensing@asiaforjesus.net` with our intended use + song list
3. Email ROLCC with the same
4. Build a list of SOP copyright case numbers for each SOP song in rotation
5. Update slide attribution + YouTube description templates

Don't start streaming before all four are done. Surface this to Shine when the team is ready to go.

---

## Where to ask for help

- **"Can we use this song?"** — Shine, before adding to the set list
- **"How do I fill in the JSON?"** — `dev/task_001_song_schema.md` has the schema; copy from an existing well-filled song
- **CCLI account access** — Shine
- **Slide template / attribution wording** — check an existing well-attributed song's slide, or `data/copyright/README.md`

---

## Open items for the worship leader

- [ ] Audit current rotation: list every song, match to CCLI / SOP / Joshua / ROLCC / PD
- [ ] For songs missing a CCLI Song # in their JSON, look them up on SongSelect and fill in
- [ ] Set Jan 1 + Jul 1 calendar reminders for CCLI reporting
- [ ] Once Shine confirms the CCLI license #, update `<!-- TBD -->` placeholders in this doc and in slide templates
