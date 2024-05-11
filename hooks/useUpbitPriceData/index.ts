import { useFetchUpbitPrice } from '@/data/hooks';
import { UpbitTickerWebSocketData } from '@/data/hooks/types';
import { useWebSocketUpbitPrice } from '@/data/hooks/webSocket';
import { UpbitTickerApiData } from '@/pages/api/upbit/ticker';
import { useEffect, useMemo, useState } from 'react';
import useUpbitMarketUpdate from '@/hooks/useUpbitMarketUpdate';

const useUpbitPriceData = (enabled: boolean) => {
  const { upbitMarketData } = useUpbitMarketUpdate();

  const symbols = useMemo(() => (upbitMarketData ? Object.keys(upbitMarketData) : []), [upbitMarketData]);

  const fetch = enabled && symbols.length > 0;

  const {
    data: upbitPriceData,
    error: upbitPriceError,
    isLoading: isUpbitPriceLoading,
  } = useFetchUpbitPrice(fetch ? 3000 : null, symbols);

  const { data: webSocketUpbitPriceData } = useWebSocketUpbitPrice(fetch, symbols);

  const [webSocketDataQueue, setWebSocketData] = useState<Record<string, UpbitTickerWebSocketData>>({});

  useEffect(() => {
    if (!webSocketUpbitPriceData) return;

    setWebSocketData({ ...webSocketDataQueue, [webSocketUpbitPriceData.code]: webSocketUpbitPriceData });
  }, [webSocketUpbitPriceData]);

  /**
   *
   * @description final data to render
   */
  const [data, setData] = useState<readonly UpbitTickerApiData[] | undefined>(upbitPriceData?.data);

  useEffect(() => {
    const overwrittenData = upbitPriceData?.data?.map((item) => {
      const queueData = webSocketDataQueue[item.market];
      return queueData ? { ...item, ...queueData } : item;
    });
    setData(overwrittenData);
  }, [upbitPriceData, webSocketDataQueue]);

  return { data, error: upbitPriceError, isLoading: isUpbitPriceLoading, symbols };
};

export default useUpbitPriceData;
