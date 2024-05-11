import Polling from '@/components/Polling';
import { Fiats } from '@/constants/app';
import { useFetchCoinMarketCapPrice } from '@/data/hooks';
import { currencyExchangeRateAtom, selectedCurrencyAtom } from '@/store/states';
import { FormatCurrencyFunction, formatKRW, formatUSD } from '@/utils/number';
import BigNumber from 'bignumber.js';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

type USDTPricePollingProps = {
  className?: string;
};

const TEXT_FORMATTER_DICT: Record<Fiats, FormatCurrencyFunction> = {
  [Fiats.KRW]: formatKRW,
  [Fiats.USD]: formatUSD,
  [Fiats.AUD]: formatUSD,
};

const USDTPricePolling = ({ className = '' }: USDTPricePollingProps) => {
  const stableCoinSymbol = 'USDT';

  const { data: coinMarketCapPriceData } = useFetchCoinMarketCapPrice(3000, [stableCoinSymbol]);

  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const [selectedCurrency] = useAtom(selectedCurrencyAtom);

  const usdtPriceInSelectedCurrency = useMemo<BigNumber | undefined>(() => {
    const usdtPriceUsd = coinMarketCapPriceData?.data?.data?.[stableCoinSymbol]?.[0]?.quote.USD.price;
    const selectedCurrencyExchangeRate = currencyExchangeRate.rates[selectedCurrency];

    return usdtPriceUsd && selectedCurrencyExchangeRate ? BigNumber(usdtPriceUsd).times(selectedCurrencyExchangeRate) : undefined;
  }, [coinMarketCapPriceData?.data?.data, stableCoinSymbol, currencyExchangeRate, selectedCurrency]);

  const format = TEXT_FORMATTER_DICT[selectedCurrency];

  return (
    <Polling
      caption="USDT"
      formattedNumber={`${usdtPriceInSelectedCurrency ? format(usdtPriceInSelectedCurrency, { semiequate: true }) : '?'}`}
      isLoading={!usdtPriceInSelectedCurrency}
      className={className}
    />
  );
};

export default USDTPricePolling;
