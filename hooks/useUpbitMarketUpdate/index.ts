import { useFetchUpbitMarket } from "@/data/hooks";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { upbitMarketDataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useUpbitMarketUpdate = () => {
    const { data: upbitMarketData } = useFetchUpbitMarket();

    const [,setUpbitMarketData] = useAtom(upbitMarketDataAtom);

    useEffect(() => {
        const data = upbitMarketData?.data.reduce<Record<string, UpbitMarketApiData>>((acc, item) => {
            return { ...acc, [item.market]: item };
        }, {}) ?? {};

        setUpbitMarketData(data);
    }, [upbitMarketData]);
}

export default useUpbitMarketUpdate;