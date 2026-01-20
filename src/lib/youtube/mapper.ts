import type { VideoItem } from "@/lib/types";
import { parseDurationToSeconds } from "./duration";
import { parseDescription } from "./parser";

type YoutubeVideo = {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      maxres?: { url?: string };
      standard?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
  contentDetails?: {
    duration?: string;
  };
};

const pickThumbnail = (video: YoutubeVideo) => {
  return (
    video.snippet?.thumbnails?.maxres?.url ??
    video.snippet?.thumbnails?.standard?.url ??
    video.snippet?.thumbnails?.high?.url ??
    video.snippet?.thumbnails?.medium?.url ??
    video.snippet?.thumbnails?.default?.url ??
    ""
  );
};

export const mapYoutubeVideo = (video: YoutubeVideo): VideoItem => {
  const description = video.snippet?.description ?? "";
  const parsed = parseDescription(description);

  return {
    id: video.id,
    youtubeId: video.id,
    title: video.snippet?.title ?? "Video",
    publishedAt: video.snippet?.publishedAt ?? new Date().toISOString(),
    durationSec: parseDurationToSeconds(video.contentDetails?.duration ?? ""),
    thumbnail: pickThumbnail(video),
    description,
    summary: parsed.summary,
    sources: parsed.sources,
    tags: parsed.tags,
  };
};
