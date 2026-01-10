# Task 002: Slide Generator

## Status: Pending

## Description
Build the core slide generation functionality that reads a worship file and outputs formatted slides using a PPTX template.

## Command
```bash
./lsc generate --template templates/lsc.pptx --worship worship/2026-01-05.json > 2026-01-05.pptx
```

## Input Format

Worship file (`worship/2026-01-05.json`):
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

## Output Format

JSON array of slides with template types and font sizes:

- **title**: Section header slide (V1, C, B, etc.)
- **verse**: Lyric slide with chinese (88pt), pinyin (54pt), english (40pt)

```json
[
  {
    "template": "title",
    "content": "V1"
  },
  {
    "template": "verse",
    "content": {
      "chinese": { "text": "奇異恩典，何等甘甜", "fontSize": 88 },
      "pinyin": { "text": "Qíyì ēndiǎn, héděng gāntián", "fontSize": 54 },
      "english": { "text": "Amazing grace, how sweet the sound", "fontSize": 40 }
    }
  },
  {
    "template": "verse",
    "content": {
      "chinese": { "text": "我罪已得赦免", "fontSize": 88 },
      "pinyin": { "text": "Wǒ zuì yǐ dé shèmiǎn", "fontSize": 54 },
      "english": { "text": "That saved a wretch like me", "fontSize": 40 }
    }
  },
  {
    "template": "title",
    "content": "C"
  },
  {
    "template": "verse",
    "content": { ... }
  }
]
```

## Requirements
- Parse worship JSON file
- Load song JSON files from `songs/` by name
- Generate section header slide (`template: "title"`) before each section
- Generate lyric slides (`template: "verse"`) with font sizes:
  - chinese: 88pt
  - pinyin: 54pt
  - english: 40pt
- Handle repeated sections (e.g., "C C" plays chorus twice)
- Use PPTX template from `templates/` directory
- Output final PPTX file

## Acceptance Criteria
- [ ] Parse worship file correctly
- [ ] Load corresponding song files from `songs/`
- [ ] Generate JSON slide structure with correct templates
- [ ] Apply font sizes (chinese: 88, pinyin: 54, english: 40)
- [ ] Handle all section types (V1-Vn, C, PC, B, T, E, I, O)
- [ ] Load and use PPTX template
- [ ] Export to PPTX format
- [ ] Graceful error handling for missing songs/sections

## Notes
- Consider using python-pptx or similar library for PPTX generation
- Template file defines slide layouts (title layout, verse layout)
- May also support JSON-only output for debugging (skip PPTX generation)
