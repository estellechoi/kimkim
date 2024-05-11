import Polling from '@/components/Polling';
import { Fiats } from '@/constants/app';
import { currencyExchangeRateAtom, selectedCurrencyAtom } from '@/store/states';
import { FormatCurrencyFunction, formatKRW, formatUSD } from '@/utils/number';
import { useAtom } from 'jotai';

type ExchangeRatePollingProps = {
  className?: string;
};

const TEXT_FORMATTER_DICT: Record<Fiats, FormatCurrencyFunction> = {
  [Fiats.KRW]: formatKRW,
  [Fiats.USD]: formatUSD,
  [Fiats.AUD]: formatUSD,
};

const ExchangeRatePolling = ({ className = '' }: ExchangeRatePollingProps) => {
  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const [selectedCurrency] = useAtom(selectedCurrencyAtom);
  const selectedCurrencyExchangeRate = currencyExchangeRate.rates[selectedCurrency];

  const format = TEXT_FORMATTER_DICT[selectedCurrency];

  return (
    <Polling
      caption="USD 환율"
      formattedNumber={`${selectedCurrencyExchangeRate ? format(selectedCurrencyExchangeRate, { semiequate: true }) : '?'}`}
      isLoading={!selectedCurrencyExchangeRate}
      className={className}
    />
  );
};

export default ExchangeRatePolling;
