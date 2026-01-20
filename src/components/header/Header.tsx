"use client";

import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex flex-col gap-2 py-2 sm:py-4">
      <div className="flex items-center gap-3">
        <Image
          src="/icons/enews-icon.png"
          width={32}
          height={32}
          alt="ENews"
          className="sm:hidden"
        />
        <div className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          ENews
        </div>
        <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#b0b0b0] sm:inline-flex">
          Experience News
        </span>
      </div>
      <p className="max-w-xl text-xs text-[#b0b0b0] sm:hidden line-clamp-1">
        Video-first news, direto ao ponto.
      </p>
      <p className="hidden max-w-xl text-sm text-[#b0b0b0] sm:block">
        Video-first news com contexto rapido, filtros inteligentes e fila
        personalizada.
      </p>
    </header>
  );
};
