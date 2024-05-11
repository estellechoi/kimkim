import Polling from '@/components/Polling';
import { Fiats } from '@/constants/app';
import { useFetchBithumbTrade } from '@/data/hooks';
import { currencyExchangeRateAtom, selectedCurrencyAtom } from '@/store/states';
import { FormatCurrencyFunction, formatKRW, formatUSD } from '@/utils/number';
import BigNumber from 'bignumber.js';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

type USDTBithumbPricePollingProps = {
  className?: string;
};

const TEXT_FORMATTER_DICT: Record<Fiats, FormatCurrencyFunction> = {
  [Fiats.KRW]: formatKRW,
  [Fiats.USD]: formatUSD,
  [Fiats.AUD]: formatUSD,
};

const USDTBithumbPricePolling = ({ className = '' }: USDTBithumbPricePollingProps) => {
  const stableCoinSymbol = 'USDT';

  const { data: bithumbTradeData } = useFetchBithumbTrade(3000, { symbol: stableCoinSymbol });

  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const [selectedCurrency] = useAtom(selectedCurrencyAtom);

  const usdtPriceInSelectedCurrency = useMemo<BigNumber | undefined>(() => {
    const usdtPriceKrw = bithumbTradeData?.data?.data?.[0]?.price;
    if (!usdtPriceKrw) return;
    if (selectedCurrency === Fiats.KRW) return BigNumber(usdtPriceKrw);

    const usdtPriceUsd = currencyExchangeRate.rates[Fiats.KRW]
      ? BigNumber(usdtPriceKrw).div(currencyExchangeRate.rates[Fiats.KRW])
      : undefined;
    if (!usdtPriceUsd) return;

    const selectedCurrencyExchangeRate = currencyExchangeRate.rates[selectedCurrency];
    return selectedCurrencyExchangeRate ? BigNumber(usdtPriceUsd).times(selectedCurrencyExchangeRate) : undefined;
  }, [bithumbTradeData?.data?.data, stableCoinSymbol, currencyExchangeRate, selectedCurrency]);

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

export default USDTBithumbPricePolling;
