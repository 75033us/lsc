# LSC Worship Song Lyrics Library

A structured library for managing worship song lyrics with Chinese, English, and Pinyin support.

## Features

- **Multi-language lyrics**: Each song contains Chinese, English, and Pinyin versions
- **Unique song identification**: Every song has a unique ID for easy reference
- **Copyright tracking**: Full copyright and source attribution for each song
- **Worship history**: Track when songs were used in services
- **Slide generation**: Query songs and generate slides in custom order

## Song Library Structure

### Song Storage Format

Songs are stored as individual JSON files in the `songs/` directory.

```
songs/
├── song_001.json
├── song_002.json
└── ...
```

### Song Schema

Each section contains an array of slides. Each slide is a self-contained unit with all three languages together (Chinese, Pinyin, English - in that order for easy verification).

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
    "V2": [ ... ],
    "C": [ ... ],
    "B": [ ... ]
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
    },
    {
      "type": "website",
      "url": "https://example.com/lyrics",
      "description": "Original lyrics source"
    }
  ]
}
```

### Section Types

| Code | Description |
|------|-------------|
| V1, V2, V3... | Verse 1, 2, 3, etc. |
| C | Chorus |
| PC | Pre-Chorus |
| B | Bridge |
| T | Tag |
| E | Ending |
| I | Intro |
| O | Outro |

## Worship History

Worship history is stored in the `worship/` directory, with one JSON file per service date (e.g., `2026-01-11.json`).

```
worship/
├── 2026-01-05.json
├── 2026-01-12.json
└── ...
```

Each worship file contains the song list with sequences:

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

## Slide Generation

### Input Format

The worship team provides a song list with custom section ordering:

```
song_001, V1 V2 C V3 C C
song_015, V1 C V2 C B C E
song_023, I V1 V2 C B C T
```

### Output Format

The system generates a JSON array of slides. Each slide has a `template` type and content with font sizes:

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
    "content": "V2"
  },
  {
    "template": "verse",
    "content": { ... }
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

## Directory Structure

```
lsc/
├── README.md
├── CLAUDE.md           # Developer notes
├── songs/              # Song JSON files
│   ├── song_001.json
│   └── ...
├── worship/            # Worship history (one file per date)
│   ├── 2026-01-05.json
│   └── ...
├── templates/          # PPTX templates for slide generation
│   ├── lsc.pptx
│   └── ...
├── dev/                # Development tasks
│   ├── task_001.md
│   └── ...
└── src/                # Source code (future)
    └── ...
```

## Usage (Planned)

```bash
# Generate slides from a worship file using a PPTX template
./lsc generate --template templates/lsc.pptx --worship worship/2026-01-05.json > 2026-01-05.pptx

# Full-text fuzzy search across all song fields
./lsc search "Amazing Grace"

# List all songs
./lsc list

# Query worship history for a song (outputs dates when song was used)
./lsc history song_001

# Import a song from URL (extracts lyrics from YouTube description, etc.)
./lsc import "https://youtube.com/watch?v=..." > songs/song_001.json
```

## Prerequisites

- **Node.js** >= 18
- **yt-dlp** - Required for YouTube metadata fetching
  ```bash
  # macOS
  brew install yt-dlp

  # or with pip
  pip install yt-dlp
  ```

## Contributing

1. Add new songs to the `songs/` directory following the JSON schema
2. Update worship history after each service
3. Ensure copyright information is accurate and complete

## License

This library is for internal LSC worship team use. Individual song copyrights belong to their respective owners.
