# Task 003: CLI Tool Implementation

## Status: Pending

## Description
Create a command-line interface for interacting with the song library.

## Commands

### `generate`
Generate slides from a worship file.
```bash
./lsc generate worship/2026-01-05.json > 2026-01-05.pptx
```

### `search`
Full-text fuzzy search across all song fields.
```bash
./lsc search "Amazing Grace"
./lsc search "奇異恩典"
./lsc search "ēndiǎn"
```

### `list`
List all songs in the library.
```bash
./lsc list
./lsc list --format table
```

### `history`
Query worship history for a song (outputs dates when song was used).
```bash
./lsc history song_001
```
Output: List of worship files containing this song.

### `import`
Import a song from URL (extracts lyrics from YouTube description, etc.).
```bash
./lsc import "https://youtube.com/watch?v=..." > songs/song_001.json
```

### `validate`
Validate song files against schema.
```bash
./lsc validate
./lsc validate songs/song_001.json
```

## Acceptance Criteria
- [ ] `generate` command implemented
- [ ] `search` command with fuzzy matching
- [ ] `list` command implemented
- [ ] `history` command implemented
- [ ] `import` command implemented
- [ ] `validate` command implemented
- [ ] Help text for each command
- [ ] Error handling with useful messages
- [ ] Exit codes for scripting

## Notes
- Consider using Node.js with Commander.js or Python with Click
- Config file for library path settings
- Fuzzy search library needed (e.g., fuse.js, fuzzywuzzy)
