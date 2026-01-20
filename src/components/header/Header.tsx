"use client";

export const Header = () => {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="text-3xl font-semibold tracking-tight text-white">
          ENews
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#b0b0b0]">
          Experience News
        </span>
      </div>
      <p className="max-w-xl text-sm text-[#b0b0b0]">
        Video-first news com contexto rapido, filtros inteligentes e fila
        personalizada.
      </p>
    </header>
  );
};
