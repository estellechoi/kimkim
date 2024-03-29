import type {NextPage} from 'next';
import {useCallback, useEffect, useState} from 'react';
import Main from '@/components/Main';
import MobileAppLaunchSection from '@/components/home/MobileAppLaunchSection';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import ExchangeDataWarningTag from '@/components/tags/ExchangeDataWarningTag';
import BigNumber from 'bignumber.js';
import { useAtom } from 'jotai';
import { currencyExchangeRateAtom } from '@/store/states';
import { Fiats, Languages } from '@/constants/app';
import CurrencyAmountInput from '@/components/text-inputs/CurrencyAmountInput';
import { TimeTick, formatDate } from '@/utils/date';
import dynamic from 'next/dynamic';
import WaitingSymbol from '@/components/WaitingSymbol';

const KimchiPremiumSection = dynamic(() => import('@/components/home/KimchiPremiumSection'), { ssr: false });

const Home: NextPage = () => {
  const { isMobile } = useUserAgent();
  const [isAppLaunched, setIsAppLaunched] = useState<boolean>(!isMobile);

  /**
   * 
   * @description exchange rate
   */
  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const krwByUsd = currencyExchangeRate.rates[Fiats.KRW];
  const audByUsd = currencyExchangeRate.rates[Fiats.AUD];

  /**
   * 
   * @description exchange rate
   */
  const [usdInput, setUsdInput] = useState<string>('1');
  const [audInput, setAudInput] = useState<string>();
  const [krwInput, setKrwInput] = useState<string>(krwByUsd ? BigNumber(1).times(krwByUsd).dp(1).toString() :'');

  const onChangeUsdInput = useCallback((value: string) => {
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
  }, [krwByUsd, audByUsd]);

  const onChangeAudInput = useCallback((value: string) => {
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
  }, [krwByUsd, audByUsd]);

  const onChangeKrwInput = useCallback((value: string) => {
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
  }, [krwByUsd, audByUsd]);

  useEffect(() => {
    onChangeUsdInput(usdInput);
    onChangeAudInput(audByUsd ? BigNumber(usdInput).times(audByUsd).dp(1).toString() :'');
    onChangeKrwInput(krwByUsd ? BigNumber(usdInput).times(krwByUsd).dp(1).toString() :'');
  }, [krwByUsd, audByUsd]);

  return (
    <>
      {!isAppLaunched && <MobileAppLaunchSection onClickLaunch={() => setIsAppLaunched(true)} />}

      {isAppLaunched && (
        <Main className="flex flex-col items-center gap-y-20 min-h-screen pt-app_header_height pb-page_bottom">
          <section className="w-full max-w-app_container space-y-2 px-page_x mt-20">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >환율 {krwByUsd === undefined && <ExchangeDataWarningTag className="ml-2" />}</div>
              {currencyExchangeRate.lastUpdatedTime ? (
                <div className="text-caption Font_caption_xs p-4" >{formatDate(currencyExchangeRate.lastUpdatedTime, TimeTick.TIME, Languages.KR)}</div>
              ) : (
                <WaitingSymbol />
              )}
            </div>

            <Card color="glass" className="w-full space-y-4 p-4">
              <CurrencyAmountInput fiat={Fiats.USD} value={usdInput} onInput={onChangeUsdInput} />
              <CurrencyAmountInput fiat={Fiats.AUD} value={audInput} onInput={onChangeAudInput} />
              <CurrencyAmountInput fiat={Fiats.KRW} value={krwInput} onInput={onChangeKrwInput} />
            </Card>
          </section>

          <KimchiPremiumSection krwByUsd={krwByUsd} audByUsd={audByUsd} />
        </Main>
      )}
    </>
  );
};

export default Home;
