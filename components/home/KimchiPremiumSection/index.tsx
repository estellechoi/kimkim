'use client';

import TextInput from '@/components/TextInput';
import Icon from '@/components/Icon';
import AppSymbolSVG from '@/components/svgs/AppSymbolSVG';
import KimchiPremiumTable, { KimchiPremiumTableRow } from '@/components/tables/KimchiPremiumTable';
import useWatchListSymbols from '@/hooks/useWatchListSymbols';
import ExchangeDropDownPair from '@/components/drop-downs/ExchangeDropDownPair';
import { CMCIdMapItemApiData } from '@/pages/api/cmc/idmap';
import Coin from '@/components/Coin';
import useCoinMarketCapMetadataUpdate from '@/hooks/useCoinMarketCapMetadataUpdate';
import { binanceMarketDataAtom, coinMarketCapIdMapAtom, upbitMarketDataAtom } from '@/store/states';
import { useFetchBinacePrice, useFetchUpbitPrice } from '@/data/hooks';
import { formatKRW, formatNumber } from '@/utils/number';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import Card from '@/components/Card';
import ErrorTag from '@/components/tags/ErrorTag';

type KimchiPremiumSectionProps = {
    krwByUsd: number | null;
    audByUsd: number | null;
}

const KimchiPremiumSection = ({ krwByUsd, audByUsd }: KimchiPremiumSectionProps) => {
  /**
   * 
   * @description upbit data
   */
  const [upbitMarketData] = useAtom(upbitMarketDataAtom);

  const upbitSymbols = useMemo(() => 
    upbitMarketData ? Object.values(upbitMarketData).filter(item => item.market.includes('KRW-')).map(item => item.market.replaceAll('KRW-', '')) : []
  , [upbitMarketData]);

  const { data: upbitPriceData, error: upbitPriceError, isLoading: isUpbitPriceLoading } = useFetchUpbitPrice(upbitSymbols.length > 0 ? 3000 : null, upbitSymbols);

  /**
   * 
   * @description binance data
   */
  const [binanceMarketData] = useAtom(binanceMarketDataAtom);

  const binanceSymbols = upbitSymbols.filter(symbol => binanceMarketData?.[`${symbol}USDT`]);

  const [binancePriceDataInterval, setBinancePriceInterval] = useState<number | null>(3000);
  const { data: binancePriceData, error: binancePriceError, isLoading: isBinancePriceLoading } = useFetchBinacePrice(binanceSymbols.length > 0 ? binancePriceDataInterval : null, binanceSymbols);

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
      const coinMarketCapIdData: CMCIdMapItemApiData | undefined = coinMarketCapIdMap?.[symbol];
      return coinMarketCapIdData ? [...acc, coinMarketCapIdData.id] : acc;
    }, []) ?? [];
  }, [upbitPriceData, coinMarketCapIdMap]);

  useCoinMarketCapMetadataUpdate(coinMarketCapIds);

  const isDataError = useMemo(() => krwByUsd === undefined || upbitPriceError || binancePriceError, [krwByUsd, upbitPriceError, binancePriceError]);

  /**
   * 
   * @description watchlist
   */
  const { watchListSymbols, onToggleWatchList } = useWatchListSymbols();

  /**
   * 
   * @description build table rows
   */
  const premiumTableRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    return upbitPriceData?.data.map(item => {
      const symbol = item.market.replace('KRW-', '');
      const koreanName = upbitMarketData?.[item.market]?.korean_name ?? symbol;
      const symbolLabel = (
        <div className="flex items-center gap-x-2">
          <Coin symbol={symbol} size="sm" />
          <div className="inline-flex items-center gap-x-2 Font_label_14px">{koreanName}<span className="Font_caption_xs text-caption">{symbol}</span></div>
        </div>
      );

      const binanceData = binancePriceData?.data.find(({ symbol: binanceSymbol }) => binanceSymbol.includes(symbol));

      const upbitPrice = item.opening_price;
      const binancePrice = binanceData ? parseFloat(binanceData.openPrice) : undefined;
      const binancePriceKrw = binancePrice ? BigNumber(binancePrice).multipliedBy(krwByUsd ?? 0) : undefined;

      const priceLabel = (
        <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
          <div>{formatKRW(upbitPrice, { fixDp: true })}</div>
          <div className="text-caption">{formatKRW(binancePriceKrw, { fixDp: true })}</div>
        </div>
      );


      const premium = binancePriceKrw?.gt(0) ? BigNumber(upbitPrice).minus(binancePriceKrw).div(binancePriceKrw).multipliedBy(100) : null;
      const premiumLabel = (
        <div className="flex items-center gap-x-1">
          {premium?.gte(10) && <Icon type="fire" size="md" className="text-semantic_danger" />}

          <div className={`inline-flex items-baseline gap-x-0.5 Font_data_16px_num ${premium === null ? 'text-caption' : premium.gt(0) ? 'text-semantic_bull' : 'text-semantic_bear'}`}>
            <span>{formatNumber(premium, 2)}</span>
            {premium !== null && <span className="Font_data_14px_unit">%</span>}
          </div>
        </div>
      );

      const upbitVolume = item.acc_trade_volume_24h;
      const upbitVolumeKrw = BigNumber(item.acc_trade_volume_24h).times(item.opening_price);
      const binanceVolumeUsd = binanceData ? parseFloat(binanceData.quoteVolume) : undefined;
      const binanceVolumeKrw = binanceVolumeUsd ? BigNumber(binanceVolumeUsd).multipliedBy(krwByUsd ?? 0) : undefined;
      const volumeLabel = (
        <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
          <div>{formatKRW(upbitVolumeKrw, { fixDp: true, compact: true })}</div>
          <div className="text-caption">{formatKRW(binanceVolumeKrw, { fixDp: true, compact: true })}</div>
        </div>
      );

      const isWatchList = watchListSymbols.has(symbol);
      const updateWatchListButton = (
        <button type="button" onClick={() => onToggleWatchList(symbol)}>
          <AppSymbolSVG className={`w-4 h-4 ${isWatchList ? 'text-primary' : 'text-caption'}`} />
          <span className="sr-only">즐겨찾기 {isWatchList ? '해제' : '추가'}</span>
        </button>
      )

      return {
        id: item.market,
        symbol: symbol,
        koreanName,
        symbolLabel,
        price: upbitPrice,
        priceLabel,
        premium: premium ?? BigNumber(0),
        premiumLabel,
        volume: upbitVolume,
        volumeLabel,
        isWatchList,
        updateWatchListButton,
      };
    
    }) ?? [];
  }, [krwByUsd, upbitPriceData, binancePriceData, onToggleWatchList, watchListSymbols]);

  const [premiumSearchKeyword, setPremiumSearchKeyword] = useState<string>('');

  const premiumFilteredRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    if (premiumSearchKeyword === '') return premiumTableRows;

    return premiumTableRows.filter(row => {
      return row.symbol.toLowerCase().includes(premiumSearchKeyword.toLowerCase()) || row.koreanName.toLowerCase().includes(premiumSearchKeyword.toLowerCase());
    });
  }, [premiumTableRows, premiumSearchKeyword]);

  /**
   * 
   * @description watchlist table rows
   */
  const watchListTableRows = useMemo(() => premiumTableRows.filter(row => watchListSymbols.has(row.symbol)), [premiumTableRows, watchListSymbols]);

  const [watchListSearchKeyword, setWatchListSearchKeyword] = useState<string>('');

  const watchListFilteredRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    if (watchListSearchKeyword === '') return premiumTableRows;

    return watchListTableRows.filter(row => {
      return row.symbol.toLowerCase().includes(watchListSearchKeyword.toLowerCase()) || row.koreanName.toLowerCase().includes(watchListSearchKeyword.toLowerCase());
    });
  }, [watchListTableRows, watchListSearchKeyword]);

  /**
   * 
   * @description loading
   */
  const isTableLoading = useMemo(() => !upbitMarketData || !binanceMarketData || isUpbitPriceLoading || isBinancePriceLoading, [upbitMarketData, binanceMarketData, isUpbitPriceLoading, isBinancePriceLoading]);

    return (
        <div className="w-full flex flex-col items-center gap-y-20">
          <section className="w-full max-w-app_container space-y-2 px-page_x">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >내 즐겨찾기 {isDataError && <ErrorTag className="ml-2" />}</div>
              
              <div className="flex items-center gap-x-4">
                <ExchangeDropDownPair />
                <TextInput form={null} label="코인 검색" type="search" className="w-80" value={watchListSearchKeyword} onChange={(value, isValid) => setWatchListSearchKeyword(value)}>
                  <TextInput.Icon type="search" />
                </TextInput>
              </div>
            </div>

            <Card color="glass" className="w-full space-y-4">
              <KimchiPremiumTable rows={watchListFilteredRows} isLoading={isTableLoading} />
            </Card>
          </section>

          <section className="w-full max-w-app_container space-y-2 px-page_x">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >김치 프리미엄 {isDataError && <ErrorTag className="ml-2" />}</div>
              
              <div className="flex items-center gap-x-4">
                <ExchangeDropDownPair />
                <TextInput form={null} label="코인 검색" type="search" className="w-80" value={premiumSearchKeyword} onChange={(value, isValid) => setPremiumSearchKeyword(value)}>
                  <TextInput.Icon type="search" />
                </TextInput>
              </div>
            </div>

            <Card color="glass" className="w-full space-y-4">
              <KimchiPremiumTable rows={premiumFilteredRows} isLoading={isTableLoading} />
            </Card>
          </section>
        </div>
    )
}

export default KimchiPremiumSection;