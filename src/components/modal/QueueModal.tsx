"use client";

import { useEffect, useRef } from "react";
import type { VideoItem } from "@/lib/types";
import { formatDuration, formatPtDate } from "@/lib/utils";
import { getThemeFromTags, getThemeLabel } from "@/lib/store/filters";
import { markWatched } from "@/lib/store/watched";
import { ModalShell } from "./ModalShell";
import { QueueList } from "@/components/queue/QueueList";

type QueueModalProps = {
  open: boolean;
  items: VideoItem[];
  activeId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
};

export const QueueModal = ({
  open,
  items,
  activeId,
  onClose,
  onSelect,
}: QueueModalProps) => {
  const index = items.findIndex((item) => item.id === activeId);
  const safeIndex = index >= 0 ? index : 0;
  const item = items[safeIndex];

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open || !item) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      markWatched(item.youtubeId);
    }, 10000);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open, item?.youtubeId]);

  if (!open || !item) {
    return null;
  }

  const canNavigate = items.length > 1;
  const handlePrev = () => {
    if (!canNavigate) {
      return;
    }
    const nextIndex = safeIndex === 0 ? items.length - 1 : safeIndex - 1;
    onSelect(items[nextIndex].id);
  };
  const handleNext = () => {
    if (!canNavigate) {
      return;
    }
    const nextIndex = safeIndex === items.length - 1 ? 0 : safeIndex + 1;
    onSelect(items[nextIndex].id);
  };

  const theme = getThemeFromTags(item.tags);
  const durationLabel = formatDuration(item.durationSec);

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.3em] text-[#b0b0b0]">
            {(theme ? getThemeLabel(theme) : "Tema") +
              " - " +
              formatPtDate(item.publishedAt) +
              (durationLabel ? ` | ${durationLabel}` : "")}
          </div>
          <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
          <p className="text-sm text-[#b0b0b0]">
            {item.summary || item.description}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
              title={item.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-[0.2em] text-[#b0b0b0]">
            Fila selecionada
          </div>
          <QueueList items={items} activeId={activeId} onSelect={onSelect} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[#b0b0b0]">
            Fontes
          </div>
          <div className="flex flex-wrap gap-2">
            {item.sources.length ? (
              item.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white transition hover:border-white/30"
                >
                  {source.name}
                </a>
              ))
            ) : (
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#b0b0b0]">
                Sem fontes disponiveis
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canNavigate}
            className="h-12 rounded-full border border-white/15 px-6 text-xs uppercase tracking-[0.2em] text-white transition disabled:cursor-not-allowed disabled:text-white/30"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNavigate}
            className="h-12 rounded-full border border-white/15 px-6 text-xs uppercase tracking-[0.2em] text-white transition disabled:cursor-not-allowed disabled:text-white/30"
          >
            Proxima
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center rounded-full bg-[#f6c945] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#ff8a00]"
          >
            Abrir no YouTube
          </a>
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-white/15 px-6 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white/40"
          >
            Fechar
          </button>
        </div>
      </div>
    </ModalShell>
  );
};
