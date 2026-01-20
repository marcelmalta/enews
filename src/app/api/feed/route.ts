import { NextResponse } from "next/server";
import { mapYoutubeVideo } from "@/lib/youtube/mapper";

export const revalidate = 60;

type PlaylistItemResponse = {
  items?: { contentDetails?: { videoId?: string } }[];
};

type VideosResponse = {
  items?: {
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
  }[];
};

const fetchJson = async <T,>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      next: { revalidate },
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID;

  if (!apiKey || !playlistId) {
    return NextResponse.json({ items: [] });
  }

  const playlistParams = new URLSearchParams({
    part: "contentDetails",
    maxResults: "50",
    playlistId,
    key: apiKey,
  });

  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?${playlistParams.toString()}`;
  const playlistData = await fetchJson<PlaylistItemResponse>(playlistUrl);
  const videoIds =
    playlistData?.items
      ?.map((item) => item.contentDetails?.videoId)
      .filter((id): id is string => Boolean(id)) ?? [];

  if (!videoIds.length) {
    return NextResponse.json({ items: [] });
  }

  const videosParams = new URLSearchParams({
    part: "contentDetails,snippet",
    id: videoIds.join(","),
    key: apiKey,
  });
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?${videosParams.toString()}`;
  const videosData = await fetchJson<VideosResponse>(videosUrl);

  if (!videosData?.items?.length) {
    return NextResponse.json({ items: [] });
  }

  const items = videosData.items
    .map(mapYoutubeVideo)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

  return NextResponse.json({ items });
}
