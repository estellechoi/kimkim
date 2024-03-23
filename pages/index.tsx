import type {NextPage} from 'next';
import {useEffect, useMemo, useState} from 'react';
import Main from '@/components/Main';
import MobileAppLaunchSection from '@/components/home/MobileAppLaunchSection';
import useUserAgent from '@/hooks/useUserAgent';
import Card from '@/components/Card';
import { formatKRW, formatNumber } from '@/utils/number';
import Table from '@/components/Table';
import ErrorTag from '@/components/tags/ErrorTag';
import { useFetchBinacePrice, useFetchCoinMarketCapMetadata, useFetchExchangeRate, useFetchUpbitPrice } from '@/data/hooks';
import { TableRowData } from '@/components/Table/types';
import BigNumber from 'bignumber.js';
import { useAtom } from 'jotai';
import { coinMarketCapIdMapAtom, coinMarketCapMetadataAtom, upbitMarketDataAtom } from '@/store/states';
import { CMCIdMapItemApiData } from './api/cmc/idmap';
import Coin from '@/components/Coin';
import useCoinMarketCapMetadataUpdate from '@/hooks/useCoinMarketCapMetadataUpdate';

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

  const [upbitMarketData] = useAtom(upbitMarketDataAtom);
  
  /**
   * 
   * @description fetch data
   */
  const { data: krwExchangeRateData, error: krwExchangeRateError } = useFetchExchangeRate(3000);
  const { data: usdExchangeRateData, error: usdExchangeRateError } = useFetchExchangeRate(3000, 'USD');

  const { data: upbitPriceData, error: upbitPriceError } = useFetchUpbitPrice(3000);
  const { data: binancePriceData, error: binancePriceError } = useFetchBinacePrice(3000);


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
      const binancePriceKrw = BigNumber(binancePrice).multipliedBy(usdExchangeRateData?.data.conversion_rates.KRW ?? 0);

      // console.log('binancePrice', binancePrice);
      // console.log('usdExchangeRateData?.data.conversion_rates.KRW', usdExchangeRateData?.data.conversion_rates.KRW)
      // console.log('binancePriceKrw', binancePriceKrw.toNumber());

      const priceLabel = (
        <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
          <div>{formatKRW(upbitPrice, { fixDp: true })}</div>
          <div className="text-caption">{formatKRW(binancePriceKrw, { fixDp: true })}</div>
        </div>
      );


      const usdExchangeRate = krwExchangeRateData?.data.conversion_rates.USD ?? 0;
      const upbitPriceUsd = BigNumber(upbitPrice).multipliedBy(usdExchangeRate);


      const premium = binancePrice > 0 ? upbitPriceUsd.minus(binancePrice).div(binancePrice).multipliedBy(100) : BigNumber(0);
      const premiumLabel = <div className={`inline-flex items-baseline gap-x-0.5 Font_data_16px_num ${premium.gt(0) ? 'text-semantic_bull' : 'text-semantic_bear'}`}>{formatNumber(premium, 2)}<span className="Font_data_14px_unit">%</span></div>;

      const upbitVolume = item.acc_trade_volume_24h;
      const upbitVolumeKrw = BigNumber(item.acc_trade_volume_24h).times(item.opening_price);
      const binanceVolumeUsd = parseFloat(binanceData?.quoteVolume ?? '0');
      const binanceVolumeKrw = BigNumber(binanceVolumeUsd).multipliedBy(usdExchangeRateData?.data.conversion_rates.KRW ?? 0);
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
        premium,
        premiumLabel,
        volume: upbitVolume,
        volumeLabel,
      };
    
    }) ?? [];
  }, [krwExchangeRateData, usdExchangeRateData, upbitPriceData, binancePriceData]);

  return (
    <>
      {!isAppLaunched && <MobileAppLaunchSection onClickLaunch={() => setIsAppLaunched(true)} />}

      {isAppLaunched && (
        <Main className="flex flex-col items-stretch gap-y-10 min-h-screen pt-app_header_height pb-page_bottom">
          <section className="px-page_x">
            <div className="text-caption Font_label_12px p-4" >김치 프리미엄 {(krwExchangeRateError || usdExchangeRateError || upbitPriceError || binancePriceError) && <ErrorTag className="ml-2" />}</div>

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
