import { useCallback } from 'react';
import { KimchiPremiumTableRow } from '.';

const useSortKimchiPremiumTable = ({ watchListSymbols }: { watchListSymbols: Set<string> }) => {
  const sortBasedOnWatchList = useCallback(
    (a: KimchiPremiumTableRow, b: KimchiPremiumTableRow): -1 | 0 | 1 => {
      const isAWatched = watchListSymbols.has(a.symbol);
      const isBWatched = watchListSymbols.has(b.symbol);
      if (isAWatched && !isBWatched) return -1;
      if (!isAWatched && isBWatched) return 1;
      return 0;
    },
    [watchListSymbols],
  );

  const sortBasedOnPremium = useCallback((a: KimchiPremiumTableRow, b: KimchiPremiumTableRow): -1 | 0 | 1 => {
    return a.premium.gt(b.premium) ? -1 : 1;
  }, []);

  const sortKimchiPremiumTable = useCallback(
    (a: KimchiPremiumTableRow, b: KimchiPremiumTableRow): -1 | 0 | 1 => {
      const sortResult = sortBasedOnWatchList(a, b);
      return sortResult === 0 ? sortBasedOnPremium(a, b) : sortResult;
    },
    [sortBasedOnWatchList, sortBasedOnPremium],
  );

  return sortKimchiPremiumTable;
};

export default useSortKimchiPremiumTable;
