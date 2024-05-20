import { useFetchUpbitTrade } from '@/data/hooks';
import { useMemo } from 'react';

const useUpbitVolume = (enabled: boolean, symbol: string, periodMilliseconds?: number) => {
  const { data: upbitTradesData } = useFetchUpbitTrade(enabled ? 6000 : null, { symbol });

  const { bidVolume, askVolume } = useMemo(() => {
    const trades = upbitTradesData?.data;
    if (!trades) return { bidVolume: 0, askVolume: 0 };

    const timeAgo = periodMilliseconds ? new Date().getTime() - periodMilliseconds : undefined;

    return trades.reduce(
      (acc, trade) => {
        if (timeAgo && trade.timestamp < timeAgo) return acc;

        if (trade.ask_bid === 'BID') {
          acc.bidVolume += trade.trade_volume * trade.trade_price;
        } else {
          acc.askVolume += trade.trade_volume * trade.trade_price;
        }
        return acc;
      },
      { bidVolume: 0, askVolume: 0 },
    );
  }, [upbitTradesData?.data, periodMilliseconds]);

  return { bidVolume, askVolume };
};

export default useUpbitVolume;
