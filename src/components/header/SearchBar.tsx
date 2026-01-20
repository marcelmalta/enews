"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-[#111111] px-3 py-2 text-xs text-[#b0b0b0] sm:px-4 sm:py-3 sm:text-sm">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white sm:text-xs">
        Buscar
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Titulo ou tags"
        className="w-full bg-transparent text-xs text-white placeholder:text-[#6b6b6b] focus:outline-none sm:text-sm"
      />
    </label>
  );
};
