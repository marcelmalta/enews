const STORAGE_KEY = "enews.watched.v1";
const EVENT_NAME = "enews:watched";

const safeRead = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as Record<string, number>;
  } catch {
    return {};
  }
};

const safeWrite = (map: Record<string, number>) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getWatchedMap = (): Record<string, number> => safeRead();

export const isWatched = (videoId: string) => {
  const map = safeRead();
  return Boolean(map[videoId]);
};

export const markWatched = (videoId: string) => {
  if (!videoId) {
    return;
  }

  const map = safeRead();
  if (map[videoId]) {
    return;
  }

  map[videoId] = Date.now();
  safeWrite(map);
};

export const unmarkWatched = (videoId: string) => {
  if (!videoId) {
    return;
  }

  const map = safeRead();
  if (!map[videoId]) {
    return;
  }

  delete map[videoId];
  safeWrite(map);
};

export const clearWatched = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const subscribeWatched = (handler: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      handler();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(EVENT_NAME, handler);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(EVENT_NAME, handler);
  };
};
