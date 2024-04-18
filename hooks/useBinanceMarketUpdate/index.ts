import { useFetchBinaceMarket } from "@/data/hooks";
import { BinanceMarketSymbolDetailApiData } from "@/data/hooks/types";
import { binanceMarketDataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useBinanceMarketUpdate = () => {
    const [binanceMarketData, setBinanceMarketData] = useAtom(binanceMarketDataAtom);

    const { data: binanceSpotMarketData } = useFetchBinaceMarket(binanceMarketData ? null : 0);

    useEffect(() => {
        const data = binanceSpotMarketData?.data?.symbols.reduce<Record<string, BinanceMarketSymbolDetailApiData>>((acc, item) => {
            // update usdt-quoted market data only
            const symbol = item.symbol.endsWith('USDT') ? item.symbol.replaceAll('USDT', '') : null;
            return symbol ? { ...acc, [symbol]: item } : acc;
        }, {});

        setBinanceMarketData(data);
    }, [binanceSpotMarketData]);
}

export default useBinanceMarketUpdate;