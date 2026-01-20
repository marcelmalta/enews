"use client";

import { useCallback, useEffect, useState } from "react";
import { getWatchedMap, subscribeWatched } from "@/lib/store/watched";

export const useWatchedMap = () => {
  const [map, setMap] = useState<Record<string, number>>({});

  const refresh = useCallback(() => {
    setMap(getWatchedMap());
  }, []);

  useEffect(() => {
    refresh();
    return subscribeWatched(refresh);
  }, [refresh]);

  return map;
};
