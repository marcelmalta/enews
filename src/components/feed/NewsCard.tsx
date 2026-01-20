"use client";

import type { VideoItem } from "@/lib/types";
import { getThemeFromTags, getThemeLabel } from "@/lib/store/filters";
import { formatPtDate } from "@/lib/utils";
import { QueueButton } from "@/components/queue/QueueButton";

type NewsCardProps = {
  item: VideoItem;
  queued: boolean;
  watched: boolean;
  onOpen: (id: string) => void;
  onToggleQueue: (id: string) => void;
};

export const NewsCard = ({
  item,
  queued,
  watched,
  onOpen,
  onToggleQueue,
}: NewsCardProps) => {
  const thumb =
    item.thumbnail || `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
  const theme = getThemeFromTags(item.tags);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(item.id);
        }
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#121212] transition hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] focus:outline-none ${
        watched
          ? "border-white/5 opacity-80"
          : "border-white/5 hover:border-white/15"
      }`}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black/40 sm:aspect-square">
        <img
          src={thumb}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
          <span className="hidden rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white sm:inline-flex">
            {theme ? getThemeLabel(theme) : "Tema"}
          </span>
        </div>
        <div className="absolute right-2 top-2 flex flex-col items-end gap-2 sm:right-3 sm:top-3">
          {watched ? (
            <span className="rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white sm:px-3 sm:py-1 sm:text-[11px]">
              ✓ Visto
            </span>
          ) : null}
          <QueueButton
            queued={queued}
            onToggle={() => onToggleQueue(item.id)}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4">
        <div className="text-xs font-medium text-white line-clamp-2 sm:text-sm sm:line-clamp-none">
          {item.title}
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#b0b0b0] sm:text-xs">
          {formatPtDate(item.publishedAt)}
        </div>
      </div>
    </article>
  );
};
