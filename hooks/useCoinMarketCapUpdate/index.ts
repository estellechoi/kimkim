import { useFetchCoinMarketCapCoinMetadata } from "@/data/hooks";
import { CoinMarketCapMetadataApiData } from "@/pages/api/cmc/metadata";
import { coinMarketCapMetadataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useCoinMarketCapUpdate = (symbols: readonly string[]) => {
    const [coinMarketCapMetadata, setCoinMarketCapMetadataAtom] = useAtom(coinMarketCapMetadataAtom);
    
    const { data: coinMarketCapCoinMetadata } = useFetchCoinMarketCapCoinMetadata(coinMarketCapMetadata ? null : 0, symbols);

    useEffect(() => {
        if (!coinMarketCapCoinMetadata?.data?.data) return;

        const data = coinMarketCapCoinMetadata.data.data;
        const reducedData = Object.keys(data).reduce<Record<string, CoinMarketCapMetadataApiData>>((acc, key) => {
            if (key === 'USDT') console.log(key, data[key]);
            return { ...acc, [key]: data[key][0] };
        }, {});

        setCoinMarketCapMetadataAtom({ ...coinMarketCapMetadata, ... reducedData });
    }, [coinMarketCapCoinMetadata]);
}

export default useCoinMarketCapUpdate;