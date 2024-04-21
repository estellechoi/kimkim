import { useFetchBinacePrice } from "@/data/hooks";
import { BinanceTickerApiData, BinanceTickerWebSocketData } from "@/data/hooks/types";
import { useWebSocketBinancePrice } from "@/data/hooks/webSocket";
import { binanceMarketDataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import useBinanceMarketUpdate from "@/hooks/useBinanceMarketUpdate";

const useBinancePriceData = (enabled: boolean, symbols: readonly string[]) => {
    useBinanceMarketUpdate();

    const [binanceMarketData] = useAtom(binanceMarketDataAtom);
    const binanceSymbols = symbols.filter(symbol => binanceMarketData?.[symbol]);
  
    const [binancePriceDataInterval, setBinancePriceInterval] = useState<number | null>(3000);
  
    const fetchBinancePriceData = enabled && binanceSymbols.length > 0;
    const { data: binancePriceData, error: binancePriceError, isLoading: isBinancePriceLoading } = useFetchBinacePrice(fetchBinancePriceData ? binancePriceDataInterval : null, binanceSymbols);
  
    useEffect(() => {
      let retryTimer: NodeJS.Timeout;
  
      if (binancePriceError?.response?.status === 429 || binancePriceError?.response?.status === 418) {
        setBinancePriceInterval(null);
        const retryAfter = binancePriceError?.response?.headers['Retry-After'];
        retryTimer = setTimeout(() => setBinancePriceInterval(3000), parseInt(retryAfter) * 1000);
      }
  
      return () => clearTimeout(retryTimer);
    }, [binancePriceError?.response]);

    const { data: webSocketBinancePriceData } = useWebSocketBinancePrice(fetchBinancePriceData, symbols);

    const [webSocketDataQueue, setWebSocketData] = useState<Record<string, BinanceTickerWebSocketData['data']>>({});

    useEffect(() => {
        if (!webSocketBinancePriceData?.data) return;

        setWebSocketData({ ...webSocketDataQueue, [webSocketBinancePriceData.data.s]: webSocketBinancePriceData.data });
    }, [webSocketBinancePriceData]);

    /**
     * 
     * @description final data to render
     */
    const [data, setData] = useState<readonly BinanceTickerApiData[] | undefined>(binancePriceData?.data);

    useEffect(() => {
        const overwrittenData = binancePriceData?.data?.map(item => {
          const queueData = webSocketDataQueue[item.symbol];
          return queueData ? ({ ...item, lastPrice: queueData.c, lastQty: queueData.Q }) : item;
        });
        setData(overwrittenData);
    }, [binancePriceData, webSocketDataQueue]);
  
    return { data, error: binancePriceError, isLoading: isBinancePriceLoading, queriedSymbols: binanceSymbols };
}

export default useBinancePriceData;