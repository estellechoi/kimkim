import { useFetchUpbitPrice } from "@/data/hooks";
import { useWebSocketUpbitPrice } from "@/data/hooks/webSocket";
import { UpbitTickerApiData } from "@/pages/api/upbit/ticker";
import { useEffect, useState } from "react";

const useUpbitPriceData = (enabled: boolean, symbols: readonly string[]) => {
    const { data: upbitPriceData, error: upbitPriceError, isLoading: isUpbitPriceLoading } = useFetchUpbitPrice(enabled ? 3000 : null, symbols);

    const { data: webSocketUpbitPriceData, error: webSocketUpbitPriceError, isLoading: isWebSocketUpbitPriceLoading } = useWebSocketUpbitPrice(enabled, symbols);
  
    const [data, setData] = useState<readonly UpbitTickerApiData[] | undefined>(upbitPriceData?.data);
    
    useEffect(() => {
        const overwrittenData = upbitPriceData?.data?.map(item => item.market === webSocketUpbitPriceData?.code ? ({ ...item, ...webSocketUpbitPriceData }) : item);
        setData(overwrittenData);
    }, [upbitPriceData, webSocketUpbitPriceData]);

    return { data, error: upbitPriceError, isLoading: isUpbitPriceLoading };
}

export default useUpbitPriceData;