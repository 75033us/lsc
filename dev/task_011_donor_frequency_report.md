# Task 011: Donor Frequency Report

## Status: Draft

## Description
Generate a monthly donor **frequency** report from Pushpay export data — explicitly **without** dollar amounts. The goal is to surface engagement and pastoral-care signals (who's giving regularly, who's lapsed, who's new) while keeping individual giving amounts out of the analytical pipeline entirely.

Amounts stay in the books of record (Pushpay + accounting system per `task_009`). This task is a separate, narrower view designed to be safe to share more broadly within church leadership.

---

## Why frequency-only

- **Privacy first**: who gives how much is sensitive; many churches deliberately wall off amount data from non-finance leaders. Frequency is enough to drive pastoral follow-up without exposing financial detail.
- **Pastoral signal, not a fundraising tool**: a lapsed giver often correlates with disengagement, life crisis, or pastoral need. The point is care, not collection.
- **Defensible boundary**: stripping amount at the ingest boundary means the downstream pipeline literally cannot leak amounts.

---

## Data Source

**Pushpay** transaction export (CSV).

Typical Pushpay CSV columns include:
- Transaction date
- Donor name
- Donor email
- Donor ID (Pushpay internal)
- Fund / campaign
- Amount  ← **dropped at ingest, never persisted**
- Payment method
- Recurring flag (one-time vs. scheduled)
- Status (settled, refunded, failed)

Manual export cadence: download monthly CSV from Pushpay admin → drop into a gitignored input directory.

(Pushpay API exists but requires partner credentials — manual CSV is fine for v1.)

---

## Privacy & Handling Rules

1. **Amount column stripped at the file boundary** — first step of ingest writes a sanitized CSV with no amount column. Original Pushpay export is gitignored and may be deleted after sanitization.
2. **No amount-derived signals** — no "median gift size," no "amount tier." Only counts, dates, and donor identity.
3. **Aggregate Board report contains no PII** — only totals (e.g., "47 active donors, 8 lapsed this month, 3 new").
4. **Per-donor list is pastoral-care-only** — surfaces names + last-gift-date + lapsed flag, restricted distribution (senior pastor / care team), not in the public board packet.
5. **No commit of input or per-donor output** — gitignore both. Only aggregate report goes in the repo.

---

## Metrics

### Aggregate (safe for Board)
- **Active donors** — donors with ≥ 1 gift in trailing 90 days
- **New donors** — first gift in the reporting month
- **Lapsed donors** — gave in any month of trailing 6 months but not in trailing 60 days
- **Giving cadence distribution** — count of donors by typical interval: weekly / biweekly / monthly / quarterly / sporadic
- **Recurring vs. one-time** — count of donors using scheduled gifts vs. ad-hoc
- **Fund participation** — how many donors gave to each fund (general / missions / building / etc.) — count, not amount

### Per-donor (pastoral care, restricted)
- Donor name + email
- First-gift date, last-gift date
- Total gifts in trailing 12 months (count, not amount)
- Lapsed flag + days since last gift
- New-donor flag

---

## Pipeline

```
input/pushpay/2026-04.csv         (gitignored, raw Pushpay export)
        │
        ▼
scripts/sanitize.ts                (drops amount column, normalizes dates)
        │
        ▼
data/pushpay-sanitized/2026-04.csv (gitignored — still has names/emails)
        │
        ▼
scripts/frequency-report.ts        (computes metrics)
        │
        ├──▶ data/donor-reports/2026-04-board.md     (committed — aggregate only)
        └──▶ data/donor-reports/2026-04-pastoral.md  (gitignored — per-donor)
```

All scripts run locally; no remote service required.

---

## Tech Stack

- TypeScript script (matches existing `lsc/` codebase)
- `csv-parse` for ingest
- Markdown output for both reports
- Optional: pandoc to render the Board markdown to PDF (matches `task_009` and the board-minutes pattern)

Live in `scripts/` of this repo — no new repo needed. This is small enough to be a single CLI:

```bash
npm run donor-report -- --input input/pushpay/2026-04.csv --month 2026-04
```

---

## Lapsed-Donor Definition (draft — needs Board input)

Default heuristic for v1:
- Donor gave **at least once** in the trailing 6 months, AND
- No gift in the trailing **60 days**

Tunable via CLI flag. Care team can adjust thresholds without code changes.

Edge cases to handle:
- **Snowbirds** / travel — single missed month is not lapsed (60-day window covers this).
- **Quarterly givers** — typical interval > 60 days, so the "lapsed" definition needs to consider their cadence. v2: lapsed = "missed > 2× their typical interval."
- **Annual givers** — out of scope for monthly lapsed flag; report them in an annual review instead.

---

## Output Format

### Aggregate (committed, safe to share)

```markdown
# Donor Frequency Report — April 2026

## Headline
- 47 active donors (≥ 1 gift in trailing 90 days)
- 3 new donors this month
- 8 lapsed donors (gave in trailing 6 months, no gift in 60+ days)
- 32 donors on recurring schedules

## Cadence Distribution
| Cadence    | Donors |
| ---------- | ------ |
| Weekly     | 4      |
| Biweekly   | 6      |
| Monthly    | 28     |
| Quarterly  | 5      |
| Sporadic   | 4      |

## Fund Participation (donor counts, not amounts)
| Fund       | Donors |
| ---------- | ------ |
| General    | 41     |
| Missions   | 12     |
| Building   | 8      |
```

### Per-donor (gitignored, pastoral care)

```markdown
# Pastoral Care List — April 2026

## Lapsed (gave in last 6mo, none in 60+ days)
- Jane Doe <jane@example.com> — last gift 2026-02-14 (81 days ago)
- ...

## New This Month
- John Smith <john@example.com> — first gift 2026-04-07
- ...
```

---

## Cross-References

- **`task_009` accounting**: dollar-denominated giving lives there; this task explicitly does not duplicate it.
- **`task_008` LINE bot**: future enhancement could DM the senior pastor with the lapsed list (over LINE, encrypted in transit) instead of writing to disk. Defer to v2.
- **`task_010` website**: Giving page is upstream of this — donations flow Pushpay → this report.

---

## Phased Implementation

### Phase 1 — Manual Pipeline
- [ ] Document Pushpay export steps (which report, which fields)
- [ ] `.gitignore` entries for `input/pushpay/` and `data/pushpay-sanitized/` and `data/donor-reports/*-pastoral.md`
- [ ] `scripts/sanitize.ts` — drop amount column, output sanitized CSV
- [ ] `scripts/frequency-report.ts` — compute metrics, emit two markdowns
- [ ] First monthly report from real April 2026 data

### Phase 2 — Polish
- [ ] PDF rendering via pandoc
- [ ] CLI flags for lapsed thresholds, reporting month
- [ ] Snapshot test on a synthetic CSV
- [ ] Cadence detection for quarterly givers

### Phase 3 — Beyond v1
- [ ] Pushpay API integration (skip the manual download)
- [ ] LINE-bot delivery of pastoral list to senior pastor
- [ ] 12-month engagement trend chart (counts only)

---

## Open Questions

- [ ] Who owns the Pushpay export login? Treasurer, senior pastor, or both?
- [ ] Where does the input CSV live on disk? (gitignored `input/pushpay/` proposed)
- [ ] Confirm lapsed thresholds (60 days? 90? per-donor cadence-aware?)
- [ ] Does the Board want this monthly, or quarterly?
- [ ] Distribution of the pastoral list — email? LINE? in-person handoff only?
