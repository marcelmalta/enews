"use client";

import type { VideoItem } from "@/lib/types";
import { formatPtDate } from "@/lib/utils";
import { getThemeFromTags, getThemeLabel } from "@/lib/store/filters";

type QueueListProps = {
  items: VideoItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export const QueueList = ({ items, activeId, onSelect }: QueueListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const theme = getThemeFromTags(item.tags);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-transparent bg-gradient-to-r from-[#f6c945]/15 to-[#ff8a00]/15 text-white"
                : "border-white/10 bg-[#111111] text-[#b0b0b0] hover:border-white/20"
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="text-xs uppercase tracking-[0.2em] text-white">
                {theme ? getThemeLabel(theme) : "Tema"}
              </div>
              <div className="text-sm font-medium text-white">{item.title}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#b0b0b0]">
                {formatPtDate(item.publishedAt)}
              </div>
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
              {index + 1}
            </div>
          </button>
        );
      })}
    </div>
  );
};
