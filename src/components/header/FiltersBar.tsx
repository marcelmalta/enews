"use client";

import { useState } from "react";
import type { DateFilter, DurationFilter, ThemeFilter } from "@/lib/store/filters";
import { SearchBar } from "./SearchBar";
import { FilterTabs } from "./FilterTabs";
import { ModalShell } from "@/components/modal/ModalShell";

type FilterOption = {
  id: string;
  label: string;
};

type FiltersBarProps = {
  themes: FilterOption[];
  dateFilters: FilterOption[];
  durationFilters: FilterOption[];
  theme: ThemeFilter;
  dateFilter: DateFilter;
  durationFilter: DurationFilter;
  hideWatched: boolean;
  watchedCount: number;
  totalCount: number;
  onThemeChange: (theme: ThemeFilter) => void;
  onDateChange: (value: DateFilter) => void;
  onDurationChange: (value: DurationFilter) => void;
  onToggleHideWatched: (value: boolean) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export const FiltersBar = ({
  themes,
  dateFilters,
  durationFilters,
  theme,
  dateFilter,
  durationFilter,
  hideWatched,
  watchedCount,
  totalCount,
  onThemeChange,
  onDateChange,
  onDurationChange,
  onToggleHideWatched,
  search,
  onSearchChange,
}: FiltersBarProps) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#b0b0b0] sm:text-xs">
          Vistos: <span className="text-white">{watchedCount}</span> /{" "}
          <span className="text-white">{totalCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleHideWatched(!hideWatched)}
            aria-pressed={hideWatched}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition sm:px-4 sm:py-2 sm:text-[11px] ${
              hideWatched
                ? "border-transparent bg-gradient-to-r from-[#f6c945] to-[#ff8a00] text-black"
                : "border-white/10 bg-[#111111] text-[#b0b0b0] hover:text-white"
            }`}
          >
            {hideWatched ? "Mostrar vistos" : "Ocultar vistos"}
          </button>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111111] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#b0b0b0] transition hover:text-white sm:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M7 12h10M10 18h4" />
            </svg>
            Filtros
          </button>
        </div>
      </div>
      <FilterTabs
        options={themes}
        value={theme}
        onChange={(value) => onThemeChange(value as ThemeFilter)}
      />
      <div className="hidden grid gap-3 sm:grid sm:grid-cols-2">
        <FilterTabs
          options={dateFilters}
          value={dateFilter}
          onChange={(value) => onDateChange(value as DateFilter)}
        />
        <FilterTabs
          options={durationFilters}
          value={durationFilter}
          onChange={(value) => onDurationChange(value as DurationFilter)}
        />
      </div>
      <div className="hidden sm:block">
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
      <ModalShell open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.25em] text-[#b0b0b0]">
              Filtros
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#b0b0b0] transition hover:text-white"
            >
              Fechar
            </button>
          </div>
          <SearchBar value={search} onChange={onSearchChange} />
          <div className="flex flex-col gap-3">
            <FilterTabs
              options={dateFilters}
              value={dateFilter}
              onChange={(value) => onDateChange(value as DateFilter)}
            />
            <FilterTabs
              options={durationFilters}
              value={durationFilter}
              onChange={(value) => onDurationChange(value as DurationFilter)}
            />
          </div>
        </div>
      </ModalShell>
    </div>
  );
};
