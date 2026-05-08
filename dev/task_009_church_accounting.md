# Task 009: Church Accounting

## Status: Draft

## Description
Stand up the accounting/bookkeeping side of Living Spring Church (活泉靈糧堂) so the Board has clean financial records, donors get proper tax-exempt receipts, and monthly/annual reporting is straightforward. The church is a US-registered 501(c)(3) nonprofit, so the books need to satisfy IRS requirements (Form 990 / 990-EZ / 990-N depending on gross receipts) in addition to internal Board reporting.

This task scopes out the system; implementation will be split into follow-up tasks once the chart of accounts and tooling are decided.

---

## Goals

1. **Single source of truth** for all church financial activity (income, expenses, restricted funds).
2. **Donor receipts** that comply with IRS Pub. 1771 (written acknowledgment for gifts ≥ $250, statement that no goods/services were provided).
3. **Monthly reporting** to the Board: P&L, balance sheet, fund balances, budget vs. actual.
4. **Annual filing**: data ready for Form 990 / state charitable registration / state sales-tax exemption renewals.
5. **Audit trail**: every transaction linked to a source document (deposit slip, invoice, receipt).
6. **Segregation of duties**: counter ≠ depositor ≠ bookkeeper ≠ approver, to the extent staffing allows.

---

## Open Questions (need Board input)

- [ ] Fiscal year — calendar year, or other?
- [ ] Accounting basis — cash or accrual? (Cash is simpler and common for small churches.)
- [ ] Software — QuickBooks Online (Nonprofit), Aplos, Realm, Wave, or spreadsheet-only?
- [ ] Bank accounts — single operating account, or separate accounts for restricted funds (missions, building, benevolence)?
- [ ] Who are the signatories / approvers? (Treasurer + one other, typically.)
- [ ] Are there any existing books (spreadsheet, prior bookkeeper) to import?
- [ ] Donor records — keep in accounting software, or in the LINE bot (`task_008`) and sync?

---

## Chart of Accounts (draft)

Using a standard nonprofit COA structure. Numbers are illustrative.

### Assets (1000s)
- 1010 Operating Checking
- 1020 Savings
- 1030 Designated Funds Account (if separate)
- 1100 Petty Cash
- 1500 Fixed Assets — Equipment
- 1510 Accumulated Depreciation

### Liabilities (2000s)
- 2010 Accounts Payable
- 2020 Payroll Liabilities (if any staff)
- 2100 Designated/Restricted Funds Held

### Net Assets (3000s)
- 3010 Unrestricted Net Assets
- 3020 Temporarily Restricted Net Assets (missions, building, benevolence)
- 3030 Permanently Restricted Net Assets (endowment, if any)

### Income (4000s)
- 4010 Tithes & Offerings — General Fund
- 4020 Designated Giving — Missions
- 4030 Designated Giving — Building
- 4040 Designated Giving — Benevolence
- 4050 Special Events / Conference Income
- 4060 Interest Income
- 4090 Other Income

### Expenses (5000s+)
- 5010 Rent / Facilities
- 5020 Utilities
- 5030 Insurance
- 5100 Pastoral Salaries & Honoraria
- 5110 Payroll Taxes
- 5200 Worship & Music (instruments, licenses — CCLI, etc.)
- 5210 Children's Ministry
- 5220 Small Groups / Discipleship
- 5230 Outreach / Evangelism
- 5240 Hospitality / Fellowship Meals
- 5300 Missions Disbursements
- 5310 Benevolence Disbursements
- 5400 Office / Admin (printing, postage, software)
- 5410 Bank / Payment Processing Fees
- 5420 Professional Services (CPA, legal)
- 5500 Equipment & Depreciation

---

## Workflows

### Sunday Offering
1. Two unrelated counters open offering envelopes after service, count cash + checks separately, both sign the count sheet.
2. Counters complete deposit slip; deposit goes to bank within 24–48h (one counter ≠ depositor when possible).
3. Bookkeeper records each gift in accounting software, tagged to donor + fund (general / missions / building / etc.).
4. Counter sheet + deposit slip filed by date.

### Online / Bank Transfer Giving
1. Bookkeeper reconciles processor (Zelle, ACH, Stripe, etc.) report against bank deposits weekly.
2. Records each gift to donor + fund.
3. Processor fees booked to 5410.

### Bills & Reimbursements
1. Requester submits invoice or receipt + reimbursement form.
2. Treasurer (or designate) approves; second signature for amounts above a threshold (e.g., $1,000).
3. Bookkeeper enters bill, schedules payment.
4. Payment issued (check or ACH); both stub and receipt filed.

### Restricted Funds
- Income tagged to the fund at deposit time.
- Expenses against the fund tagged at payment time.
- Monthly report shows opening balance, additions, releases, ending balance per fund.
- Donor restrictions are honored — restricted gifts cannot be redirected without donor consent.

---

## Reporting

### Monthly (to Board)
- Statement of Activities (P&L) — current month + YTD vs. budget.
- Statement of Financial Position (balance sheet).
- Fund balances summary (restricted vs. unrestricted).
- Cash position + bank reconciliation summary.
- Notable variances called out.

### Annual
- Year-end Statement of Activities + Financial Position.
- Fund balance roll-forward.
- Donor giving statements (mailed/emailed by Jan 31 for prior year).
- Form 990 / 990-EZ / 990-N filing data (depends on gross receipts; 990-N if < $50K).
- State charitable registration renewal.
- Property tax exemption renewal (if applicable).
- 1099-NEC for contractors paid ≥ $600 (e.g., guest speakers).

---

## Donor Receipts

### Per-gift acknowledgment (recommended)
- Sent for gifts ≥ $250 (IRS requirement) — but easier to send for all.
- Must include: church name + EIN, date, amount (cash) or description (non-cash, no value stated), statement: *"No goods or services were provided in exchange for this contribution."*

### Year-end statement
- Mailed/emailed by Jan 31.
- Itemizes all deductible gifts for the prior calendar year.
- Same disclosure language as above.

---

## Compliance Calendar (US, 501(c)(3))

| When | What |
|------|------|
| Jan 31 | W-2s to employees; 1099-NECs to contractors |
| Jan 31 | Donor year-end giving statements |
| Quarterly | Payroll tax deposits (if applicable) |
| 5/15 | Form 990 / 990-EZ / 990-N due (for calendar-year orgs) |
| State-specific | Charitable solicitation registration renewal |
| State-specific | Sales tax exemption renewal |

---

## Dependencies / Related

- **`task_008` LINE bot — `giving` module**: links + bank info; does NOT process payments. Bot may surface "request a giving statement" but the statement itself is generated from the accounting system.
- Board minutes (`data/board/`): record material financial decisions (budget approval, large disbursements, fund designations).

---

## Phased Implementation

### Phase 1 — Decisions & Setup
- [ ] Board decides: fiscal year, basis (cash/accrual), software
- [ ] Open / confirm bank accounts; document signatories
- [ ] Lock in chart of accounts
- [ ] Document counter / deposit / approval policy

### Phase 2 — Books & Backfill
- [ ] Set up accounting software with COA
- [ ] Import opening balances
- [ ] Backfill YTD transactions
- [ ] Reconcile to bank statements

### Phase 3 — Operating Cadence
- [ ] Counter sheets + deposit workflow live
- [ ] Weekly reconciliation
- [ ] Monthly Board financial packet
- [ ] Donor receipt template + send process

### Phase 4 — Year-End & Filing
- [ ] Year-end donor statements
- [ ] Form 990-* filing
- [ ] State renewals
- [ ] Independent review or audit (depending on size / state requirements)
