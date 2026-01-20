"use client";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export const EmptyState = ({
  title = "Nada por aqui",
  description = "Ajuste filtros ou busca para encontrar mais noticias.",
}: EmptyStateProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 text-center">
      <div className="text-lg font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm text-[#b0b0b0]">{description}</p>
    </div>
  );
};
