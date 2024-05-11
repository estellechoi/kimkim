import { Fiats } from '@/constants/app';
import { useFetchForex } from '@/data/hooks';
import { currencyExchangeRateAtom } from '@/store/states';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

const useUsdBasedExchangeRateUpdate = () => {
  const [currencyExchangeRate, setCurrencyExchangeRate] = useAtom(currencyExchangeRateAtom);

  const [usdBasedExchangeDataInterval, setUsdBasedExchangeInterval] = useState<number | null>(1800000);

  /**
   *
   * @description replace with Forex api
   */
  const { data: forexData, error: forextError, isLoading: isForexLoading } = useFetchForex(usdBasedExchangeDataInterval);

  useEffect(() => {
    if (forextError?.response?.status === 429) {
      // Forext api has rate limit per minute
      setUsdBasedExchangeInterval(null);
    }
  }, [forextError]);

  useEffect(() => {
    const lastUpdatedTime = forexData?.data?.meta.last_updated_at
      ? new Date(forexData.data.meta.last_updated_at).getTime()
      : undefined;

    const rates = Object.values(Fiats).reduce<Record<Fiats, number | null>>((acc, currency) => {
      return { ...acc, [currency]: forexData?.data?.data[currency]?.value ?? null };
    }, currencyExchangeRate.rates);

    setCurrencyExchangeRate({ lastUpdatedTime, rates });
  }, [forexData]);
};

export default useUsdBasedExchangeRateUpdate;
