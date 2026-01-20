import type { SourceItem } from "@/lib/types";

type ParsedDescription = {
  summary: string;
  sources: SourceItem[];
  tags: string[];
};

const extractTags = (text: string) => {
  const matches = text.match(/#([\p{L}\p{N}_]+)/gu) ?? [];
  return Array.from(new Set(matches.map((tag) => tag.slice(1).toLowerCase())));
};

const extractSummary = (text: string) => {
  const summaryMatch = text.match(/RESUMO:\s*([\s\S]*?)(?:FONTES:|$)/i);
  if (!summaryMatch) {
    return "";
  }

  return summaryMatch[1].trim().replace(/\s+/g, " ");
};

const extractSources = (text: string) => {
  const sourcesMatch = text.match(/FONTES:\s*([\s\S]*)$/i);
  if (!sourcesMatch) {
    return [];
  }

  const lines = sourcesMatch[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sources: SourceItem[] = [];
  lines.forEach((line) => {
    const match = line.match(/^-?\s*([^:]+):\s*(https?:\/\/\S+)/i);
    if (!match) {
      return;
    }

    sources.push({
      name: match[1].trim(),
      url: match[2].trim(),
    });
  });

  return sources;
};

export const parseDescription = (text: string): ParsedDescription => {
  const safeText = text ?? "";

  return {
    summary: extractSummary(safeText),
    sources: extractSources(safeText),
    tags: extractTags(safeText),
  };
};
