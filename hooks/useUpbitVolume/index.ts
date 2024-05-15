import { useFetchUpbitTrade } from '@/data/hooks';
import { useMemo } from 'react';

const useUpbitVolume = (enabled: boolean, symbol: string) => {
  const { data: upbitTradesData } = useFetchUpbitTrade(enabled ? 6000 : null, { symbol });

  const { bidVolume, askVolume } = useMemo(() => {
    const trades = upbitTradesData?.data;
    if (!trades) return { bidVolume: 0, askVolume: 0 };

    return trades.reduce(
      (acc, trade) => {
        if (trade.ask_bid === 'BID') {
          acc.bidVolume += trade.trade_volume * trade.trade_price;
        } else {
          acc.askVolume += trade.trade_volume * trade.trade_price;
        }
        return acc;
      },
      { bidVolume: 0, askVolume: 0 },
    );
  }, [upbitTradesData?.data]);

  return { bidVolume, askVolume };
};

export default useUpbitVolume;
