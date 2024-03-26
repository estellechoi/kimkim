import { useFetchCoinGeckoCoinIds } from "@/data/hooks";
import { CoinGeckoCoinApiData } from "@/pages/api/coingecko/coins";
import { coinGeckoCoinIdMapAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useCoinGeckoUpdate = () => {
    const [,setCoinGeckoCoinIdMap] = useAtom(coinGeckoCoinIdMapAtom);

    const { data: coinIdsData } = useFetchCoinGeckoCoinIds(0);

    useEffect(() => {
        const data = coinIdsData?.data.reduce<Record<string, CoinGeckoCoinApiData>>((acc, item) => {
            return { ...acc, [item.symbol.toUpperCase()]: item };
        }, {});

        setCoinGeckoCoinIdMap(data);
    }, [coinIdsData]);


}

export default useCoinGeckoUpdate;