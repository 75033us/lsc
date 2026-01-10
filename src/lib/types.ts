export interface Slide {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface SongTitle {
  chinese: string;
  pinyin: string;
  english: string;
}

export interface Copyright {
  author: string;
  year: string;
  publisher: string;
  ccli: string;
}

export interface Source {
  type: "youtube" | "website" | "other";
  url: string;
  description: string;
}

export interface Song {
  id: string;
  title: SongTitle;
  sections: Record<string, Slide[]>;
  copyright: Copyright;
  sources: Source[];
}

export interface YouTubeMetadata {
  title: string;
  description: string;
  url: string;
}

export interface ParsedLyrics {
  sections: Record<string, string[]>;
  raw: string;
}
