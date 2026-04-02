#!/usr/bin/env npx tsx
/**
 * Southgate Homes Warranty Request Submitter
 *
 * Usage:
 *   npx tsx app/warranty/submit.ts --issue "Plumbing" --description "Kitchen faucet leaking" --photos photo1.jpg photo2.jpg
 *   npx tsx app/warranty/submit.ts  # interactive mode
 */
import { chromium } from "playwright";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createInterface } from "readline";

const CONFIG_PATH = resolve(__dirname, "config.json");
const URL = "https://southgatehomes.com/warranty-request/";

interface Config {
  closingDate: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  zipCode: string;
  phone: string;
  community: string;
  isContact: boolean;
  altContactName: string;
  altContactPhone: string;
}

interface RequestArgs {
  issue: string;
  description: string;
  photos: string[];
  headless: boolean;
  autoSubmit: boolean;
}

function loadConfig(): Config {
  if (!existsSync(CONFIG_PATH)) {
    console.error("Config not found. Please fill in app/warranty/config.json first.");
    process.exit(1);
  }
  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8")) as Config;

  const required: (keyof Config)[] = [
    "closingDate", "firstName", "lastName", "email",
    "streetAddress", "zipCode", "phone", "community",
  ];
  const missing = required.filter((k) => !config[k]);
  if (missing.length > 0) {
    console.error(`Missing required config fields: ${missing.join(", ")}`);
    console.error(`Please fill in app/warranty/config.json`);
    process.exit(1);
  }
  return config;
}

function parseArgs(): RequestArgs {
  const args = process.argv.slice(2);
  const result: RequestArgs = {
    issue: "",
    description: "",
    photos: [],
    headless: false,
    autoSubmit: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--issue":
        result.issue = args[++i] || "";
        break;
      case "--description":
        result.description = args[++i] || "";
        break;
      case "--photos":
        i++;
        while (i < args.length && !args[i].startsWith("--")) {
          result.photos.push(resolve(args[i]));
          i++;
        }
        i--; // back up for the loop increment
        break;
      case "--headless":
        result.headless = true;
        break;
      case "--auto-submit":
        result.autoSubmit = true;
        break;
    }
  }
  return result;
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function interactiveMode(args: RequestArgs): Promise<RequestArgs> {
  // Skip interactive prompts if issue is provided (called from skill)
  if (!args.issue) {
    args.issue = await prompt("Issue category (e.g. Plumbing, HVAC, Electrical): ");
  }
  if (!args.description) {
    args.description = await prompt("Describe the issue: ");
  }
  // Only prompt for photos in interactive mode (no --issue flag)
  if (args.photos.length === 0 && !process.argv.includes("--issue")) {
    const photoPaths = await prompt("Photo paths (comma-separated, or press Enter to skip): ");
    if (photoPaths) {
      args.photos = photoPaths.split(",").map((p) => resolve(p.trim()));
    }
  }
  return args;
}

async function submit(config: Config, args: RequestArgs): Promise<void> {
  console.log("\nLaunching browser...");
  const browser = await chromium.launch({ headless: args.headless });
  const page = await browser.newPage();

  try {
    console.log("Loading warranty form...");
    await page.goto(URL, { waitUntil: "networkidle" });

    // ============================================================
    // FORM 1: Warranty eligibility checker (closing date)
    // ============================================================
    console.log("--- Form 1: Warranty Eligibility ---");
    console.log("Filling closing date...");
    const dateInput = page.locator('input[type="date"], input[name*="closing" i], input[placeholder*="date" i]').first();
    await dateInput.waitFor({ timeout: 10000 });
    await dateInput.fill(config.closingDate);
    // Trigger change event so the form calculates warranty dates
    await dateInput.dispatchEvent("change");
    await page.waitForTimeout(2000);

    // Log the warranty expiration dates if visible
    const warrantyInfo = await page.locator('text=/expir/i').allTextContents().catch(() => []);
    if (warrantyInfo.length > 0) {
      console.log("Warranty info:", warrantyInfo.join(" | "));
    }

    // ============================================================
    // FORM 2: Warranty request submission
    // ============================================================
    console.log("\n--- Form 2: Warranty Request ---");

    // Scroll to the warranty requests section
    const warrantySection = page.locator('text=WARRANTY REQUESTS').first();
    await warrantySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // --- Contact Info ---
    console.log("Filling contact info...");
    await fillField(page, "first", config.firstName);
    await fillField(page, "last", config.lastName);
    await fillField(page, "email", config.email);
    await fillField(page, "street", config.streetAddress);
    await fillField(page, "zip", config.zipCode);
    await fillField(page, "phone", config.phone);

    // --- Community Dropdown ---
    console.log("Selecting community...");
    const communitySelect = page.locator('select').filter({ has: page.locator(`option:text-is("${config.community}")`) }).first();
    await communitySelect.selectOption({ label: config.community });

    // --- Are you the contact? ---
    console.log("Setting contact preference...");
    if (config.isContact) {
      // The YES/NO are checkboxes near the "contact" question
      const checkboxes = page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();
      console.log(`Found ${count} checkboxes`);
      // YES is typically the first checkbox in this section
      await checkboxes.first().check();
    } else {
      await page.getByText('NO', { exact: true }).first().click();
      await page.waitForTimeout(500);
      if (config.altContactName) {
        await fillField(page, "contact", config.altContactName);
      }
      if (config.altContactPhone) {
        const altPhone = page.locator('input[type="tel"]').last();
        await altPhone.fill(config.altContactPhone);
      }
    }

    // --- Issue Category ---
    console.log(`Selecting issue: ${args.issue}...`);
    // Find the issue dropdown (the one with care/issue options, not community)
    const allSelects = page.locator("select");
    const selectCount = await allSelects.count();
    let issueSelect = null;
    for (let i = 0; i < selectCount; i++) {
      const sel = allSelects.nth(i);
      const text = await sel.locator("option").allTextContents();
      const joined = text.join(" ").toLowerCase();
      if (joined.includes("plumbing") || joined.includes("hvac") || joined.includes("electrical")) {
        issueSelect = sel;
        break;
      }
    }

    if (!issueSelect) {
      console.error("Could not find the issue category dropdown!");
      console.log("Taking screenshot...");
      await page.screenshot({ path: resolve(__dirname, "debug-screenshot.png"), fullPage: true });
      console.log("Saved to app/warranty/debug-screenshot.png — check if the form needs scrolling or interaction to reveal fields.");
      await browser.close();
      process.exit(1);
    }

    const options = await issueSelect.locator("option").allTextContents();
    const match = options.find((o) =>
      o.toLowerCase().includes(args.issue.toLowerCase())
    );
    if (match) {
      await issueSelect.selectOption({ label: match });
    } else {
      console.warn(`Warning: No exact match for "${args.issue}". Available options:`);
      console.warn(options.filter((o) => o.trim()).join("\n"));
      await browser.close();
      process.exit(1);
    }

    // --- Description ---
    if (args.description) {
      console.log("Filling description...");
      const textareas = page.locator("textarea");
      const taCount = await textareas.count();
      if (taCount > 0) {
        // First textarea is typically "describe your issue"
        await textareas.first().fill(args.description);
      }
    }

    // --- Photo Upload ---
    if (args.photos.length > 0) {
      console.log(`Uploading ${args.photos.length} photo(s)...`);
      const validPhotos = args.photos.filter((p) => {
        if (!existsSync(p)) {
          console.warn(`Photo not found: ${p}`);
          return false;
        }
        return true;
      });
      // Upload photos one at a time to the single file input
      const fileInput = page.locator('input[type="file"]').first();
      for (let i = 0; i < validPhotos.length; i++) {
        console.log(`  Uploading photo ${i + 1}/${validPhotos.length}: ${validPhotos[i]}`);
        await fileInput.setInputFiles(validPhotos[i]);
        // Wait for upload to complete — the site is slow to process files
        await page.waitForTimeout(60000);
      }
    }

    // --- Checkboxes (agreements) ---
    // Only check the email/sms acceptance checkboxes, skip YES/NO contact and hidden rememberme
    console.log("Accepting agreements...");
    const emailConsent = page.locator('input[name="email-acceptance"]');
    if (await emailConsent.count() > 0) await emailConsent.first().check();
    const smsConsent = page.locator('input[name="sms-acceptance"]');
    if (await smsConsent.count() > 0) await smsConsent.first().check();

    // --- Pause before submit (unless --auto-submit) ---
    if (!args.autoSubmit) {
      console.log("\n✓ Form filled! Review the browser window.");
      console.log("Please upload photos and review, then press Enter to submit, or Ctrl+C to cancel...");
      await prompt("");
    } else {
      console.log("\n✓ Form filled! Auto-submitting...");
    }

    // --- Submit (warranty form's submit button) ---
    console.log("Submitting...");
    const submitBtn = page.locator('input[type="submit"][value="submit" i], input.wpcf7-submit').first();
    await submitBtn.click();
    await page.waitForTimeout(5000);

    console.log("✓ Warranty request submitted!");
  } catch (err) {
    console.error("Error:", err);
    console.log("Taking screenshot for debugging...");
    await page.screenshot({ path: resolve(__dirname, "error-screenshot.png") });
    console.log("Screenshot saved to app/warranty/error-screenshot.png");
  } finally {
    await browser.close();
  }
}

async function fillField(page: any, nameHint: string, value: string): Promise<void> {
  // Try common patterns for finding form fields
  const selectors = [
    `input[name*="${nameHint}" i]`,
    `input[id*="${nameHint}" i]`,
    `input[placeholder*="${nameHint}" i]`,
    `input[aria-label*="${nameHint}" i]`,
  ];
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.count() > 0) {
      await el.fill(value);
      return;
    }
  }
  console.warn(`Could not find field for: ${nameHint}`);
}

// --- Main ---
async function main() {
  const config = loadConfig();
  let args = parseArgs();
  args = await interactiveMode(args);

  console.log("\n--- Warranty Request ---");
  console.log(`Issue: ${args.issue}`);
  console.log(`Description: ${args.description || "(none)"}`);
  console.log(`Photos: ${args.photos.length > 0 ? args.photos.join(", ") : "(none)"}`);
  console.log(`Community: ${config.community}`);
  console.log(`Contact: ${config.firstName} ${config.lastName}`);

  await submit(config, args);
}

main().catch(console.error);
