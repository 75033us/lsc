# Task 001: Song JSON Schema & Validation

## Status: Pending

## Description
Create a JSON schema for song files and implement validation.

## Song Schema Structure

```json
{
  "id": "song_001",
  "title": {
    "chinese": "奇異恩典",
    "pinyin": "Qíyì Ēndiǎn",
    "english": "Amazing Grace"
  },
  "sections": {
    "V1": [
      {
        "chinese": "奇異恩典，何等甘甜",
        "pinyin": "Qíyì ēndiǎn, héděng gāntián",
        "english": "Amazing grace, how sweet the sound"
      }
    ],
    "C": [ ... ]
  },
  "copyright": { ... },
  "sources": [ ... ]
}
```

## Requirements
- Define strict JSON schema for song structure
- Validate required fields: id, title (chinese, pinyin, english), sections, copyright
- Validate section codes (V1, V2, C, PC, B, T, E, I, O)
- Each section is an array of slide objects
- Each slide object must have chinese, pinyin, english fields (in that order)

## Acceptance Criteria
- [ ] JSON schema file created (`src/schema/song.schema.json`)
- [ ] Validation script/tool implemented (`./lsc validate`)
- [ ] Error messages are clear and actionable
- [ ] Sample valid song file created for testing

## Notes
- Consider using JSON Schema draft-07 or later
- May want TypeScript types generated from schema
- Order of fields in slide: chinese → pinyin → english (for verification)
