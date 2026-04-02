# Warranty Request Tool

Automates filing home warranty requests on Southgate Homes.

## Setup

1. Fill in your homeowner info in `config.json` (saved once, reused every time):

```json
{
  "closingDate": "2025-01-15",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "streetAddress": "123 Main St",
  "zipCode": "75078",
  "phone": "972-555-1234",
  "community": "Windsong Ranch 61' Series - Prosper",
  "isContact": true
}
```

2. Install Playwright browsers (first time only):
```bash
npx playwright install chromium
```

## Usage

```bash
# Interactive mode (prompts for issue, description, photos)
npx tsx app/warranty/submit.ts

# With arguments
npx tsx app/warranty/submit.ts --issue "Plumbing - Sink" --description "Kitchen faucet leaking" --photos photo1.jpg photo2.jpg

# Headless mode (no browser window)
npx tsx app/warranty/submit.ts --issue "HVAC - Air Conditioner" --description "AC not cooling" --headless
```

The tool opens a browser, fills the form, and **pauses for you to review** before submitting. Press Enter to confirm or Ctrl+C to cancel.

## How it works

The website has two forms:
1. **Form 1** — Closing date → shows warranty expiration dates
2. **Form 2** — Contact info + issue details → submits the request

The tool fills both automatically. Contact info comes from `config.json`. Issue details come from CLI args or interactive prompts.

## Issue Categories

The `--issue` flag does fuzzy matching. You can pass a partial string like `"Plumbing"` or the full label like `"PLUMBING - Sink"`.

See [issues.txt](issues.txt) for the full list. Main categories:

- APPLIANCES, ALARMS, CABINETS, CONCRETE, CERAMIC TILE
- DOORS-EXTERIOR, DOORS-GARAGE, DOORS-INTERIOR
- ELECTRICAL, FIREPLACES, FLOORING, HVAC, INSULATION
- KITCHEN ISLAND, MIRRORS, MISCELLANEOUS
- OUTSIDE, PAINT/STAIN, PLUMBING, ROOF
- STAIRS, TRIM, WALLPAPER, WEATHER STRIPPING
- WINDOWS, YARD
