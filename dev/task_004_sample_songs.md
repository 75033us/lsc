# Task 004: Create Sample Song Files

## Status: Pending

## Description
Create initial sample song JSON files to test the system and serve as templates.

## Song Schema Structure

Each slide is a self-contained unit with chinese → pinyin → english:

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
      },
      {
        "chinese": "我罪已得赦免",
        "pinyin": "Wǒ zuì yǐ dé shèmiǎn",
        "english": "That saved a wretch like me"
      }
    ],
    "C": [ ... ]
  },
  "copyright": {
    "author": "John Newton",
    "year": "1779",
    "publisher": "Public Domain",
    "ccli": "1234567"
  },
  "sources": [
    {
      "type": "youtube",
      "url": "https://youtube.com/watch?v=...",
      "description": "Official music video"
    }
  ]
}
```

## Requirements
- Create 3-5 sample songs with complete data
- Include variety of section types (V1, V2, C, PC, B, T, E)
- Ensure copyright info is accurate
- Include real source URLs where available

## Sample Songs to Create
1. A well-known English hymn (e.g., Amazing Grace - Public Domain)
2. A contemporary worship song
3. A Chinese-origin worship song
4. A song with complex structure (multiple bridges, tags)

## Acceptance Criteria
- [ ] At least 3 complete song files created in `songs/`
- [ ] All files pass schema validation
- [ ] Each song has at least 2 verses and 1 chorus
- [ ] Copyright information included
- [ ] Pinyin includes tone marks

## Notes
- Use public domain songs where possible to avoid copyright issues in samples
- Field order in slides: chinese → pinyin → english (for easy verification)
