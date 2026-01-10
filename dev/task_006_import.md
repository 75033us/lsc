# Task 006: URL Import

## Status: Pending

## Description
Import song lyrics from a URL (typically YouTube) by extracting lyrics from the video description or other metadata.

## Command
```bash
./lsc import "https://youtube.com/watch?v=..." > songs/song_001.json
```

## Input
- YouTube URL or other supported URL
- Lyrics are typically found in video description

## Output
Song JSON file following the schema:

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
  "copyright": {
    "author": "",
    "year": "",
    "publisher": "",
    "ccli": ""
  },
  "sources": [
    {
      "type": "youtube",
      "url": "https://youtube.com/watch?v=...",
      "description": "Source video"
    }
  ]
}
```

## Requirements
- Fetch YouTube video metadata (title, description)
- Parse lyrics from video description
- Detect section markers (V1, V2, C, B, etc.) in lyrics
- Split lyrics into slides (one line per slide)
- Extract/generate pinyin from Chinese text
- Populate source URL automatically
- Output valid song JSON to stdout

## Parsing Logic
1. Fetch video description
2. Look for lyrics section (often marked with "歌詞", "Lyrics", or similar)
3. Identify section headers: `[V1]`, `[Verse 1]`, `[Chorus]`, `[Bridge]`, etc.
4. Parse Chinese and English lines (often alternating or in blocks)
5. Generate pinyin for Chinese lines (may need external library)
6. Structure into song JSON schema

## Acceptance Criteria
- [ ] Fetch YouTube video metadata
- [ ] Parse lyrics from description
- [ ] Detect and map section markers
- [ ] Split into slide-sized units
- [ ] Generate pinyin from Chinese (with tone marks)
- [ ] Output valid song JSON
- [ ] Include source URL in output
- [ ] Handle various lyrics formats gracefully

## Notes
- May need YouTube Data API or yt-dlp for fetching
- Pinyin generation: consider pypinyin or similar library
- Manual review/editing likely needed after import
- Could support other sources in future (e.g., lyrics websites)
- Consider interactive mode for ambiguous parsing
