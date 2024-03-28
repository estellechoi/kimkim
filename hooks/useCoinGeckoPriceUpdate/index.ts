import { useFetchCoinGeckoCoins } from "@/data/hooks";
import { CoinGeckoCoinPriceApiData } from "@/pages/api/coingecko/prices";
import { coinGeckoCoinMapAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useCoinGeckoPriceUpdate = (ids: readonly string[]) => {
  const { data: coinsData } = useFetchCoinGeckoCoins(ids.length > 0 ? 3000 : null, ids);

  const [coinGeckoCoinMap, setCoinGeckoCoinMap] = useAtom(coinGeckoCoinMapAtom);

  useEffect(() => {
      const data = coinsData?.data?.reduce<Record<string, CoinGeckoCoinPriceApiData>>((acc, item) => {
          return { ...acc, [item.symbol.toUpperCase()]: item };
      }, {});

      setCoinGeckoCoinMap({...coinGeckoCoinMap, ...data});
  }, [coinGeckoCoinMap, coinsData]);
}

export default useCoinGeckoPriceUpdate;