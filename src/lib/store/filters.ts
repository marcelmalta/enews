import type { VideoItem } from "@/lib/types";

export type ThemeId = "economia" | "geopolitica" | "futebol" | "cinema" | "tech";
export type ThemeFilter = ThemeId | "todos";
export type DateFilter = "hoje" | "7d" | "30d" | "tudo";
export type DurationFilter = "curta" | "rapida" | "longa" | "full" | "tudo";

export const themeOptions: { id: ThemeFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "economia", label: "Economia" },
  { id: "geopolitica", label: "Geopolitica" },
  { id: "futebol", label: "Futebol" },
  { id: "cinema", label: "Cinema" },
  { id: "tech", label: "Tech" },
];

export const dateOptions: { id: DateFilter; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "tudo", label: "Tudo" },
];

export const durationOptions: { id: DurationFilter; label: string }[] = [
  { id: "curta", label: "< 60s" },
  { id: "rapida", label: "1-3 min" },
  { id: "longa", label: "3-10 min" },
  { id: "full", label: "> 10 min" },
  { id: "tudo", label: "Todas" },
];

export const getThemeLabel = (theme: ThemeId) => {
  switch (theme) {
    case "economia":
      return "Economia";
    case "geopolitica":
      return "Geopolitica";
    case "futebol":
      return "Futebol";
    case "cinema":
      return "Cinema";
    case "tech":
      return "Tech";
    default:
      return "Tema";
  }
};

const themeByTag: Record<ThemeId, string[]> = {
  economia: ["economia", "mercado", "financas", "inflacao"],
  geopolitica: ["geopolitica", "global", "diplomacia", "conflito"],
  futebol: ["futebol", "esporte", "gol", "selecao"],
  cinema: ["cinema", "filme", "serie", "streaming"],
  tech: ["tech", "tecnologia", "ia", "startup"],
};

export const getThemeFromTags = (tags: string[]) => {
  const normalized = tags.map((tag) => tag.toLowerCase());

  for (const tag of normalized) {
    const entry = (Object.entries(themeByTag) as [ThemeId, string[]][]).find(
      ([, values]) => values.includes(tag)
    );
    if (entry) {
      return entry[0];
    }
  }

  return null;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const filterNews = (
  items: VideoItem[],
  theme: ThemeFilter,
  query: string,
  dateFilter: DateFilter,
  durationFilter: DurationFilter
) => {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery ? normalizedQuery.split(" ") : [];
  const now = new Date();

  return items.filter((item) => {
    if (theme !== "todos") {
      const itemTheme = getThemeFromTags(item.tags);
      if (itemTheme !== theme) {
        return false;
      }
    }

    if (dateFilter !== "tudo") {
      const publishedAt = new Date(item.publishedAt);
      if (Number.isNaN(publishedAt.getTime())) {
        return false;
      }

      const diffMs = now.getTime() - publishedAt.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (dateFilter === "hoje" && diffDays > 1) {
        return false;
      }
      if (dateFilter === "7d" && diffDays > 7) {
        return false;
      }
      if (dateFilter === "30d" && diffDays > 30) {
        return false;
      }
    }

    if (durationFilter !== "tudo") {
      const duration = item.durationSec;
      if (durationFilter === "curta" && duration >= 60) {
        return false;
      }
      if (durationFilter === "rapida" && (duration < 60 || duration > 180)) {
        return false;
      }
      if (durationFilter === "longa" && (duration < 180 || duration > 600)) {
        return false;
      }
      if (durationFilter === "full" && duration <= 600) {
        return false;
      }
    }

    if (!tokens.length) {
      return true;
    }

    const haystack = normalize(
      `${item.title} ${item.tags.join(" ")} ${item.description}`
    );
    return tokens.every((token) => haystack.includes(token));
  });
};

export const sortByDateDesc = (a: VideoItem, b: VideoItem) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
