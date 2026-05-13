# Copyright & Music Licensing — LSC

**Purpose**: One place to know what music we are licensed to use, where, and how to credit it. Read this before adding a new song to the rotation, recording a service, or posting anything publicly.
**Audience**: Worship leader, PA volunteer, anyone preparing slides.
**Owner**: Shine Zhang
**Last reviewed**: 2026-05-12

---

## At a glance

| What | Status |
| --- | --- |
| **CCLI Copyright License** (project lyrics on-screen / print bulletins) | ✅ Active — `#<!-- TBD: CCLI number -->` |
| **CCLI Streaming License** (post recordings, live-stream services online) | ❌ **Not held** |
| **Chinese-language publishers** | ✅ SOP, Joshua Band, ROLCC — in-person Sunday use covered (no streaming/upload). See per-publisher section. |
| **Public-domain hymns** | ✅ Always free to use |

> **The single most important rule**: We do **not** have a Streaming License. Service recordings (DJI) are **internal archive only** — do not post them to YouTube / Facebook / WeChat / LINE channels / the church website. See `data/sop/pa/07-recording.md`.

---

## CCLI Copyright License — what it covers

With our active CCLI Copyright License we **may**:

- Project song lyrics on the screen during Sunday service
- Print song lyrics in the Sunday bulletin
- Photocopy lyrics for choir / worship team rehearsal
- Translate lyrics for our own use (e.g., English → Chinese for bilingual congregation), with attribution
- Create custom arrangements for our own use

We **may not** (under Copyright License alone):

- Live-stream the service with copyrighted songs audible (need Streaming License)
- Post service recordings online with copyrighted songs (need Streaming License)
- Photocopy printed sheet music (need a separate license)
- Use a song from a publisher outside CCLI's catalog without that publisher's permission

### CCLI reporting

CCLI requires us to **report songs used** every 6 months (or as required by the license tier) via SongSelect. This tells publishers which songs are being used so they get paid.

- [ ] **`@followup-shine`** — confirm reporting cadence for our license tier and set a calendar reminder
- [ ] **`@followup-shine`** — designate a reporter (worship leader is typical)

Reporting workflow:
1. Pull the past 6 months from `data/worship-history.json` (or wherever we track sets)
2. Log into CCLI SongSelect → Reporting
3. Submit list of songs used

---

## What is NOT covered by our CCLI

CCLI's catalog is **mostly Western publishers**. Most Chinese-language worship publishers are **not** in the CCLI catalog, so a CCLI license does not authorize their use. We track those separately below.

---

## Chinese-language publishers

We use songs from three publishers whose works are **not** in the CCLI catalog. Each has its own church-use policy summarized below. Default posture: **in-person Sunday service singing is broadly permitted; livestream / upload / commercial use is not**.

### Stream of Praise / 讚美之泉 (SOP)

Source: <https://sop.org/en/copyright/>

- ✅ **Free** for: Sunday service, fellowship, small group, weddings, memorial services, church retreats, bulletins, ProPresenter / projection, translation to native language
- ✅ **Free recording**: up to **100 copies** of church-service CD/DVD; live recordings for the **church website**
- ✅ Free YouTube uploads (non-commercial), **but** copyright case number must appear in the video description
- ❌ Requires written permission + fees: choir / instrument scores at **6+ copies** ($1.00–$1.75 per copy), commercial songbooks, monetized YouTube, broadcast, for-profit playback
- **Contact**: <https://sop.org/en/copyright/copyright-application>

### Joshua Band / 約書亞樂團 (Asia for Jesus / Hebron Vision)

Source: Direct email reply 2026-05 from Ada Wang, Licensing & Royalty Dept (`licensing@asiaforjesus.net`).

- ✅ **Free** for in-person worship at church (no livestream / recording / upload / commercial use)
- ✅ Worship-team performance: follow our **CCLI license** rules + report through CCLI, use legitimately-obtained sheet music
- ✅ Playing the official Joshua Band YouTube video during service is OK, **provided** no download, edit, re-upload, livestream, or saved recording — keep original source attribution
- ❌ Anything else (livestream, uploaded recording, ticketed event, publishing, translated lyrics) → contact `licensing@asiaforjesus.net` with intended use and song list
- Email record: see `data/copyright/correspondence/2026-05-asia-for-jesus.md` (TBD — archive the email if we want to keep it)

### ROLCC / 矽谷生命河靈糧堂

Source: <https://rolcc.net/rolcc2/media-copyright/>

- ✅ **Free** to sing ROLCC songs in service or play their officially-produced song videos
- ❌ **Strictly prohibited**: post-production, editing, re-uploading any ROLCC video content (「嚴禁後製、剪輯、重製等行為」)
- ❌ Don't pull from unofficial YouTube copies — use only the official channel: <https://www.youtube.com/user/ROLCCmedia>
- **Slide attribution required**: composer name + "Copyright: 矽谷生命河靈糧堂"
- **Contact**: church office address on their contact page

### Other Chinese hymnals (e.g., 生命聖詩, 教會聖詩)

Many entries are public domain (older hymns and traditional Chinese translations of pre-1925 English originals). Verify per-song before assuming — translations may still be in copyright depending on translator/year.

### Open items

- [ ] **`@followup-worship-leader`** — list every Chinese-language song in current rotation; match each to SOP / Joshua / ROLCC / public domain / other
- [ ] **`@followup-shine`** — archive Ada Wang's email reply under `data/copyright/correspondence/` for future reference
- [ ] **`@followup-shine`** — if we ever start streaming, contact SOP, Joshua Band, and ROLCC separately with our intended use + song list (CCLI Streaming License alone is **not** sufficient for non-CCLI catalogs)

---

## Public domain — always free

Songs whose copyright has expired (US: pre-1929 publication, with caveats) are public domain. Most classic hymns qualify:

- Amazing Grace (text 1772, tune 1779)
- How Great Thou Art — **NOT public domain** (1949, still under copyright via Hope Publishing)
- 奇異恩典 (Chinese translation of Amazing Grace) — translation may be in copyright depending on translator/year; verify
- 古舊十架 / The Old Rugged Cross (1913 — US public domain as of 2009)
- Hymns from the 1800s and earlier — generally safe; verify edition/translation

**Rule of thumb**: if a song was originally written before ~1925, the original work is almost certainly PD in the US. **But translations and modern arrangements may still be in copyright** — credit accordingly.

For each public-domain song we use, mark `copyright.publisher: "Public Domain"` in its `songs/song-XXXX.json` metadata.

---

## On-screen attribution (every worship slide)

Every projected lyric slide for a copyrighted song should display, in small text at the bottom:

```
© <year> <author / publisher>. Used by permission. CCLI License #<our number>.
```

For public-domain songs:

```
Words: <author> (<year>). Music: <author> (<year>). Public Domain.
```

For songs licensed via a Chinese publisher's church-use policy:

```
© <year> <publisher>. Used by permission per <publisher>'s church-use policy.
```

The slide generator (`scripts/`, `src/lib/types.ts:13` `Copyright` interface) reads these fields from each song's JSON. **Keeping the JSON accurate is how the slides stay legally clean.**

---

## What to do when adding a new song

1. Find the song's copyright info (CCLI SongSelect for English catalog, publisher's site for Chinese)
2. Verify it's covered by our CCLI Copyright License **or** by a publisher-specific policy **or** is public domain
3. If none of the above: don't add it to rotation. Ask Shine.
4. Fill in `copyright` block in the song's JSON (`songs/song-XXXX.json`):
   - `author` — original author(s) of words and music
   - `publisher` — publisher name (or `"Public Domain"`)
   - `year` — original publication year
   - `ccli` — CCLI Song # (numeric, from SongSelect) — empty string if not in CCLI catalog
5. If the song is not in CCLI's catalog, note in the JSON which publisher policy covers it (suggest a `notes` field — currently we just leave `ccli: ""`)

---

## What to do when recording or considering streaming

| Activity | Allowed today | What we'd need |
| --- | --- | --- |
| Record service on DJI for internal archive | ✅ Yes | Already covered — internal use only |
| Share recording privately with a member who missed service | ⚠️ Gray — small-scale sharing is generally tolerated, but technically requires Streaming License | Streaming License if we make it routine |
| Post recording to YouTube / Facebook / WeChat | ❌ No | CCLI Streaming License + verify each song is in the streaming-eligible list |
| Live-stream the service in real time | ❌ No | CCLI Streaming License + tech setup |
| Post a clip of only the sermon (no music) | ✅ Yes | Sermon is original content. Strip any music-bed underneath. |
| Post a clip with only public-domain hymn music | ✅ Yes | Public domain, free to share |

> **Publisher exceptions**: SOP explicitly permits live recordings for the church website. Joshua Band explicitly does not allow recording/upload without contact. ROLCC strictly prohibits any editing/re-upload. A CCLI Streaming License alone is **not** sufficient to stream a service containing Chinese-publisher songs — see the publisher section above.

If we decide to start streaming, the cost is roughly:

- **CCLI Streaming License**: ~$<!-- TBD: confirm current pricing tier for our size --> /year (tier based on average attendance — we're well under 200)
- See <https://us.ccli.com/streaming/> for current pricing

---

## Renewal calendar

- [ ] **`@followup-shine`** — record CCLI Copyright License renewal date in the church calendar
- [ ] **`@followup-shine`** — set 30-day-before reminder for renewal
- [ ] Update the **CCLI #** in this doc and in slide attribution if the number changes on renewal

---

## Related

- **Worship-leader quick guide** — `data/copyright/worship-leader-guide.md` (decision flow for adding songs, slide-attribution templates, CCLI reporting workflow)
- **Per-song copyright fields** — `src/lib/types.ts:13` (`Copyright` interface), populated in each `songs/song-XXXX.json`
- **Accounting line** — CCLI dues are tracked under account **5200 Worship & Music** (see `dev/task_009_church_accounting.md`)
- **PA SOP** — recording rules in `data/sop/pa/07-recording.md`
- **Slide generator** — `src/commands/import.ts` initializes empty copyright fields on import; volunteer must fill in before song goes into rotation

---

## Open items (consolidated)

- [ ] Fill in our CCLI Copyright License number (replace `<!-- TBD: CCLI number -->`)
- [ ] Confirm CCLI reporting cadence and designate reporter
- [ ] Worship-leader audit: list every song in rotation, match to CCLI / SOP / Joshua / ROLCC / public domain
- [ ] Per song in rotation: confirm `copyright` block in `songs/song-XXXX.json` is accurate
- [ ] Archive Ada Wang's email under `data/copyright/correspondence/` (or decide not to)
- [ ] If we ever want to stream: budget for CCLI Streaming License **and** contact each Chinese publisher with our song list
