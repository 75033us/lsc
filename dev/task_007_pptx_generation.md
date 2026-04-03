# Task 007: PPTX Slide Generation

## Status: In Progress

## Description
Implement complete PPTX worship slide generation system supporting both YouTube URL import and manual bilingual lyrics input. The system will generate PowerPoint presentations from worship service playlists with trilingual content (Chinese, Pinyin, English).

## User Requirements
1. **Input formats**: Support both YouTube URLs (existing) and manual bilingual text with section markers
2. **Song list**: JSON worship files with song IDs and music order sequences (e.g., "V1 C V2 C B C")
3. **Template**: Custom PPTX template support with configurable styling
4. **Lyrics format**: Plain text with Chinese/English and section markers [V1], [C], [B], [T]
5. **Music order acronyms**: C (Chorus), B (Bridge), V1/V2/V3 (Verses), T (Tag), PC (Pre-Chorus), E (Ending), I (Intro), O (Outro)

## Architecture Decision

**Selected PPTX Library**: `pptxgenjs`

**Rationale**:
- Native Node.js/TypeScript (no Python interop needed)
- Template support and full formatting control
- Active maintenance, 8k+ GitHub stars
- TypeScript type definitions available (`@types/pptxgenjs`)

## Implementation Phases

### Phase 0: Documentation ✓
- [x] Create this task file (dev/task_007_pptx_generation.md)

### Phase 1: Foundation & Dependencies

**Task 1.1**: Install PPTX library
- File: `package.json`
- Command: `npm install pptxgenjs @types/pptxgenjs`

**Task 1.2**: Extend TypeScript types
- File: `src/lib/types.ts`
- Add interfaces:
  - `WorshipEntry` - Worship file song entry (name, sequence)
  - `SlideOutput` - Output slide structure (template, content)
  - `TitleContent` - Section title slide content
  - `VerseContent` - Trilingual verse slide content
  - `TemplateConfig` - Template configuration structure
  - `LayoutConfig` - Layout-specific configuration
  - `VerseLayoutConfig` - Verse layout with trilingual text styles
  - `TextStyle` - Text positioning and styling

**Task 1.3**: Create directory structure
- Create: `templates/` directory for PPTX template configs
- Create: `worship/` directory for worship service playlists

**Task 1.4**: Create default template config
- File: `templates/lsc-config.json`
- Define default slide layouts with font sizes:
  - Chinese: 88pt
  - Pinyin: 54pt
  - English: 40pt

### Phase 2: Manual Lyrics Import

**Task 2.1**: Create import-text command
- File: `src/commands/import-text.ts`
- Functionality:
  - Read plain text file with section markers ([V1], [C], [B], [T], etc.)
  - Reuse existing `parseBilingualLyrics()` from parser.ts
  - Reuse existing `generatePinyin()` for Chinese text
  - Generate Song JSON matching existing schema
  - Output to stdout for redirection to songs/ directory

**Input format example**:
```
[V1]
奇異恩典，何等甘甜  Amazing grace, how sweet the sound
我罪已得赦免  That saved a wretch like me

[C]
哈利路亞  Hallelujah
讚美主名  Praise His name
```

**Task 2.2**: Update CLI router
- File: `src/cli.ts`
- Add `import-text` command with options:
  - `<file>` - Input text file (required)
  - `--id <id>` - Song ID (required)
  - `--title-chinese <title>` - Chinese title (optional)
  - `--title-english <title>` - English title (optional)
  - `--author <author>` - Copyright author (optional)

### Phase 3: Worship File Processing

**Task 3.1**: Create worship file parser
- File: `src/lib/worship.ts`
- Functions:
  - `loadWorshipFile(path: string): WorshipEntry[]` - Parse worship JSON
  - `parseSequence(sequence: string): string[]` - Split "V1 C V2 C" → ["V1", "C", "V2", "C"]
  - `validateSequence(song: Song, sequence: string[]): void` - Check sections exist

**Worship file format**:
```json
[
  {
    "name": "song-0001-gratitude",
    "sequence": "V1 C V2 C"
  },
  {
    "name": "song-0002-amazing-grace",
    "sequence": "V1 V2 C"
  }
]
```

**Task 3.2**: Create slide builder
- File: `src/lib/slide-builder.ts`
- Functions:
  - `buildSlides(worshipEntries: WorshipEntry[], songsDir: string): SlideOutput[]`
    - For each worship entry, load song JSON from songs/{name}.json
    - For each section in sequence:
      - Generate title slide with section code (V1, C, B, etc.)
      - Generate verse slides from song.sections[code]
    - Return flat array of SlideOutput
  - `generateTitleSlide(sectionCode: string): SlideOutput`
  - `generateVerseSlide(slide: Slide): SlideOutput` - Convert Slide to VerseContent with font sizes

### Phase 4: PPTX Generation

**Task 4.1**: Create template loader
- File: `src/lib/template-loader.ts`
- Functions:
  - `loadTemplateConfig(configPath?: string): TemplateConfig` - Load JSON config or use defaults
  - `getDefaultConfig(): TemplateConfig` - Hardcoded fallback config

**Task 4.2**: Create PPTX generator
- File: `src/lib/pptx-generator.ts`
- Functions:
  - `generatePPTX(slides: SlideOutput[], config: TemplateConfig): PptxGenJS`
    - Create new presentation
    - Set slide size from config
    - For each SlideOutput, call appropriate add function
    - Return PptxGenJS instance
  - `addTitleSlide(pptx: PptxGenJS, content: TitleContent, config: TemplateConfig): void`
    - Add slide with title layout
    - Apply background color
    - Add centered text
  - `addVerseSlide(pptx: PptxGenJS, content: VerseContent, config: TemplateConfig): void`
    - Add slide with verse layout
    - Apply background
    - Add Chinese text (88pt, top)
    - Add Pinyin text (54pt, middle)
    - Add English text (40pt, bottom)

**Template approach**: Fixed positioning with config file
- More reliable and easier to debug than placeholder replacement
- Template config defines exact x/y coordinates and styling
- Can optionally load base PPTX template for backgrounds/themes

### Phase 5: CLI Integration

**Task 5.1**: Implement generate command
- File: `src/commands/generate.ts`
- Functionality:
  - Parse command options (--worship, --template, --output, --json)
  - Load worship file using worship.ts
  - Build slides using slide-builder.ts
  - Load template config using template-loader.ts
  - Generate PPTX using pptx-generator.ts
  - Write to file or stdout

**Task 5.2**: Update generate command in CLI
- File: `src/cli.ts`
- Replace stub with real implementation
- Add options:
  - `--worship <path>` - Path to worship JSON file (required)
  - `--template <path>` - Path to template config JSON (optional)
  - `-o, --output <path>` - Output PPTX file path (optional)
  - `--json` - Output slide JSON instead of PPTX (for debugging)

**Example commands**:
```bash
# Generate PPTX with default template
./lsc generate --worship worship/2026-03-11.json -o service.pptx

# Generate with custom template config
./lsc generate --worship worship/2026-03-11.json --template templates/christmas-config.json -o christmas.pptx

# Output JSON for debugging
./lsc generate --worship worship/2026-03-11.json --json > debug.json
```

### Phase 6: Sample Files & Testing

**Task 6.1**: Create sample worship file
- File: `worship/2026-03-11.json`
- Content: Reference existing song-0001-gratitude.json
  ```json
  [
    {
      "name": "song-0001-gratitude",
      "sequence": "V1 C V2 C"
    }
  ]
  ```

**Task 6.2**: Create default template config
- File: `templates/lsc-config.json`
- Define default styling matching task_002 specs

**Task 6.3**: Create sample manual lyrics
- File: `dev/sample-manual-lyrics.txt`
- Example bilingual text for testing import-text command

**Task 6.4**: Update README
- File: `README.md`
- Add:
  - Manual import instructions
  - Generate command usage
  - Template customization guide
  - Worship file format

## Data Flow Pipeline

```
Worship File (worship/2026-03-11.json)
  ↓
Parse worship entries (worship.ts)
  ↓
For each entry:
  Load song JSON (songs/song-0001-gratitude.json)
  Parse sequence string → ["V1", "C", "V2", "C"]
  ↓
Build SlideOutput array (slide-builder.ts)
  [title slide "V1"] → [verse slides] → [title slide "C"] → [verse slides] → ...
  ↓
Load template config (template-loader.ts)
  templates/lsc-config.json → TemplateConfig
  ↓
Generate PPTX (pptx-generator.ts)
  Apply styling, add slides
  ↓
Output PPTX file or JSON
```

## Critical Files

### New Files (Create)
1. `src/lib/worship.ts` - Worship file parsing
2. `src/lib/slide-builder.ts` - Slide generation logic
3. `src/lib/pptx-generator.ts` - PPTX creation with PptxGenJS
4. `src/lib/template-loader.ts` - Template config loading
5. `src/commands/generate.ts` - Generate command implementation
6. `src/commands/import-text.ts` - Manual text import
7. `templates/lsc-config.json` - Default template config
8. `worship/2026-03-11.json` - Sample worship file
9. `dev/sample-manual-lyrics.txt` - Sample manual lyrics

### Existing Files (Modify)
1. `src/lib/types.ts` - Add new interfaces
2. `src/cli.ts` - Update generate command, add import-text
3. `package.json` - Add pptxgenjs dependency
4. `README.md` - Update documentation

### Reusable Files (No Changes)
1. `src/lib/parser.ts` - parseBilingualLyrics() already supports section markers
2. `src/lib/pinyin.ts` - generatePinyin() for auto-pinyin generation
3. `songs/song-0001-gratitude.json` - Example song data

## Acceptance Criteria

- [ ] pptxgenjs library installed and configured
- [ ] TypeScript types extended with new interfaces
- [ ] Template config system working (load JSON or use defaults)
- [ ] Manual lyrics import command functional (import-text)
- [ ] Worship file parser loading and validating worship JSONs
- [ ] Slide builder generating correct SlideOutput array
- [ ] PPTX generator creating valid PowerPoint files
- [ ] Generate command working with all options
- [ ] Sample files created for testing
- [ ] Documentation updated in README
- [ ] Can generate PPTX from existing song-0001-gratitude.json
- [ ] Can import manual lyrics and generate PPTX
- [ ] Can customize template config for different styling

## Testing Plan

1. Install dependencies and verify no errors
2. Test import-text with sample manual lyrics
3. Create worship file with existing song-0001-gratitude
4. Generate PPTX with default template
5. Verify PPTX opens in PowerPoint
6. Check slide content (Chinese, Pinyin, English all present with correct fonts)
7. Test with custom template config
8. Test edge cases (missing sections, empty sequences)

## Next Steps After Implementation

1. Test with existing song-0001-gratitude.json
2. Import additional songs via YouTube or manual text
3. Create worship files for actual services
4. Customize template config for church branding
5. Optionally create base PPTX template with backgrounds
6. Consider adding song title slides (optional enhancement)

## Notes

- Reuse existing parser infrastructure (parseBilingualLyrics, generatePinyin)
- Section markers already supported: V1-V4, C, PC, B, T, E, I, O
- Font sizes from task_002 spec: Chinese 88pt, Pinyin 54pt, English 40pt
- Template approach uses fixed positioning (not placeholder replacement)
- JSON output mode useful for debugging slide structure
