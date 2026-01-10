import { fetchYouTubeMetadata, searchChineseVersion } from "../lib/youtube.js";
import { parseBilingualLyrics } from "../lib/parser.js";
import { generatePinyin, generatePinyinForTitle } from "../lib/pinyin.js";
import type { Song, Slide } from "../lib/types.js";

function extractSongInfo(title: string): { songTitle: string; artist: string } {
  // Common patterns: "Song Title - Artist", "Artist - Song Title", "Song Title | Artist"
  const separators = [" - ", " | ", " – ", " — "];
  for (const sep of separators) {
    if (title.includes(sep)) {
      const parts = title.split(sep);
      // Assume first part is song title, second is artist (most common)
      return {
        songTitle: parts[0].trim(),
        artist: parts[1]?.trim() || "",
      };
    }
  }
  return { songTitle: title, artist: "" };
}

function extractChineseTitle(title: string): string {
  // Look for Chinese characters in title, but filter out common non-title words
  const chineseMatch = title.match(/[\u4e00-\u9fff]+/g);
  if (!chineseMatch) return "";

  // Filter out common metadata words
  const metadataWords = ["中文", "版", "翻唱", "敬拜", "現場", "詩歌"];
  const filtered = chineseMatch.filter(
    (word) => !metadataWords.includes(word)
  );
  return filtered.join("") || "";
}

function generateSongId(title: string): string {
  // Generate a simple ID from title
  const clean = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return clean.substring(0, 30);
}

export async function importFromYouTube(url: string): Promise<Song> {
  console.error("Fetching YouTube metadata...");
  const metadata = fetchYouTubeMetadata(url);
  const { songTitle, artist } = extractSongInfo(metadata.title);

  console.error(`Song: ${songTitle}`);
  console.error(`Artist: ${artist}`);

  // Check if the provided URL already has Chinese lyrics
  let description = metadata.description;
  let chineseTitle = extractChineseTitle(metadata.title);

  const hasChinese = /[\u4e00-\u9fff]/.test(description);

  if (!hasChinese) {
    console.error("No Chinese lyrics found, searching for Chinese version...");
    const chineseVersion = searchChineseVersion(songTitle, artist);
    if (chineseVersion) {
      console.error(`Found Chinese version: ${chineseVersion.title}`);
      description = chineseVersion.description;
      chineseTitle = extractChineseTitle(chineseVersion.title) || chineseTitle;
    } else {
      console.error("No Chinese version found. Importing English only.");
    }
  }

  // Parse bilingual lyrics
  console.error("Parsing lyrics...");
  const parsedSections = parseBilingualLyrics(description);

  // Convert to song schema with slides
  const sections: Record<string, Slide[]> = {};

  for (const [sectionName, lines] of Object.entries(parsedSections)) {
    sections[sectionName] = lines.map((line) => ({
      chinese: line.chinese,
      pinyin: generatePinyin(line.chinese),
      english: line.english,
    }));
  }

  // Build song object
  const song: Song = {
    id: generateSongId(songTitle),
    title: {
      chinese: chineseTitle,
      pinyin: generatePinyinForTitle(chineseTitle),
      english: songTitle,
    },
    sections,
    copyright: {
      author: artist,
      year: "",
      publisher: "",
      ccli: "",
    },
    sources: [
      {
        type: "youtube",
        url: url,
        description: "Source video",
      },
    ],
  };

  return song;
}
