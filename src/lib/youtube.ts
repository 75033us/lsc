import { execSync } from "child_process";
import type { YouTubeMetadata } from "./types.js";

export function fetchYouTubeMetadata(url: string): YouTubeMetadata {
  try {
    const result = execSync(
      `yt-dlp --skip-download --print "%(title)s|||%(description)s" "${url}"`,
      { encoding: "utf-8", timeout: 30000 }
    );

    const [title, ...descParts] = result.split("|||");
    const description = descParts.join("|||").trim();

    return {
      title: title.trim(),
      description,
      url,
    };
  } catch (error) {
    throw new Error(`Failed to fetch YouTube metadata: ${error}`);
  }
}

export function searchYouTube(query: string): YouTubeMetadata[] {
  try {
    const result = execSync(
      `yt-dlp --skip-download --flat-playlist --print "%(title)s|||%(url)s|||%(description)s" "ytsearch5:${query}"`,
      { encoding: "utf-8", timeout: 60000 }
    );

    const lines = result.trim().split("\n").filter(Boolean);
    return lines.map((line) => {
      const [title, url, description] = line.split("|||");
      return {
        title: title?.trim() || "",
        url: url?.trim() || "",
        description: description?.trim() || "",
      };
    });
  } catch (error) {
    throw new Error(`Failed to search YouTube: ${error}`);
  }
}

export function searchChineseVersion(songTitle: string, artist: string): YouTubeMetadata | null {
  // Clean song title for search (remove parentheses and special chars)
  const cleanTitle = songTitle.replace(/[()[\]]/g, "").trim();

  // Search with more specific queries - include song title in results filter
  const queries = [
    `${cleanTitle} ${artist} 中文`,
    `${cleanTitle} 中文 worship cover`,
    `${cleanTitle} Chinese translation`,
  ];

  // Extract core song name (first word or phrase before special chars)
  const coreTitle = cleanTitle.split(/\s+/)[0].toLowerCase();

  for (const query of queries) {
    try {
      const results = searchYouTube(query);

      // Filter results that contain the core song title and have Chinese content
      const chineseResult = results.find((r) => {
        const titleLower = r.title.toLowerCase();
        // Must contain the core song title (e.g., "gratitude")
        const matchesSongTitle = titleLower.includes(coreTitle);
        // Must have Chinese in title or description
        const hasChinese =
          /[\u4e00-\u9fff]/.test(r.title) || /[\u4e00-\u9fff]/.test(r.description);
        return matchesSongTitle && hasChinese;
      });

      if (chineseResult) {
        // Fetch full metadata
        return fetchYouTubeMetadata(chineseResult.url);
      }
    } catch {
      continue;
    }
  }
  return null;
}
