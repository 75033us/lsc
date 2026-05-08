import { parse } from "csv-parse/sync";
import * as fs from "node:fs";
import * as path from "node:path";

const DEFAULT_INPUT = "input/2026-05-06-donor-frequency/Pushpay-Transactions_2026-05-06-2222.csv";
const SANITIZED_DIR = "data/pushpay-sanitized";
const REPORT_DIR = "data/donor-reports";
const PII_DIR = path.join(REPORT_DIR, "pii");

const LAPSED_NO_GIFT_DAYS = 60;
const LAPSED_WINDOW_DAYS = 180;
const ACTIVE_DAYS = 90;

interface Tx {
  date: string;
  ym: string;
  donorId: string;
  firstName: string;
  lastName: string;
  email: string;
  fund: string;
  recurring: boolean;
}

const escapeCsv = (v: unknown): string => {
  const s = v == null ? "" : String(v);
  return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function loadAndSanitize(csvPath: string): { txs: Tx[]; sanitizedCsv: string } {
  const raw = fs.readFileSync(csvPath, "utf8");
  const records = parse(raw, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    relax_quotes: true,
  }) as Record<string, string>[];

  const txs: Tx[] = [];
  const sanitizedRows: Record<string, string>[] = [];

  for (const r of records) {
    if (r.Status !== "Success") continue;
    const donorId = r["Community Member ID"];
    if (!donorId) continue;
    const date = r["Received On"];
    if (!date) continue;

    txs.push({
      date,
      ym: date.slice(0, 7),
      donorId,
      firstName: r["First Name"] ?? "",
      lastName: r["Last Name"] ?? "",
      email: r.Email ?? "",
      fund: r["Fund Name"] ?? "(unspecified)",
      recurring: !!r["Recurring Payment Token"],
    });

    const { Amount: _a, "Payment Reference": _pr, "Payment Token": _pt, ...rest } = r;
    sanitizedRows.push(rest);
  }

  const headers = Object.keys(sanitizedRows[0] ?? {});
  const lines = [headers.map(escapeCsv).join(",")];
  for (const row of sanitizedRows) {
    lines.push(headers.map((h) => escapeCsv(row[h] ?? "")).join(","));
  }
  return { txs, sanitizedCsv: lines.join("\n") };
}

function buildMonthAxis(start: string, end: string): string[] {
  const out: string[] = [];
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) {
      y++;
      m = 1;
    }
  }
  return out;
}

const daysBetween = (a: string, b: string): number =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);

function median(nums: number[]): number {
  if (!nums.length) return Infinity;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function classifyCadence(gaps: number[]): string {
  if (!gaps.length) return "Single gift";
  const med = median(gaps);
  if (med <= 10) return "Weekly";
  if (med <= 17) return "Biweekly";
  if (med <= 45) return "Monthly";
  if (med <= 120) return "Quarterly";
  return "Sporadic";
}

function main() {
  const input = process.argv[2] ?? DEFAULT_INPUT;
  if (!fs.existsSync(input)) {
    console.error(`Input not found: ${input}`);
    process.exit(1);
  }

  fs.mkdirSync(SANITIZED_DIR, { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(PII_DIR, { recursive: true });

  const { txs, sanitizedCsv } = loadAndSanitize(input);
  const inputName = path.basename(input).replace(/\.csv$/, "");
  fs.writeFileSync(path.join(SANITIZED_DIR, `${inputName}-no-amount.csv`), sanitizedCsv);

  const byDonor = new Map<string, Tx[]>();
  for (const tx of txs) {
    if (!byDonor.has(tx.donorId)) byDonor.set(tx.donorId, []);
    byDonor.get(tx.donorId)!.push(tx);
  }

  const allYms = txs.map((t) => t.ym).sort();
  const months = buildMonthAxis(allYms[0], allYms[allYms.length - 1]);
  const allDates = txs.map((t) => t.date).sort();
  const today = allDates[allDates.length - 1];
  const latestYm = months[months.length - 1];

  // ---- Donor × month matrix ----
  type MatrixRow = {
    name: string;
    email: string;
    total: number;
    counts: Record<string, number>;
  };
  const matrix: MatrixRow[] = [];
  for (const [, list] of byDonor) {
    const counts: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]));
    for (const tx of list) counts[tx.ym]++;
    const sample = list[0];
    matrix.push({
      name: `${sample.firstName} ${sample.lastName}`.trim(),
      email: sample.email,
      total: list.length,
      counts,
    });
  }
  matrix.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  const matrixHeader = ["Donor Name", "Email", "Total", ...months];
  const matrixLines = [matrixHeader.map(escapeCsv).join(",")];
  for (const row of matrix) {
    matrixLines.push(
      [row.name, row.email, row.total, ...months.map((m) => row.counts[m])]
        .map(escapeCsv)
        .join(","),
    );
  }
  fs.writeFileSync(path.join(PII_DIR, "donor-frequency-matrix.csv"), matrixLines.join("\n"));

  // ---- Per-donor signals ----
  const lastGift = new Map<string, string>();
  const firstGift = new Map<string, string>();
  for (const tx of txs) {
    if (!lastGift.has(tx.donorId) || tx.date > lastGift.get(tx.donorId)!) {
      lastGift.set(tx.donorId, tx.date);
    }
    if (!firstGift.has(tx.donorId) || tx.date < firstGift.get(tx.donorId)!) {
      firstGift.set(tx.donorId, tx.date);
    }
  }

  const daysSince = (d: string) => daysBetween(d, today);

  const activeIds = [...lastGift].filter(([, d]) => daysSince(d) <= ACTIVE_DAYS).map(([id]) => id);
  const lapsedIds = [...lastGift]
    .filter(([id, d]) => {
      const list = byDonor.get(id)!;
      const gaveInWindow = list.some((t) => daysSince(t.date) <= LAPSED_WINDOW_DAYS);
      return gaveInWindow && daysSince(d) > LAPSED_NO_GIFT_DAYS;
    })
    .map(([id]) => id);
  const newThisMonthIds = [...firstGift]
    .filter(([, d]) => d.slice(0, 7) === latestYm)
    .map(([id]) => id);

  const recurringDonors = new Set<string>();
  for (const tx of txs) if (tx.recurring) recurringDonors.add(tx.donorId);

  // cadence distribution
  const cadenceCount: Record<string, number> = {};
  for (const [, list] of byDonor) {
    const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
    const gaps: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      gaps.push(daysBetween(sorted[i - 1].date, sorted[i].date));
    }
    const c = classifyCadence(gaps);
    cadenceCount[c] = (cadenceCount[c] ?? 0) + 1;
  }

  // fund participation
  const fundDonors: Record<string, Set<string>> = {};
  for (const tx of txs) {
    (fundDonors[tx.fund] ??= new Set()).add(tx.donorId);
  }
  const fundParticipation = Object.entries(fundDonors)
    .map(([f, s]) => [f, s.size] as const)
    .sort((a, b) => b[1] - a[1]);

  // monthly active donors
  const monthlyDonors: Record<string, Set<string>> = {};
  const monthlyGifts: Record<string, number> = {};
  for (const tx of txs) {
    (monthlyDonors[tx.ym] ??= new Set()).add(tx.donorId);
    monthlyGifts[tx.ym] = (monthlyGifts[tx.ym] ?? 0) + 1;
  }

  // ---- Board report ----
  const boardLines: string[] = [];
  boardLines.push(`# Donor Frequency Report — through ${today}`);
  boardLines.push("");
  boardLines.push(
    `Source: Pushpay export of ${txs.length} successful gifts from ${allDates[0]} to ${today}.`,
  );
  boardLines.push(
    "Amount data is excluded by design — this report tracks giving frequency only.",
  );
  boardLines.push("");
  boardLines.push("## Headline");
  boardLines.push("");
  boardLines.push(`- **${byDonor.size}** unique donors over the full period`);
  boardLines.push(`- **${activeIds.length}** active donors (≥ 1 gift in trailing ${ACTIVE_DAYS} days)`);
  boardLines.push(`- **${newThisMonthIds.length}** new donors in ${latestYm}`);
  boardLines.push(
    `- **${lapsedIds.length}** lapsed (gave in trailing ${LAPSED_WINDOW_DAYS} days, none in ${LAPSED_NO_GIFT_DAYS}+ days)`,
  );
  boardLines.push(`- **${recurringDonors.size}** donors have ever used a recurring schedule`);
  boardLines.push("");
  boardLines.push("## Cadence Distribution");
  boardLines.push("");
  boardLines.push("| Cadence | Donors |");
  boardLines.push("| --- | --- |");
  for (const c of ["Weekly", "Biweekly", "Monthly", "Quarterly", "Sporadic", "Single gift"]) {
    if (cadenceCount[c]) boardLines.push(`| ${c} | ${cadenceCount[c]} |`);
  }
  boardLines.push("");
  boardLines.push("## Fund Participation (donor counts, not amounts)");
  boardLines.push("");
  boardLines.push("| Fund | Donors |");
  boardLines.push("| --- | --- |");
  for (const [f, n] of fundParticipation) boardLines.push(`| ${f} | ${n} |`);
  boardLines.push("");
  boardLines.push("## Monthly Activity");
  boardLines.push("");
  boardLines.push("| Month | Active Donors | Gifts |");
  boardLines.push("| --- | --- | --- |");
  for (const m of months) {
    boardLines.push(`| ${m} | ${monthlyDonors[m]?.size ?? 0} | ${monthlyGifts[m] ?? 0} |`);
  }
  boardLines.push("");
  fs.writeFileSync(path.join(REPORT_DIR, `${today}-board.md`), boardLines.join("\n"));

  // ---- Pastoral list ----
  const pastoralLines: string[] = [];
  pastoralLines.push(`# Pastoral Care List — generated ${today}`);
  pastoralLines.push("");
  pastoralLines.push(
    "**Confidential** — restricted distribution. Frequency-only signals; no amounts.",
  );
  pastoralLines.push("");
  pastoralLines.push(`## Lapsed (gave in trailing ${LAPSED_WINDOW_DAYS} days, none in ${LAPSED_NO_GIFT_DAYS}+ days)`);
  pastoralLines.push("");
  if (!lapsedIds.length) {
    pastoralLines.push("_None._");
  } else {
    const sorted = [...lapsedIds].sort(
      (a, b) => daysSince(lastGift.get(b)!) - daysSince(lastGift.get(a)!),
    );
    for (const id of sorted) {
      const list = byDonor.get(id)!;
      const sample = list[0];
      const name = `${sample.firstName} ${sample.lastName}`.trim();
      const last = lastGift.get(id)!;
      pastoralLines.push(
        `- **${name}** <${sample.email}> — last gift ${last} (${daysSince(last)} days ago, ${list.length} total gifts)`,
      );
    }
  }
  pastoralLines.push("");
  pastoralLines.push(`## New This Month (${latestYm})`);
  pastoralLines.push("");
  if (!newThisMonthIds.length) {
    pastoralLines.push("_None._");
  } else {
    for (const id of newThisMonthIds) {
      const list = byDonor.get(id)!;
      const sample = list[0];
      const name = `${sample.firstName} ${sample.lastName}`.trim();
      pastoralLines.push(
        `- **${name}** <${sample.email}> — first gift ${firstGift.get(id)}`,
      );
    }
  }
  pastoralLines.push("");
  fs.writeFileSync(path.join(PII_DIR, `${today}-pastoral.md`), pastoralLines.join("\n"));

  // ---- console summary ----
  console.log(`Sanitized CSV  → ${path.join(SANITIZED_DIR, `${inputName}-no-amount.csv`)}`);
  console.log(`Donor matrix   → ${path.join(PII_DIR, "donor-frequency-matrix.csv")}  [PII, gitignored]`);
  console.log(`Board report   → ${path.join(REPORT_DIR, `${today}-board.md`)}`);
  console.log(`Pastoral list  → ${path.join(PII_DIR, `${today}-pastoral.md`)}  [PII, gitignored]`);
  console.log("");
  console.log(`Donors: ${byDonor.size}  |  Active(${ACTIVE_DAYS}d): ${activeIds.length}  |  Lapsed: ${lapsedIds.length}  |  New ${latestYm}: ${newThisMonthIds.length}`);
}

main();
