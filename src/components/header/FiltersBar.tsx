"use client";

import type { DateFilter, DurationFilter, ThemeFilter } from "@/lib/store/filters";
import { SearchBar } from "./SearchBar";
import { FilterTabs } from "./FilterTabs";

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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.25em] text-[#b0b0b0]">
          Vistos: <span className="text-white">{watchedCount}</span> /{" "}
          <span className="text-white">{totalCount}</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleHideWatched(!hideWatched)}
          aria-pressed={hideWatched}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition ${
            hideWatched
              ? "border-transparent bg-gradient-to-r from-[#f6c945] to-[#ff8a00] text-black"
              : "border-white/10 bg-[#111111] text-[#b0b0b0] hover:text-white"
          }`}
        >
          {hideWatched ? "Mostrar vistos" : "Ocultar vistos"}
        </button>
      </div>
      <FilterTabs
        options={themes}
        value={theme}
        onChange={(value) => onThemeChange(value as ThemeFilter)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
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
      <SearchBar value={search} onChange={onSearchChange} />
    </div>
  );
};
