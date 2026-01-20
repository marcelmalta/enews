"use client";

type QueueButtonProps = {
  queued: boolean;
  onToggle: () => void;
};

export const QueueButton = ({ queued, onToggle }: QueueButtonProps) => {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={queued}
      title={queued ? "Remover da fila" : "Adicionar a fila"}
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition sm:h-9 sm:w-9 sm:text-sm ${
        queued
          ? "border-transparent bg-gradient-to-r from-[#f6c945] to-[#ff8a00] text-black"
          : "border-white/30 bg-black/50 text-white hover:border-white/60"
      }`}
    >
      {queued ? "-" : "+"}
    </button>
  );
};
