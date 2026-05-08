# Task 012: PII Handling — "Good Enough" for a Small Church

## Status: Draft

## Description
Define a pragmatic, low-friction baseline for handling PII (donor names, emails, phone numbers, addresses, giving frequency) in this repo. Living Spring Church has fewer than 20 families; the realistic threat model is small, the operator is one person (Shine), and over-engineering will get abandoned. Goal: **good enough**, not enterprise-grade.

This task is intentionally pragmatic. Anything that adds daily friction without proportionate risk reduction gets left out.

---

## Scope

**In scope** — files under this repo's working tree:
- Pushpay transaction exports (`input/<date>/Pushpay-*.csv`)
- Sanitized per-tx CSV (`data/pushpay-sanitized/`)
- Donor frequency matrix (`data/donor-reports/pii/donor-frequency-matrix.csv`)
- Pastoral lists (`data/donor-reports/pii/*-pastoral.md`)
- Future: small group rosters, prayer-request exports, event registrations, baptism rosters

**Out of scope**:
- Books of record (lives in Pushpay + accounting software per `task_009`)
- LINE bot user database (lives in production SQLite per `task_008`)
- General GitHub account hygiene unless church-data-specific

---

## Threat Model (realistic for this church)

Likelihood × impact, ranked:

| Threat | Likelihood | Impact | Mitigation priority |
| --- | --- | --- | --- |
| Accidental commit of PII to a public-facing repo | Medium (muscle memory, future contributors) | High (donor trust) | **High** |
| iCloud / Dropbox sync silently uploading working tree | Medium | Medium-High | **High** |
| Laptop theft | Low | Medium (FileVault makes this Low) | Medium |
| GitHub account compromise | Low (with 2FA) | High | Medium |
| Future contributor seeing donor data on their machine | Medium-High (whenever a 2nd person is added) | Medium | **High** |
| Targeted attack against the church | Very Low | High | Low |
| Subpoena / compelled disclosure | Very Low | n/a | Out of scope |

The big lessons: the realistic risks are **operator mistakes** and **silent cloud sync**, not adversaries. Focus mitigations there.

---

## Baseline ("Good Enough") — Do These

These are the small set of things we should always have on. Each is one-time setup.

### B1. Repo & account hygiene
- [ ] GitHub repo confirmed `private`: `gh repo view --json visibility`
- [ ] GitHub 2FA on (passkey or authenticator): `gh auth status`
- [ ] FileVault enabled (macOS): `fdesetup status`
- [ ] No PII in `git log` history: `git log --all --full-history --diff-filter=A --name-only | rg -i 'pushpay|donor|pii' || echo OK`

### B2. Gitignore discipline
- [x] `input/` ignored (already)
- [x] `data/pushpay-sanitized/` ignored (already)
- [x] `data/donor-reports/pii/` ignored (already)
- [ ] Add belt-and-suspenders pattern: `*Pushpay-Transactions*.csv` ignored anywhere

### B3. Pre-commit guard
- [ ] Lightweight pre-commit hook scanning staged content for: `Pushpay-Transactions`, email addresses (regex), phone numbers (regex), `Community Member ID`. Block commit if matched.
- Hook lives in `.git/hooks/pre-commit` or `husky` (latter is checked-in and survives clones).
- Use `gitleaks` only if husky feels heavy — gitleaks brings its own ruleset.

### B4. PII outside the working tree (recommended)
- [ ] Create `~/Documents/lsc-private/` (or an encrypted APFS sparse bundle).
- [ ] Move `input/` and `data/donor-reports/pii/` and `data/pushpay-sanitized/` contents there.
- [ ] Symlink them back into the repo:
  ```bash
  ln -s ~/Documents/lsc-private/input ./input
  ln -s ~/Documents/lsc-private/donor-reports-pii ./data/donor-reports/pii
  ln -s ~/Documents/lsc-private/pushpay-sanitized ./data/pushpay-sanitized
  ```
- [ ] If using a sparse bundle: mount before running reports, eject after. macOS does AES-256 transparently.

### B5. Retention
- [ ] Raw Pushpay CSV: delete 30 days after report generation (script can prune on each run).
- [ ] Pastoral lists: senior pastor decides retention (default: 90 days then purge).
- [ ] Aggregate Board reports: keep indefinitely (no PII).

### B6. Audit ritual
- [ ] Quarterly `git log -p --all -- '*pushpay*' '*pii*' '*.env' | head -50` — confirm nothing slipped in.
- [ ] If something ever does: `git filter-repo`, force-push, rotate any exposed credentials, document the incident.

---

## Optional Layers — Add Only If Pain Shows Up

Don't do these by default. Each adds friction.

| Layer | When to add | Why we skip by default |
| --- | --- | --- |
| Anonymize donor IDs at ingest (hash + salt) | When 2+ people will read the matrix | One-person workflow; we already restrict the matrix to the operator |
| Hardware security key for GitHub | If credentials are ever phished or shared | Passkey + device biometrics is sufficient for one-operator |
| `git-crypt` per-file encryption | If we ever need to commit PII (we shouldn't) | Adds key management overhead |
| External KMS / vaulted secrets | When we have ≥ 1 service handling donor data programmatically | We currently have zero |
| Formal Data Processing Agreement (DPA) with Pushpay | Required by some state regs once size grows | Their standard ToS already covers a small church |
| Documented privacy policy on the website | Required by California/Virginia/etc. once we have residents giving | Worth doing on `task_010` regardless — small effort |

---

## What We're Explicitly Not Doing

- **No SOC 2 / HIPAA-style controls.** Not applicable.
- **No row-level encryption in the matrix.** It's already PII; the file lives in an encrypted disk image, that's enough.
- **No automated breach detection.** We rely on quarterly manual audit.
- **No full data lineage / DLP.** One-operator, one-laptop scope.
- **No anonymization of pastoral lists.** Defeats the purpose — pastors need names to reach out.

---

## Cross-References

- **`task_009` accounting**: dollar data lives in Pushpay + accounting software, never in this repo.
- **`task_010` website**: needs a public-facing privacy policy page (at least minimal "we don't sell your data, contact form info goes to staff only").
- **`task_011` donor frequency report**: primary consumer of these guardrails — script writes only sanitized + aggregate to the repo, PII to the symlinked external dir.

---

## Phased Implementation

### Phase 1 — Baseline (this task)
- [ ] B1 checks (verify repo private, 2FA, FileVault)
- [ ] B2 gitignore tightening
- [ ] B3 pre-commit hook (husky or hand-written)
- [ ] B4 move PII to `~/Documents/lsc-private/` + symlinks
- [ ] B5 retention pruning in `scripts/donor-frequency.ts`
- [ ] B6 first quarterly audit run

### Phase 2 — Add When Triggered
- [ ] Privacy policy page on website (when website launches — `task_010`)
- [ ] Anonymized donor IDs (when matrix needs to leave the operator's machine)
- [ ] DPA review with Pushpay (annual, on contract renewal)

---

## Open Questions

- [ ] Encrypted sparse bundle vs. plain folder under FileVault — sparse bundle adds mount/eject friction; FileVault alone is probably sufficient given laptop never leaves the home/church. **Decision needed.**
- [ ] husky vs. plain `.git/hooks/pre-commit` — husky survives clones (better for future contributors); plain is zero-dep. **Lean husky.**
- [ ] Pastoral list retention default — 90 days? Per pastor preference? **Ask senior pastor.**
- [ ] Do we want `git-secrets` / `gitleaks` config tracked in repo so it runs on any clone, or hook-only? **Lean tracked config + husky.**
- [ ] Where does the PII-bearing directory live for someone running this on a different machine in the future (e.g., the treasurer)? Standardize on `~/Documents/lsc-private/` cross-machine?
