"use client";

import type { VideoItem } from "@/lib/types";
import { ShortsCard } from "./ShortsCard";

type ShortsCarouselProps = {
  items: VideoItem[];
  queuedIds: string[];
  watchedMap: Record<string, number>;
  onOpen: (id: string) => void;
  onToggleQueue: (id: string) => void;
};

export const ShortsCarousel = ({
  items,
  queuedIds,
  watchedMap,
  onOpen,
  onToggleQueue,
}: ShortsCarouselProps) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Shorts recentes</h2>
        <span className="text-xs uppercase tracking-[0.25em] text-[#b0b0b0]">
          {items.length} videos
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <ShortsCard
            key={item.id}
            item={item}
            queued={queuedIds.includes(item.id)}
            watched={Boolean(watchedMap[item.youtubeId])}
            onOpen={onOpen}
            onToggleQueue={onToggleQueue}
          />
        ))}
      </div>
    </section>
  );
};
