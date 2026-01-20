export type SourceItem = {
  name: string;
  url: string;
};

export type VideoItem = {
  id: string;
  youtubeId: string;
  title: string;
  publishedAt: string;
  durationSec: number;
  thumbnail: string;
  description: string;
  summary: string;
  sources: SourceItem[];
  tags: string[];
};
