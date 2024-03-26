import { useFetchCoinMarketCapIdMap, useFetchUpbitMarket } from "@/data/hooks";
import { CMCIdMapItemApiData } from "@/pages/api/cmc/idmap";
import { coinMarketCapIdMapAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useCoinMarketCapUpdate = () => {
    const { data: idMapData } = useFetchCoinMarketCapIdMap(0);

    const [,setCoinMarketCapMetadata] = useAtom(coinMarketCapIdMapAtom);

    useEffect(() => {
        const data = idMapData?.data.data?.reduce<Record<string, CMCIdMapItemApiData>>((acc, item) => {
            return { ...acc, [item.symbol]: item };
        }, {});

        setCoinMarketCapMetadata(data);
    }, [idMapData]);
}

export default useCoinMarketCapUpdate;