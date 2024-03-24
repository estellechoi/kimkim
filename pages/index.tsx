import type {NextPage} from 'next';
import {useCallback, useEffect, useMemo, useState} from 'react';
import Main from '@/components/Main';
import MobileAppLaunchSection from '@/components/home/MobileAppLaunchSection';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import { formatKRW, formatNumber } from '@/utils/number';
import Table from '@/components/Table';
import ErrorTag from '@/components/tags/ErrorTag';
import { useFetchBinacePrice, useFetchUpbitPrice } from '@/data/hooks';
import { TableRowData } from '@/components/Table/types';
import BigNumber from 'bignumber.js';
import { useAtom } from 'jotai';
import { coinMarketCapIdMapAtom, currencyExchangeRateAtom, upbitMarketDataAtom } from '@/store/states';
import { CMCIdMapItemApiData } from './api/cmc/idmap';
import Coin from '@/components/Coin';
import useCoinMarketCapMetadataUpdate from '@/hooks/useCoinMarketCapMetadataUpdate';
import { Fiats } from '@/constants/app';
import ExchangeDropDownPair from '@/components/drop-downs/ExchangeDropDownPair';
import CurrencyAmountInput from '@/components/text-inputs/CurrencyAmountInput';

export interface KimchiPremiumTableRow extends TableRowData {
  symbol: string;
  symbolLabel: JSX.Element | string;
  price: number;
  priceLabel: JSX.Element | string;
  premium: BigNumber;
  premiumLabel: JSX.Element | string;
  volume: number;
  volumeLabel: JSX.Element | string;
}

const Home: NextPage = () => {
  const { isMobile } = useUserAgent();
  const [isAppLaunched, setIsAppLaunched] = useState<boolean>(!isMobile);

  /**
   * 
   * @description exchange rate
   */
  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const krwByUsd = currencyExchangeRate[Fiats.KRW];
  const audByUsd = currencyExchangeRate[Fiats.AUD];

  /**
   * 
   * @description upbit data
   */
  const [upbitMarketData] = useAtom(upbitMarketDataAtom);

  const { data: upbitPriceData, error: upbitPriceError } = useFetchUpbitPrice(3000);

  /**
   * 
   * @description binance data
   */
  const [binancePriceDataInterval, setBinancePriceInterval] = useState<number | null>(3000);
  const { data: binancePriceData, error: binancePriceError } = useFetchBinacePrice(binancePriceDataInterval);

  useEffect(() => {
    let retryTimer: NodeJS.Timeout;

    if (binancePriceError?.response?.status === 429 || binancePriceError?.response?.status === 418) {
      setBinancePriceInterval(null);
      const retryAfter = binancePriceError?.response?.headers['retry-after'];
      retryTimer = setTimeout(() => setBinancePriceInterval(3000), parseInt(retryAfter) * 1000);
    }

    return () => clearTimeout(retryTimer);
  }, [binancePriceError?.response]);

  /**
   * 
   * @description setup coin metadata
   */
  const [coinMarketCapIdMap] = useAtom(coinMarketCapIdMapAtom);
  
  const coinMarketCapIds = useMemo<readonly number[]>(() => {
    return upbitPriceData?.data.reduce<readonly number[]>((acc, item) => {
      const symbol = item.market.replace('KRW-', '');
      const coinMarketCapIdData: CMCIdMapItemApiData | undefined = coinMarketCapIdMap[symbol];
      return coinMarketCapIdData ? [...acc, coinMarketCapIdData.id] : acc;
    }, []) ?? [];
  }, [upbitPriceData, coinMarketCapIdMap]);

  useCoinMarketCapMetadataUpdate(coinMarketCapIds);

  /**
   * 
   * @description build table rows
   */
  const rows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    return upbitPriceData?.data.map(item => {
      const symbol = item.market.replace('KRW-', '');
      const koreanName = upbitMarketData?.[item.market]?.korean_name ?? symbol;
      const symbolLabel = (
        <div className="flex items-center gap-x-2">
          <Coin symbol={symbol} size="sm" />
          <div className="Font_label_14px">{koreanName}</div>
        </div>
      );

      const binanceData = binancePriceData?.data.find(({ symbol: binanceSymbol }) => binanceSymbol.includes(symbol));

      const upbitPrice = item.opening_price;
      const binancePrice = parseFloat(binanceData?.openPrice ?? '0');
      const binancePriceKrw = BigNumber(binancePrice).multipliedBy(krwByUsd ?? 0);

      const priceLabel = (
        <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
          <div>{formatKRW(upbitPrice, { fixDp: true })}</div>
          <div className="text-caption">{formatKRW(binancePriceKrw, { fixDp: true })}</div>
        </div>
      );


      const premium = binancePriceKrw.gt(0) ? BigNumber(upbitPrice).minus(binancePriceKrw).div(binancePriceKrw).multipliedBy(100) : null;
      const premiumLabel = <div className={`inline-flex items-baseline gap-x-0.5 Font_data_16px_num ${premium?.gt(0) ? 'text-semantic_bull' : 'text-semantic_bear'}`}>{formatNumber(premium, 2)}<span className="Font_data_14px_unit">%</span></div>;

      const upbitVolume = item.acc_trade_volume_24h;
      const upbitVolumeKrw = BigNumber(item.acc_trade_volume_24h).times(item.opening_price);
      const binanceVolumeUsd = parseFloat(binanceData?.quoteVolume ?? '0');
      const binanceVolumeKrw = BigNumber(binanceVolumeUsd).multipliedBy(krwByUsd ?? 0);
      const volumeLabel = (
        <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
          <div>{formatKRW(upbitVolumeKrw, { fixDp: true, compact: true })}</div>
          <div>{formatKRW(binanceVolumeKrw, { fixDp: true, compact: true })}</div>
        </div>
      );

      return {
        id: item.market,
        symbol: symbol,
        symbolLabel,
        price: upbitPrice,
        priceLabel,
        premium: premium ?? BigNumber(0),
        premiumLabel,
        volume: upbitVolume,
        volumeLabel,
      };
    
    }) ?? [];
  }, [krwByUsd, upbitPriceData, binancePriceData]);

  const isDataError = useMemo(() => krwByUsd === undefined || upbitPriceError || binancePriceError, [krwByUsd, upbitPriceError, binancePriceError]);

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
        <Main className="flex flex-col items-stretch gap-y-10 min-h-screen pt-app_header_height pb-page_bottom">
          <section className="space-y-2 px-page_x">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >환율 {krwByUsd === undefined && <ErrorTag className="ml-2" />}</div>
            </div>

            <Card color="glass" className="w-full space-y-4 p-4">
              <CurrencyAmountInput fiat={Fiats.USD} value={usdInput} onInput={onChangeUsdInput} />
              <CurrencyAmountInput fiat={Fiats.AUD} value={audInput} onInput={onChangeAudInput} />
              <CurrencyAmountInput fiat={Fiats.KRW} value={krwInput} onInput={onChangeKrwInput} />
            </Card>
          </section>

          <section className="space-y-2 px-page_x">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >김치 프리미엄 {isDataError && <ErrorTag className="ml-2" />}</div>
              
              <div className="flex items-center gap-x-4">
                <ExchangeDropDownPair />
              </div>
            </div>

            <Card color="glass" className="w-full space-y-4">
              <Table<KimchiPremiumTableRow>
                // hasMouseEffect={true}
                tooltipContext="base"
                dSortValue="premium"
                rows={rows}
                fields={[
                  {
                    label: '코인',
                    value: 'symbolLabel',
                    type: 'jsx',
                    sortType: 'string',
                    sortValue: 'symbol',
                  },
                  {
                    label: '가격',
                    value: 'priceLabel',
                    type: 'jsx',
                    sortType: 'number',
                    sortValue: 'price',
                    align: 'right',
                    widthRatio: 20,
                  },
                  {
                    label: '김프',
                    value: 'premiumLabel',
                    type: 'jsx',
                    sortType: 'bignumber',
                    sortValue: 'premium',
                    align: 'right',
                    widthRatio: 20,
                  },
                  {
                    label: '거래량',
                    value: 'volumeLabel',
                    type: 'jsx',
                    sortType: 'number',
                    sortValue: 'volume',
                    align: 'right',
                    widthRatio: 30,
                  },
                ]}
              >
                <Table.FieldRow />
              </Table>
            </Card>
          </section>
        </Main>
      )}
    </>
  );
};

export default Home;
