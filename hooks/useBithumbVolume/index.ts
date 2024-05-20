import { useFetchBithumbCandles, useFetchBithumbTrade } from '@/data/hooks';
import { parse } from 'path';
import { useMemo } from 'react';

const useBithumbVolume = (enabled: boolean, symbol: string, periodMilliseconds?: number) => {
  const { data: bithumbTradesData } = useFetchBithumbTrade(enabled ? 6000 : null, { symbol });

  const { bidVolume, askVolume } = useMemo(() => {
    const trades = bithumbTradesData?.data?.data;
    if (!trades) return { bidVolume: 0, askVolume: 0 };

    const timeAgo = periodMilliseconds ? new Date().getTime() - periodMilliseconds : undefined;

    return trades.reduce(
      (acc, trade) => {
        if (timeAgo && new Date(trade.transaction_date).getTime() < timeAgo) return acc;

        if (trade.type === 'bid') {
          acc.bidVolume += parseFloat(trade.total);
        } else {
          acc.askVolume += parseFloat(trade.total);
        }
        return acc;
      },
      { bidVolume: 0, askVolume: 0 },
    );
  }, [bithumbTradesData?.data?.data, periodMilliseconds]);

  return { bidVolume, askVolume };
};

export default useBithumbVolume;
