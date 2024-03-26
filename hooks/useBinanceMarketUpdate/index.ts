import { useFetchBinaceMarket } from "@/data/hooks";
import { BinanceMarketSymbolDetailApiData } from "@/data/hooks/types";
import { binanceMarketDataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useBinanceMarketUpdate = () => {
    const { data: binanceMarketData } = useFetchBinaceMarket(0);

    const [,setBinanceMarketData] = useAtom(binanceMarketDataAtom);

    useEffect(() => {
        const data = binanceMarketData?.data.symbols.reduce<Record<string, BinanceMarketSymbolDetailApiData>>((acc, item) => {
            return { ...acc, [item.symbol]: item };
        }, {});

        setBinanceMarketData(data);
    }, [binanceMarketData]);
}

export default useBinanceMarketUpdate;