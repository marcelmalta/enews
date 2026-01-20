"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { VideoItem } from "@/lib/types";
import {
  dateOptions,
  durationOptions,
  filterNews,
  sortByDateDesc,
  themeOptions,
  type DateFilter,
  type DurationFilter,
  type ThemeFilter,
} from "@/lib/store/filters";
import {
  clearQueue,
  readQueue,
  toggleQueueId,
  writeQueue,
} from "@/lib/store/queue";
import { Header } from "@/components/header/Header";
import { FiltersBar } from "@/components/header/FiltersBar";
import { ShortsCarousel } from "@/components/feed/ShortsCarousel";
import { NewsGrid } from "@/components/feed/NewsGrid";
import { EmptyState } from "@/components/feed/EmptyState";
import { NewsModal } from "@/components/modal/NewsModal";
import { QueueModal } from "@/components/modal/QueueModal";
import { QueueBar } from "@/components/queue/QueueBar";
import { useWatchedMap } from "@/lib/hooks/useWatched";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeFilter>("todos");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("tudo");
  const [search, setSearch] = useState("");
  const [hideWatched, setHideWatched] = useState(false);
  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [queueMode, setQueueMode] = useState(false);
  const watchedMap = useWatchedMap();

  const newsById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  );
  const sortedNews = useMemo(() => [...items].sort(sortByDateDesc), [items]);

  useEffect(() => {
    setQueueIds(readQueue());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem("enews.hideWatched.v1");
    if (stored === "true") {
      setHideWatched(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      "enews.hideWatched.v1",
      hideWatched ? "true" : "false"
    );
  }, [hideWatched]);

  useEffect(() => {
    writeQueue(queueIds);
  }, [queueIds]);

  const baseFilteredNews = useMemo(
    () => filterNews(sortedNews, theme, search, dateFilter, durationFilter),
    [sortedNews, theme, search, dateFilter, durationFilter]
  );

  const watchedCount = useMemo(
    () =>
      baseFilteredNews.filter((item) => Boolean(watchedMap[item.youtubeId]))
        .length,
    [baseFilteredNews, watchedMap]
  );

  const filteredNews = useMemo(() => {
    if (!hideWatched) {
      return baseFilteredNews;
    }

    return baseFilteredNews.filter(
      (item) => !watchedMap[item.youtubeId]
    );
  }, [baseFilteredNews, hideWatched, watchedMap]);

  const shorts = filteredNews.slice(0, 12);
  const gridItems = filteredNews.slice(12);

  const queueItems = useMemo(
    () =>
      queueIds
        .map((id) => newsById.get(id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [queueIds, newsById]
  );

  const modalItems = queueMode ? queueItems : filteredNews;

  const fetchFeed = useCallback(async () => {
    try {
      const response = await fetch("/api/feed");
      if (!response.ok) {
        setItems([]);
        return;
      }

      const data = (await response.json()) as { items?: VideoItem[] };
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    const interval = window.setInterval(fetchFeed, 60000);
    return () => window.clearInterval(interval);
  }, [fetchFeed]);

  const updateQuery = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("v", id);
    } else {
      params.delete("v");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openModal = (id: string) => {
    setQueueMode(false);
    setActiveId(id);
    updateQuery(id);
  };

  const closeModal = () => {
    setActiveId(null);
    setQueueMode(false);
    updateQuery(null);
  };

  const handleToggleQueue = (id: string) => {
    setQueueIds((prev) => toggleQueueId(prev, id));
  };

  const handleOpenQueue = () => {
    if (!queueItems.length) {
      return;
    }
    setQueueMode(true);
    setActiveId(queueItems[0].id);
    updateQuery(queueItems[0].id);
  };

  const handleClearQueue = () => {
    setQueueIds([]);
    clearQueue();
    if (queueMode) {
      setQueueMode(false);
      setActiveId(null);
      updateQuery(null);
    }
  };

  useEffect(() => {
    const id = searchParams.get("v");
    if (id && !queueMode && items.some((item) => item.id === id)) {
      setActiveId(id);
    }
    if (!id && activeId && !queueMode) {
      setActiveId(null);
    }
  }, [searchParams, activeId, queueMode, items]);

  useEffect(() => {
    if (!queueMode && activeId) {
      const stillVisible = filteredNews.some((item) => item.id === activeId);
      if (!stillVisible) {
        closeModal();
      }
    }
  }, [filteredNews, activeId, queueMode]);

  useEffect(() => {
    if (!queueMode) {
      return;
    }
    if (!queueItems.length) {
      closeModal();
      return;
    }
    if (!activeId || !queueItems.some((item) => item.id === activeId)) {
      setActiveId(queueItems[0].id);
      updateQuery(queueItems[0].id);
    }
  }, [queueItems, activeId, queueMode]);

  return (
    <div className="min-h-screen pb-32">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-10 pt-10 sm:px-8">
        <Header />
        <FiltersBar
          themes={themeOptions}
          dateFilters={dateOptions}
          durationFilters={durationOptions}
          theme={theme}
          dateFilter={dateFilter}
          durationFilter={durationFilter}
          hideWatched={hideWatched}
          watchedCount={watchedCount}
          totalCount={baseFilteredNews.length}
          onThemeChange={setTheme}
          onDateChange={setDateFilter}
          onDurationChange={setDurationFilter}
          onToggleHideWatched={setHideWatched}
          search={search}
          onSearchChange={setSearch}
        />
        {shorts.length ? (
          <ShortsCarousel
            items={shorts}
            queuedIds={queueIds}
            watchedMap={watchedMap}
            onOpen={openModal}
            onToggleQueue={handleToggleQueue}
          />
        ) : (
          <EmptyState
            title={isLoading ? "Carregando feed" : "Sem shorts no filtro atual"}
            description={
              isLoading
                ? "Buscando os videos mais recentes do canal."
                : "Tente outro tema ou limpe sua busca."
            }
          />
        )}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Noticias</h2>
            <span className="text-xs uppercase tracking-[0.25em] text-[#b0b0b0]">
              {gridItems.length} itens
            </span>
          </div>
          {gridItems.length ? (
            <NewsGrid
              items={gridItems}
              queuedIds={queueIds}
              watchedMap={watchedMap}
              onOpen={openModal}
              onToggleQueue={handleToggleQueue}
            />
          ) : (
            <EmptyState
              title={isLoading ? "Carregando feed" : "Nada por aqui"}
              description={
                isLoading
                  ? "Buscando os videos mais recentes do canal."
                  : "Ajuste filtros ou busca para encontrar mais noticias."
              }
            />
          )}
        </div>
      </main>
      <QueueBar
        count={queueIds.length}
        onPlay={handleOpenQueue}
        onClear={handleClearQueue}
      />
      <NewsModal
        open={Boolean(activeId) && !queueMode}
        items={modalItems}
        activeId={activeId}
        onClose={closeModal}
        onSelect={openModal}
      />
      <QueueModal
        open={Boolean(activeId) && queueMode}
        items={queueItems}
        activeId={activeId}
        onClose={closeModal}
        onSelect={(id) => {
          setActiveId(id);
          updateQuery(id);
        }}
      />
    </div>
  );
}
