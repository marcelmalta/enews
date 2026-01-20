"use client";

type QueueBarProps = {
  count: number;
  onPlay: () => void;
  onClear: () => void;
};

export const QueueBar = ({ count, onPlay, onClear }: QueueBarProps) => {
  const isDisabled = count === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/80 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div className="text-sm text-[#b0b0b0]">
          <span className="text-white">{count}</span> selecionadas
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            disabled={isDisabled}
            className="h-11 rounded-full border border-white/20 px-5 text-xs uppercase tracking-[0.2em] text-white transition disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/40"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onPlay}
            disabled={isDisabled}
            className="h-11 rounded-full bg-[#f6c945] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#ff8a00] disabled:cursor-not-allowed disabled:bg-[#3a2f13] disabled:text-black/60"
          >
            Tocar fila
          </button>
        </div>
      </div>
    </div>
  );
};
