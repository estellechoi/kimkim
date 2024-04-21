import { useFetcHtxPrice } from "@/data/hooks";
import { HtxTickerWebSocketData } from "@/data/hooks/types";
import { useWebSocketHtxPrice } from "@/data/hooks/webSocket";
import { HtxTickerData } from "@/types/htx";
import { useEffect, useState } from "react";

const useHtxPriceData = (enabled: boolean, symbols: readonly string[]) => {
    const { data: htxPriceData, error: htxPriceError, isLoading: isHtxPriceLoading } = useFetcHtxPrice(enabled ? 360000 : null);

    const { data: webSocketHtxPriceData } = useWebSocketHtxPrice(enabled, symbols);

    const [webSocketDataQueue, setWebSocketData] = useState<Record<string, HtxTickerWebSocketData>>({});

    useEffect(() => {
        if (!webSocketHtxPriceData?.ch) return;

        setWebSocketData({ ...webSocketDataQueue, [webSocketHtxPriceData.ch]: webSocketHtxPriceData });
    }, [webSocketHtxPriceData]);

    /**
     * 
     * @description final data to render
     */
    const [data, setData] = useState<readonly HtxTickerData[] | undefined>(htxPriceData?.data?.data);

    useEffect(() => {
        const overwrittenData = htxPriceData?.data?.data?.map(item => {
            const queueKey = `market.${item.symbol.toLowerCase()}.ticker`;
            const queueData = webSocketDataQueue[queueKey]?.tick;
            return queueData ? { ...item, ...queueData } : { ...item, lastPrice: item.close };
        });

        setData(overwrittenData);
    }, [htxPriceData, webSocketDataQueue]);

    return { data, error: htxPriceError, isLoading: isHtxPriceLoading };
}

export default useHtxPriceData;