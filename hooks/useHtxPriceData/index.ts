import { useFetcHtxPrice } from "@/data/hooks";
import { useWebSocketHtxPrice } from "@/data/hooks/webSocket";
import { HtxMarketApiData } from "@/pages/api/htx/ticker";
import { useEffect, useState } from "react";

const useHtxPriceData = (enabled: boolean, symbols: readonly string[]) => {
    const { data: htxPriceData, error: htxPriceError, isLoading: isHtxPriceLoading } = useFetcHtxPrice(enabled ? 3000 : null);

    const { data: webSocketHtxPriceData } = useWebSocketHtxPrice(enabled, symbols);
  
    const [data, setData] = useState<readonly HtxMarketApiData[] | undefined>(htxPriceData?.data?.data);

    useEffect(() => {
        const overwrittenData = htxPriceData?.data?.data?.map(item => {
            const market = webSocketHtxPriceData?.ch.replace('.kline.1min', '').replace('market.', '');
            return webSocketHtxPriceData && item.symbol === market ? ({ ...item, ...webSocketHtxPriceData.tick }) : item
        });

        setData(overwrittenData);
    }, [htxPriceData, webSocketHtxPriceData]);

    return { data, error: htxPriceError, isLoading: isHtxPriceLoading };
}

export default useHtxPriceData;