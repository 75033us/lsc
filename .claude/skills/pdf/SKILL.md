---
name: pdf
description: Extract text from a PDF file and convert it to a clean markdown file
---

# PDF to Markdown

Extract text from a PDF and produce a clean, well-structured markdown file.

## Arguments

The user provides: a path to a PDF file, and optionally an output path.

## Steps

1. **Check dependencies**: Verify `pdftotext` is available (`which pdftotext`). If not, install via `brew install poppler`.

2. **Extract raw text** from the PDF:
   ```bash
   pdftotext "<pdf_path>" -
   ```
   Capture the full output.

3. **Clean up the raw text**:
   - Remove standalone page numbers (lines that are just a number)
   - Remove excessive blank lines
   - Fix line breaks within paragraphs (lines that were split by PDF column width)

4. **Auto-detect structure** and format as markdown:
   - Identify headings by context (short standalone lines before content blocks)
   - Use `#` for top-level titles, `##` for sections, `###` for subsections
   - Preserve bullet points and numbered lists
   - Preserve scripture references and quotations (wrap in `>` blockquotes if appropriate)

5. **Write the output** to the specified path. If no output path given, use the same directory and filename as the PDF but with `.md` extension.

6. **Show the user** the first ~30 lines of the output for review.

## Important Notes

- The PDF text extraction is imperfect — always ask the user to review the output
- For Chinese/CJK PDFs, `pdftotext` works but may have spacing issues — clean those up
- If the PDF has complex layouts (multi-column, tables), warn the user that manual review is needed
- Do NOT guess structure blindly — if unsure about heading levels, keep the text flat and let the user decide
