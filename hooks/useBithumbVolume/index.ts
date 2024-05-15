import { useFetchBithumbCandles, useFetchBithumbTrade } from '@/data/hooks';
import { parse } from 'path';
import { useMemo } from 'react';

const useBithumbVolume = (enabled: boolean, symbol: string) => {
  const { data: bithumbTradesData } = useFetchBithumbTrade(enabled ? 6000 : null, { symbol });

  const { bidVolume, askVolume } = useMemo(() => {
    const trades = bithumbTradesData?.data?.data;
    if (!trades) return { bidVolume: 0, askVolume: 0 };

    return trades.reduce(
      (acc, trade) => {
        if (trade.type === 'bid') {
          acc.bidVolume += parseFloat(trade.total);
        } else {
          acc.askVolume += parseFloat(trade.total);
        }
        return acc;
      },
      { bidVolume: 0, askVolume: 0 },
    );
  }, [bithumbTradesData?.data?.data]);

  return { bidVolume, askVolume };
};

export default useBithumbVolume;
