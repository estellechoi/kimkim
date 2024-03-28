import { useFetchUpbitMarket, useFetchUpbitWalletStatus } from "@/data/hooks";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { UpbitWalletStatusApiData } from "@/pages/api/upbit/wallet";
import { tokenKoreanNameMapAtom, upbitMarketDataAtom, upbitWalletStatusAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useUpbitMarketUpdate = () => {
    const { data: upbitMarketData } = useFetchUpbitMarket(0);
    const { data: upbitWalletStatus } = useFetchUpbitWalletStatus(0);

    const [, setUpbitMarketData] = useAtom(upbitMarketDataAtom);
    const [tokenKoreanNameMap, setTokenKoreanNameMap] = useAtom(tokenKoreanNameMapAtom);

    useEffect(() => {
        const newTokenKoreanNameMap: Record<string, string> = {};

        // update krw-quoted market data only
        const data = upbitMarketData?.data?.reduce<Record<string, UpbitMarketApiData>>((acc, item) => {
            const symbol = item.market.includes('KRW-') ? item.market.replaceAll('KRW-', '') : null;
            if (symbol === null) return acc;

            newTokenKoreanNameMap[symbol] = item.korean_name;
            return { ...acc, [symbol]: item };
        }, {});

        setTokenKoreanNameMap({ ...tokenKoreanNameMap, ...newTokenKoreanNameMap });
        setUpbitMarketData(data);
    }, [upbitMarketData]);

    const [, setUpbitWalletStatus] = useAtom(upbitWalletStatusAtom);

    useEffect(() => {
        const data = upbitWalletStatus?.data?.reduce<Record<string, UpbitWalletStatusApiData>>((acc, item) => {
            return { ...acc, [item.currency]: item };
        }, {});
        setUpbitWalletStatus(data);
    }, [upbitWalletStatus]);
}

export default useUpbitMarketUpdate;