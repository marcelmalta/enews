"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-[#b0b0b0]">
      <span className="text-xs uppercase tracking-[0.2em] text-white">
        Buscar
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Titulo ou tags"
        className="w-full bg-transparent text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none"
      />
    </label>
  );
};
