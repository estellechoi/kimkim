'use client';

import { LOCAL_STORAGE_KEYS } from "@/constants/app";
import { useCallback, useMemo, useState } from "react";

const useWatchListSymbols = () => {
    const storageWatchListSymbols = useMemo(() => localStorage.getItem(LOCAL_STORAGE_KEYS.WATCH_LIST_SYMBOLS)?.split(',') ?? [], []);

    const [watchListSymbols, setWatchListSymbols] = useState<Set<string>>(new Set(storageWatchListSymbols));
    
    const onToggleWatchList = useCallback((symbol: string) => {
      const newWatchListSymbols = new Set(watchListSymbols);
  
      if (newWatchListSymbols.has(symbol)) {
        newWatchListSymbols.delete(symbol);
      } else {
        newWatchListSymbols.add(symbol);
      }
      setWatchListSymbols(newWatchListSymbols);
    }, [watchListSymbols]);

    return { watchListSymbols, onToggleWatchList };
}

export default useWatchListSymbols;