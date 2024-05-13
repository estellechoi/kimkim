import { useFetchBitgetPrice } from '@/data/hooks';
import { BitgetTickerWebSocketData } from '@/data/hooks/types';
import { useWebSocketBitgetPrice } from '@/data/hooks/webSocket';
import { BitgetWalletTickerApiData } from '@/pages/api/bitget/ticker';
import { useEffect, useState } from 'react';

const useBitgetPriceData = (enabled: boolean, symbols: readonly string[]) => {
  const {
    data: bitgetPriceData,
    error: bitgetPriceError,
    isLoading: isBitgetPriceLoading,
  } = useFetchBitgetPrice(enabled ? 0 : null);

  const { data: webSocketBitgetPriceData } = useWebSocketBitgetPrice(enabled, symbols);

  const [webSocketDataQueue, setWebSocketDataQueue] = useState<Record<string, BitgetTickerWebSocketData['data'][0]>>({});

  useEffect(() => {
    if (!webSocketBitgetPriceData) return;

    const newData =
      webSocketBitgetPriceData?.data?.reduce<Record<string, BitgetTickerWebSocketData['data'][0]>>((acc, item) => {
        const market = item.instId;
        return { ...acc, [market]: item };
      }, webSocketDataQueue) ?? webSocketDataQueue;

    setWebSocketDataQueue(newData);
  }, [webSocketBitgetPriceData]);

  /**
   *
   * @description final data to render
   */
  const [data, setData] = useState<readonly BitgetWalletTickerApiData[] | undefined>(bitgetPriceData?.data?.data);

  useEffect(() => {
    const overwrittenData = bitgetPriceData?.data?.data?.map((item) => {
      const queueData = webSocketDataQueue[item.symbol];
      return queueData ? { ...item, lastPrice: queueData.lastPr } : item;
    });
    setData(overwrittenData);
  }, [bitgetPriceData?.data?.data, webSocketDataQueue]);

  return { data, error: bitgetPriceError, isLoading: isBitgetPriceLoading };
};

export default useBitgetPriceData;
