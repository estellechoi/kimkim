import { useFetchUpbitMarket, useFetchUpbitWalletStatus } from "@/data/hooks";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { tokenKoreanNameMapAtom, upbitMarketDataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useUpbitMarketUpdate = () => {
    const [upbitMarketData, setUpbitMarketData] = useAtom(upbitMarketDataAtom);

    const { data: upbitSpotMarketData } = useFetchUpbitMarket(upbitMarketData ? null : 0);

    const [tokenKoreanNameMap, setTokenKoreanNameMap] = useAtom(tokenKoreanNameMapAtom);

    useEffect(() => {
        const newTokenKoreanNameMap: Record<string, string> = {};

        // update krw-quoted market data only
        const data = upbitSpotMarketData?.data?.reduce<Record<string, UpbitMarketApiData>>((acc, item) => {
            const symbol = item.market.includes('KRW-') ? item.market.replaceAll('KRW-', '') : null;
            if (symbol === null) return acc;

            newTokenKoreanNameMap[symbol] = item.korean_name;
            return { ...acc, [symbol]: item };
        }, {});

        setTokenKoreanNameMap({ ...tokenKoreanNameMap, ...newTokenKoreanNameMap });
        setUpbitMarketData(data);
    }, [upbitSpotMarketData]);

    return { upbitMarketData };
}

export default useUpbitMarketUpdate;