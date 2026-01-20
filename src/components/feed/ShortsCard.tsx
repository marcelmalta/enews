"use client";

import type { VideoItem } from "@/lib/types";
import { getThemeFromTags, getThemeLabel } from "@/lib/store/filters";
import { formatPtDate } from "@/lib/utils";
import { QueueButton } from "@/components/queue/QueueButton";

type ShortsCardProps = {
  item: VideoItem;
  queued: boolean;
  watched: boolean;
  onOpen: (id: string) => void;
  onToggleQueue: (id: string) => void;
};

export const ShortsCard = ({
  item,
  queued,
  watched,
  onOpen,
  onToggleQueue,
}: ShortsCardProps) => {
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
      className={`group relative flex h-[300px] w-[180px] flex-shrink-0 flex-col overflow-hidden rounded-3xl border bg-[#111111] transition hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] focus:outline-none sm:h-[360px] sm:w-[220px] ${
        watched
          ? "border-white/5 opacity-80"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="relative flex h-full w-full items-end overflow-hidden">
        <img
          src={thumb}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="relative z-10 flex w-full flex-col gap-2 px-3 pb-3 sm:gap-3 sm:px-4 sm:pb-4">
          <span className="hidden w-fit rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white sm:inline-flex">
            {theme ? getThemeLabel(theme) : "Tema"}
          </span>
          <div className="text-xs font-semibold text-white line-clamp-2 sm:text-sm sm:line-clamp-3">
            {item.title}
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#b0b0b0] sm:text-[11px]">
            {formatPtDate(item.publishedAt)}
          </div>
        </div>
        <div className="absolute right-2 top-2 z-10 flex flex-col items-end gap-2 sm:right-3 sm:top-3">
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
    </article>
  );
};
