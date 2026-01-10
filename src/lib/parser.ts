import type { ParsedLyrics, Slide } from "./types.js";

// Section marker patterns
const SECTION_PATTERNS: Record<string, RegExp> = {
  V1: /^\[?(?:V1|Verse\s*1|第一段)\]?$/i,
  V2: /^\[?(?:V2|Verse\s*2|第二段)\]?$/i,
  V3: /^\[?(?:V3|Verse\s*3|第三段)\]?$/i,
  V4: /^\[?(?:V4|Verse\s*4|第四段)\]?$/i,
  C: /^\[?(?:C|CH|Chorus|副歌)\]?$/i,
  PC: /^\[?(?:PC|Pre-?Chorus|導歌)\]?$/i,
  B: /^\[?(?:B|BGD|Bridge|橋段)\]?$/i,
  T: /^\[?(?:T|Tag|尾聲)\]?$/i,
  E: /^\[?(?:E|End|Ending|結尾)\]?$/i,
  I: /^\[?(?:I|Intro|前奏)\]?$/i,
  O: /^\[?(?:O|Outro|尾奏)\]?$/i,
};

function detectSection(line: string): string | null {
  const trimmed = line.trim();
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(trimmed)) {
      return section;
    }
  }
  // Also check for bracketed markers like [V1], [CH], etc.
  const bracketMatch = trimmed.match(/^\[([A-Za-z0-9]+)\]$/);
  if (bracketMatch) {
    const marker = bracketMatch[1].toUpperCase();
    if (marker.startsWith("V")) return marker;
    if (marker === "CH" || marker === "CHORUS") return "C";
    if (marker === "BGD" || marker === "BRIDGE") return "B";
    return marker;
  }
  return null;
}

function isChineseLine(line: string): boolean {
  return /[\u4e00-\u9fff]/.test(line);
}

function isEnglishLine(line: string): boolean {
  return /^[A-Za-z]/.test(line.trim()) && !/[\u4e00-\u9fff]/.test(line);
}

export function parseLyrics(description: string): ParsedLyrics {
  const lines = description.split("\n");
  const sections: Record<string, string[]> = {};
  let currentSection = "V1";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const section = detectSection(trimmed);
    if (section) {
      // Save previous section if it has content
      if (currentLines.length > 0) {
        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        sections[currentSection].push(...currentLines);
        currentLines = [];
      }
      currentSection = section;
      continue;
    }

    // Skip non-lyric lines (URLs, hashtags, metadata)
    if (
      trimmed.startsWith("http") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("▸") ||
      trimmed.includes("@") ||
      trimmed.includes("訂閱") ||
      trimmed.includes("Subscribe")
    ) {
      continue;
    }

    // Add lyric line
    currentLines.push(trimmed);
  }

  // Save last section
  if (currentLines.length > 0) {
    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }
    sections[currentSection].push(...currentLines);
  }

  return { sections, raw: description };
}

export interface BilingualLine {
  chinese: string;
  english: string;
}

function isMetadataLine(line: string): boolean {
  const metadataPatterns = [
    /^http/i,
    /^#/,
    /^▸/,
    /@/,
    /訂閱|Subscribe/i,
    /詞曲|中譯|主領|演奏|翻譯/,
    /Keys?\s*:|Bass\s*:|Vocals?\s*:|Mixing\s*:|EG\s*:|AG\s*:/i,
    /Special Thanks/i,
    /cover|version/i,
    /Bethel Music|Brandon Lake/i,
    /By\s+\w+\s*&/i,
    /^[-=_]{3,}$/, // Separator lines like "---" or "==="
  ];
  return metadataPatterns.some((pattern) => pattern.test(line));
}

function splitBilingualLine(line: string): BilingualLine | null {
  // Pattern: Chinese text followed by English text on same line
  // Example: "言語已不夠  All my words fall short"
  const match = line.match(/^([\u4e00-\u9fff\s，。！？、：；""'']+)\s{2,}(.+)$/);
  if (match) {
    return {
      chinese: match[1].trim(),
      english: match[2].trim(),
    };
  }

  // Pattern: Chinese only
  if (/^[\u4e00-\u9fff\s，。！？、：；""''Oh]+$/i.test(line)) {
    return { chinese: line.trim(), english: "" };
  }

  // Pattern: English only
  if (/^[A-Za-z\s',\-!?.()]+$/.test(line)) {
    return { chinese: "", english: line.trim() };
  }

  return null;
}

export function parseBilingualLyrics(description: string): Record<string, BilingualLine[]> {
  const lines = description.split("\n");
  const sections: Record<string, BilingualLine[]> = {};
  let currentSection = "V1";
  let currentPairs: BilingualLine[] = [];
  let pendingChinese: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const section = detectSection(trimmed);
    if (section) {
      // Save previous section
      if (currentPairs.length > 0) {
        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        sections[currentSection].push(...currentPairs);
        currentPairs = [];
      }
      currentSection = section;
      pendingChinese = null;
      continue;
    }

    // Skip metadata lines
    if (isMetadataLine(trimmed)) {
      continue;
    }

    // Try to split bilingual line (Chinese + English on same line)
    const bilingual = splitBilingualLine(trimmed);
    if (bilingual) {
      if (bilingual.chinese && bilingual.english) {
        // Complete pair on one line
        currentPairs.push(bilingual);
        pendingChinese = null;
      } else if (bilingual.chinese) {
        // Chinese only - might pair with next English line
        if (pendingChinese) {
          currentPairs.push({ chinese: pendingChinese, english: "" });
        }
        pendingChinese = bilingual.chinese;
      } else if (bilingual.english && pendingChinese) {
        // English that pairs with pending Chinese
        currentPairs.push({ chinese: pendingChinese, english: bilingual.english });
        pendingChinese = null;
      } else if (bilingual.english) {
        // English only
        currentPairs.push({ chinese: "", english: bilingual.english });
      }
    }
  }

  // Handle any remaining pending Chinese
  if (pendingChinese) {
    currentPairs.push({ chinese: pendingChinese, english: "" });
  }

  // Save last section
  if (currentPairs.length > 0) {
    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }
    sections[currentSection].push(...currentPairs);
  }

  return sections;
}

export function autoDetectSections(lyrics: string[]): Record<string, string[]> {
  // Simple auto-detection based on repetition
  const sections: Record<string, string[]> = {};
  const lineFrequency = new Map<string, number>();

  // Count line frequencies
  for (const line of lyrics) {
    const normalized = line.toLowerCase().trim();
    lineFrequency.set(normalized, (lineFrequency.get(normalized) || 0) + 1);
  }

  // Find repeated sections (likely chorus)
  const repeatedLines = new Set(
    [...lineFrequency.entries()]
      .filter(([, count]) => count > 1)
      .map(([line]) => line)
  );

  let currentSection = "V1";
  let verseCount = 1;
  let inChorus = false;
  let currentLines: string[] = [];

  for (const line of lyrics) {
    const normalized = line.toLowerCase().trim();
    const isRepeated = repeatedLines.has(normalized);

    if (isRepeated && !inChorus) {
      // Entering chorus
      if (currentLines.length > 0) {
        sections[currentSection] = currentLines;
        currentLines = [];
      }
      inChorus = true;
      currentSection = "C";
    } else if (!isRepeated && inChorus) {
      // Leaving chorus
      if (currentLines.length > 0) {
        sections[currentSection] = currentLines;
        currentLines = [];
      }
      inChorus = false;
      verseCount++;
      currentSection = `V${verseCount}`;
    }

    currentLines.push(line);
  }

  // Save last section
  if (currentLines.length > 0) {
    sections[currentSection] = currentLines;
  }

  return sections;
}
