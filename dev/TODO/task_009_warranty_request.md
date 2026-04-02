# Task 009: Home Warranty Request Tool

## Status: TODO

## Description
A Playwright-based tool to automate filing home warranty requests on https://southgatehomes.com/warranty-request/. Remembers form answers and photos for repeat submissions.

## Location
`app/warranty/`

## Form Fields

### Contact Info (saved in config)
| Field | Type | Required |
|-------|------|----------|
| Closing Date | date picker | Yes |
| First Name | text | Yes |
| Last Name | text | Yes |
| Email Address | email | Yes |
| Street Address | text | Yes |
| ZIP Code | text | Yes |
| Phone Number | tel | Yes |
| Community | dropdown | Yes |
| Are you the contact? | radio (Yes/No) | Yes |
| Contact Name | text | Conditional (if No) |
| Contact Phone | tel | Conditional (if No) |

### Community Options
- Eliana - McKinney
- Painted Tree 50' Series - McKinney
- Painted Tree 60' Series - McKinney
- Prosper Ridge - Prosper
- The Reserve at Watters - Allen
- Windsong Ranch 61' Series - Prosper
- Windsong Ranch 71' Series - Prosper
- Northwood Manor - Frisco
- 5T Ranch - Argyle
- Brockdale Estates - Lucas
- Edgestone at Legacy - Edgewood
- Lakes of Argyle - Northglen
- Stoney Creek
- The Grove Frisco - Frisco
- Twin Creeks

### Per-Request Fields (provided each time)
| Field | Type | Required |
|-------|------|----------|
| Customer care issue | dropdown (100+ options) | Yes |
| Describe your issue | textarea | No |
| Upload image | file (3MB limit) | No |
| Agree to email | checkbox | Yes |
| Agree to text | checkbox | Yes |

### Common Issue Categories
Appliances, Alarms, Cabinets, Concrete, Ceramic Tile, Doors (Exterior/Interior/Garage), Electrical, Fireplaces, Flooring, HVAC, Kitchen Island, Mirrors, Outside features, Paint/Stain, Plumbing, Roof, Stairs, Trim, Wallpaper, Weather Stripping, Windows, Yard

## Design

### Config File: `app/warranty/config.json`
Stores homeowner info (reused across submissions):
```json
{
  "closingDate": "2025-01-15",
  "firstName": "",
  "lastName": "",
  "email": "",
  "streetAddress": "",
  "zipCode": "",
  "phone": "",
  "community": "",
  "isContact": true,
  "altContactName": "",
  "altContactPhone": ""
}
```

### Usage
```bash
# First time: set up your profile
npx tsx app/warranty/setup.ts

# File a request
npx tsx app/warranty/submit.ts --issue "Plumbing" --description "Kitchen faucet leaking" --photos photo1.jpg photo2.jpg

# Or interactive mode
npx tsx app/warranty/submit.ts
```

### Tech Stack
- **Playwright** — browser automation
- **Config file** — `app/warranty/config.json` (gitignored, contains PII)

## Implementation Steps
- [ ] Add playwright dependency
- [ ] Create config.json template and setup script
- [ ] Create submit script with Playwright form filling
- [ ] Handle file uploads (photos)
- [ ] Handle checkboxes (agreements)
- [ ] Add to .gitignore (config.json with PII)
