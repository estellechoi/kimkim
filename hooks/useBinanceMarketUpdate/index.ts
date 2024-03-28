import { useFetchBinaceMarket } from "@/data/hooks";
import { BinanceMarketSymbolDetailApiData } from "@/data/hooks/types";
import { binanceMarketDataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useBinanceMarketUpdate = () => {
    const { data: binanceMarketData } = useFetchBinaceMarket(0);

    const [, setBinanceMarketData] = useAtom(binanceMarketDataAtom);

    useEffect(() => {
        const data = binanceMarketData?.data?.symbols.reduce<Record<string, BinanceMarketSymbolDetailApiData>>((acc, item) => {
            // update usdt-quoted market data only
            const symbol = item.symbol.endsWith('USDT') ? item.symbol.replaceAll('USDT', '') : null;
            return symbol ? { ...acc, [symbol]: item } : acc;
        }, {});

        setBinanceMarketData(data);
    }, [binanceMarketData]);
}

export default useBinanceMarketUpdate;