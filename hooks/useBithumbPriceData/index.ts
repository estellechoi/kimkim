import { useFetchBithumbPrice } from '@/data/hooks';
import { BithumbTransactionWebSocketData } from '@/data/hooks/types';
import { useWebSocketBithumbPrice } from '@/data/hooks/webSocket';
import { BithumbTickerApiData } from '@/pages/api/bithumb/ticker';
import { useEffect, useMemo, useState } from 'react';

export type BithumbTickerData = BithumbTickerApiData & Readonly<{ symbol: string; lastPrice?: `${number}` }>;

const useBithumbPriceData = (enabled: boolean) => {
  const {
    data: bithumbPriceData,
    error: bithumbPriceError,
    isLoading: isBithumbPriceLoading,
  } = useFetchBithumbPrice(enabled ? 0 : null);

  const { arrayedBithumbPriceData, symbols } = useMemo<{
    arrayedBithumbPriceData: readonly BithumbTickerData[] | undefined;
    symbols: readonly string[];
  }>(() => {
    const object = bithumbPriceData?.data?.data ?? {};
    const symbols = Object.keys(object);

    const arrayedBithumbPriceData = symbols.map((key) => {
      const data = object[key];
      return { ...data, symbol: key };
    });

    return { arrayedBithumbPriceData, symbols };
  }, [bithumbPriceData?.data?.data]);

  const { data: webSocketBithumbPriceData } = useWebSocketBithumbPrice(enabled, symbols);

  const [webSocketDataQueue, setWebSocketDataQueue] = useState<
    Record<string, BithumbTransactionWebSocketData['content']['list'][0]>
  >({});

  useEffect(() => {
    if (!webSocketBithumbPriceData) return;

    const newData =
      webSocketBithumbPriceData?.content.list.reduce<Record<string, BithumbTransactionWebSocketData['content']['list'][0]>>(
        (acc, item) => {
          const symbol = item.symbol.replaceAll('_KRW', '');
          return { ...acc, [symbol]: item };
        },
        {},
      ) ?? {};

    setWebSocketDataQueue({ ...webSocketDataQueue, ...newData });
  }, [webSocketBithumbPriceData]);

  /**
   *
   * @description final data to render
   */
  const [data, setData] = useState<readonly BithumbTickerData[] | undefined>(arrayedBithumbPriceData);

  useEffect(() => {
    const overwrittenData = arrayedBithumbPriceData?.map((item) => {
      const queueData = webSocketDataQueue[item.symbol];
      return queueData ? { ...item, lastPrice: queueData.contPrice } : item;
    });
    setData(overwrittenData);
  }, [arrayedBithumbPriceData, webSocketDataQueue]);

  return { data, error: bithumbPriceError, isLoading: isBithumbPriceLoading, symbols };
};

export default useBithumbPriceData;
