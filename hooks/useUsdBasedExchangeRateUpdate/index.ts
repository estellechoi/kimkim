import { Fiats } from "@/constants/app";
import { useFetchExchangeRate } from "@/data/hooks";
import { currencyExchangeRateAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const useUsdBasedExchangeRateUpdate = () => {
    const [currencyExchangeRate, setCurrencyExchangeRate] = useAtom(currencyExchangeRateAtom);
    
    const [usdBasedExchangeDataInterval, setUsdBasedExchangeInterval] = useState<number | null>(60000);
    const { data: usdBasedExchangeRateData, error: usdBasedExchangeRateError } = useFetchExchangeRate(usdBasedExchangeDataInterval, Fiats.USD);
  
    useEffect(() => {
      if (usdBasedExchangeRateError?.response?.status === 429) {
        setUsdBasedExchangeInterval(null);
      }
    }, [usdBasedExchangeRateError?.response?.status]);

    useEffect(() => {
      const newCurrencyExchangeRate = Object.values(Fiats).reduce<Record<Fiats, number | null>>((acc, currency) => {
        const item = {
          [currency]: usdBasedExchangeRateData?.data.conversion_rates[currency] ?? null
        };
        return { ...acc, ...item };
      }, currencyExchangeRate);

      setCurrencyExchangeRate(newCurrencyExchangeRate);
    }, [usdBasedExchangeRateData, currencyExchangeRate]);
}

export default useUsdBasedExchangeRateUpdate;