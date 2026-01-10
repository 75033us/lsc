# Task 005: Worship History Tracking

## Status: Pending

## Description
Implement worship history storage and querying functionality.

## Storage Structure

Worship history is stored in `worship/` directory with one JSON file per service date:

```
worship/
├── 2026-01-05.json
├── 2026-01-12.json
└── ...
```

Each worship file format:
```json
[
  {
    "name": "song_001",
    "sequence": "V1 C V2 C"
  },
  {
    "name": "song_002",
    "sequence": "V1 V2 C B"
  }
]
```

## Command
```bash
./lsc history song_001
```

Output example:
```
song_001 was used in:
  - worship/2026-01-05.json (sequence: V1 C V2 C)
  - worship/2025-12-22.json (sequence: V1 V2 C C)
  - worship/2025-11-10.json (sequence: V1 C V2 C B)
```

## Requirements
- Scan all files in `worship/` directory
- Find all occurrences of a given song ID
- Display dates and sequences used
- Sort by date (most recent first)

## Acceptance Criteria
- [ ] Worship file schema defined and validated
- [ ] Query by song ID implemented
- [ ] Output shows date and sequence for each usage
- [ ] Results sorted by date descending

## Notes
- Worship files also serve as input for `./lsc generate`
- May add statistics in future (most used songs, frequency, etc.)
