'use client';

import LocalStorage from '@/utils/LocalStorage';
import { useCallback, useState } from 'react';

const useWatchListSymbols = () => {
  const [watchListSymbols, setWatchListSymbols] = useState<Set<string>>(LocalStorage.getWatchListSymbols());

  const onToggleWatchList = useCallback(
    (symbol: string) => {
      const prevSymbols = Array.from(watchListSymbols);

      const newSymbols = watchListSymbols.has(symbol) ? prevSymbols.filter((item) => item !== symbol) : [...prevSymbols, symbol];
      const newSet = new Set(newSymbols);

      setWatchListSymbols(newSet);
      LocalStorage.setWatchListSymbols(newSet);
    },
    [watchListSymbols],
  );

  const clearWatchList = useCallback(() => {
    setWatchListSymbols(new Set());
    LocalStorage.setWatchListSymbols(null);
  }, []);

  return { watchListSymbols, onToggleWatchList, clearWatchList };
};

export default useWatchListSymbols;
