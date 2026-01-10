# Task 000: Design Decisions

## Status: Active (Living Document)

## Description
This document captures the design decisions and rationale for the LSC worship song lyrics library.

---

## Session: 2026-01-09

**TLDR**: Initial project setup - created README.md with library design and task structure.

**Context**: Building a worship song lyrics library for LSC that supports Chinese, English, and Pinyin lyrics with slide generation capabilities.

**Problem**: Need a structured way to store and query worship songs with multi-language support, copyright tracking, and slide generation for worship services.

**Solution**:
- Designed JSON-based song storage format with sections (V1, C, B, etc.)
- Separate worship history tracking by date
- Slide output combines all three languages per slide
- Created comprehensive README.md documenting the schema and usage

**Next Steps**:
- Implement song JSON schema validation
- Build CLI tool for querying and slide generation
- Create sample song files
- Add search functionality

---

## Design Decisions

### Storage Format: JSON
- Chose JSON over YAML/Markdown for easier programmatic parsing
- One file per song for modularity and git-friendly changes

### Song Schema: Slide-based Structure
- Each section (V1, C, B, etc.) is an array of slide objects
- Each slide contains: chinese, pinyin, english (in that order for verification)
- One slide = one lyric unit displayed on screen

### Slide Output: JSON with Templates
- Output is JSON array of slides
- Two template types: `title` (section header), `verse` (lyrics)
- Font sizes: chinese (88pt), pinyin (54pt), english (40pt)
- PPTX generation uses templates from `templates/` directory

### Worship History: Date-based Files
- Stored in `worship/` directory
- One JSON file per service date (e.g., `2026-01-05.json`)
- Each file contains song list with sequences
- Same file serves as input for slide generation

### CLI Commands
- `generate`: Create PPTX from worship file + template
- `search`: Full-text fuzzy search across all song fields
- `list`: List all songs
- `history`: Query when a song was used
- `import`: Extract lyrics from YouTube URL

---

## Known Issues

(None yet)
