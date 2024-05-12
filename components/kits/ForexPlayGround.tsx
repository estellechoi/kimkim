import { Fiats, Languages } from '@/constants/app';
import { currencyExchangeRateAtom } from '@/store/states';
import { TimeTick, formatDate } from '@/utils/date';
import BigNumber from 'bignumber.js';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import WaitingSymbol from '@/components/WaitingSymbol';
import Tag from '@/components/Tag';
import Card from '@/components/Card';
import CurrencyAmountInput from '@/components/text-inputs/CurrencyAmountInput';

type ForexPlayGroundProps = Readonly<{
  className?: string;
}>;

const ForexPlayGround = ({ className = '' }: ForexPlayGroundProps) => {
  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const krwByUsd = currencyExchangeRate.rates[Fiats.KRW];
  const audByUsd = currencyExchangeRate.rates[Fiats.AUD];

  const [usdInput, setUsdInput] = useState<string>('1');
  const [audInput, setAudInput] = useState<string>();
  const [krwInput, setKrwInput] = useState<string>(krwByUsd ? BigNumber(1).times(krwByUsd).dp(1).toString() : '');

  const onChangeUsdInput = useCallback(
    (value: string) => {
      setUsdInput(value);

      const parsedValue = parseFloat(value);
      if (Number.isNaN(parsedValue)) return;

      if (audByUsd !== null) {
        const audValue = BigNumber(parsedValue).times(audByUsd);
        setAudInput(audValue.dp(2).toString());
      }

      if (krwByUsd !== null) {
        const krwValue = BigNumber(parsedValue).times(krwByUsd);
        setKrwInput(krwValue.dp(1).toString());
      }
    },
    [krwByUsd, audByUsd],
  );

  const onChangeAudInput = useCallback(
    (value: string) => {
      setAudInput(value);

      const parsedValue = parseFloat(value);
      if (Number.isNaN(parsedValue)) return;

      if (audByUsd !== null) {
        const usdValue = BigNumber(parsedValue).div(audByUsd);
        setUsdInput(usdValue.dp(2).toString());

        if (krwByUsd !== null) {
          const krwValue = usdValue.times(krwByUsd);
          setKrwInput(krwValue.dp(1).toString());
        }
      }
    },
    [krwByUsd, audByUsd],
  );

  const onChangeKrwInput = useCallback(
    (value: string) => {
      setKrwInput(value);

      const parsedValue = parseFloat(value);
      if (Number.isNaN(parsedValue)) return;

      if (krwByUsd !== null) {
        const usdValue = BigNumber(parsedValue).div(krwByUsd);
        setUsdInput(usdValue.dp(2).toString());

        if (audByUsd !== null) {
          const audValue = usdValue.times(audByUsd);
          setAudInput(audValue.dp(2).toString());
        }
      }
    },
    [krwByUsd, audByUsd],
  );

  useEffect(() => {
    onChangeUsdInput(usdInput);
    onChangeAudInput(audByUsd ? BigNumber(usdInput).times(audByUsd).dp(1).toString() : '');
    onChangeKrwInput(krwByUsd ? BigNumber(usdInput).times(krwByUsd).dp(1).toString() : '');
  }, [krwByUsd, audByUsd]);

  return (
    <section className={`w-full space-y-6 ${className}`}>
      <div className="flex justify-between items-center gap-x-10 px-4">
        <div className="text-caption Font_label_12px">
          환율 {krwByUsd === undefined && <Tag size="sm" color="warning" label="데이터에 문제가 있어요" className="ml-2" />}
        </div>

        {currencyExchangeRate.lastUpdatedTime ? (
          <div className="text-caption Font_caption_xs">
            {formatDate(currencyExchangeRate.lastUpdatedTime, TimeTick.TIME, Languages.KR)}
          </div>
        ) : (
          <WaitingSymbol />
        )}
      </div>

      <div color="glass" className="w-full space-y-4 px-4">
        <CurrencyAmountInput fiat={Fiats.USD} value={usdInput} onInput={onChangeUsdInput} />
        <CurrencyAmountInput fiat={Fiats.AUD} value={audInput} onInput={onChangeAudInput} />
        <CurrencyAmountInput fiat={Fiats.KRW} value={krwInput} onInput={onChangeKrwInput} />
      </div>
    </section>
  );
};

export default ForexPlayGround;
