"use client";

import type { VideoItem } from "@/lib/types";
import { NewsCard } from "./NewsCard";

type NewsGridProps = {
  items: VideoItem[];
  queuedIds: string[];
  watchedMap: Record<string, number>;
  onOpen: (id: string) => void;
  onToggleQueue: (id: string) => void;
};

export const NewsGrid = ({
  items,
  queuedIds,
  watchedMap,
  onOpen,
  onToggleQueue,
}: NewsGridProps) => {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <NewsCard
          key={item.id}
          item={item}
          queued={queuedIds.includes(item.id)}
          watched={Boolean(watchedMap[item.youtubeId])}
          onOpen={onOpen}
          onToggleQueue={onToggleQueue}
        />
      ))}
    </section>
  );
};
