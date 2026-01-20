"use client";

type FilterTab = {
  id: string;
  label: string;
};

type FilterTabsProps = {
  options: FilterTab[];
  value: string;
  onChange: (value: string) => void;
};

export const FilterTabs = ({ options, value, onChange }: FilterTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
              isActive
                ? "border-transparent bg-gradient-to-r from-[#f6c945] to-[#ff8a00] text-black shadow-[0_0_20px_rgba(246,201,69,0.25)]"
                : "border-white/10 bg-[#111111] text-[#b0b0b0] hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
