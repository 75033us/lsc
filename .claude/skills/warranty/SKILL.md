---
name: warranty
description: File a home warranty request on Southgate Homes. Describe the issue in natural language and Claude will pick the right category, draft details, collect photos, and submit.
argument-hint: <describe your issue>
---

# File a Warranty Request

The user wants to file a warranty request at https://southgatehomes.com/warranty-request/

## Your Job

1. **Understand the issue** from `$ARGUMENTS`. If no arguments provided, ask what the issue is.

2. **Pick the right issue category** from the dropdown list in `app/warranty/issues.txt`. Read that file to find the best match. If multiple could apply, ask the user to confirm. Tell the user which category you picked.

3. **Draft a description** based on what the user said. Show it to them and ask if they want to edit it.

4. **Ask for photos**. Ask the user if they have any photos to attach. They should provide file paths. Photos are optional.

5. **Review summary**. Show the user a summary:
   - Issue category (the exact dropdown value)
   - Description
   - Photos (if any)
   - Contact info from config (name, address, community)

   Ask them to confirm before submitting.

6. **Submit** by running the Playwright script:
   ```bash
   npx tsx app/warranty/submit.ts --issue "<exact category>" --description "<description>" --photos <photo paths>
   ```
   Note: The script opens a visible browser and pauses before clicking submit, giving the user a final chance to review in the browser. The user must press Enter in the terminal to confirm submission.

## Important Notes

- The user's homeowner config is at `app/warranty/config.json` — read it to show their contact info in the review summary.
- The complete list of issue categories is at `app/warranty/issues.txt` — always read this file to pick the category. Do NOT guess categories from memory.
- If the user describes multiple issues, handle them one at a time (one submission per issue).
- The `--issue` value must match a dropdown option exactly or be a substring match. Prefer using the full exact label from issues.txt.
