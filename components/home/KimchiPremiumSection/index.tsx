'use client';

import TextInput from '@/components/TextInput';
import KimchiPremiumTable, { KimchiPremiumTableRow } from '@/components/tables/KimchiPremiumTable';
import useWatchListSymbols from '@/hooks/useWatchListSymbols';
import ExchangeDropDownPair from '@/components/drop-downs/ExchangeDropDownPair';
import { binanceMarketDataAtom, coinGeckoCoinIdMapAtom, upbitMarketDataAtom } from '@/store/states';
import { useFetcHtxPrice, useFetcHtxWalletStatus, useFetchBinacePrice, useFetchBinaceSystemStatus, useFetchBinaceWalletStatus, useFetchBitgetPrice, useFetchBitgetWalletStatus, useFetchBybitPrice, useFetchBybitWalletStatus, useFetchUpbitPrice, useFetchUpbitWalletStatus } from '@/data/hooks';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/Card';
import ExchangeDataWarningTag from '@/components/tags/ExchangeDataWarningTag';
import { CoinGeckoCoinApiData } from '@/pages/api/coingecko/coins';
import useCoinGeckoPriceUpdate from '@/hooks/useCoinGeckoPriceUpdate';
import Button from '@/components/Button';
import { BaseExchange, Exchanges, QuoteExchange } from '@/constants/app';
import useGetPremiumTableRows from '@/hooks/useGetPremiumTableRows';
import { BaseExchangePriceData, ExchangeWalletData, QuoteExchangePriceData, getExchangeWalletDataMapFromBinance, getExchangeWalletDataMapFromBitget, getExchangeWalletDataMapFromBybit, getExchangeWalletDataMapFromHtx, getExchangeWalletDataMapFromUpbit, reduceBaseExchangePriceDataFromUpbit, reduceQuoteExchangePriceDataFromBinance, reduceQuoteExchangePriceDataFromBitget, reduceQuoteExchangePriceDataFromBybit, reduceQuoteExchangePriceDataFromHtx } from '@/utils/exchange';
import { AxiosError } from 'axios';

type KimchiPremiumSectionProps = {
    krwByUsd: number | null;
    audByUsd: number | null;
}

const KimchiPremiumSection = ({ krwByUsd, audByUsd }: KimchiPremiumSectionProps) => {
  const [baseExchange, setBaseExchange] = useState<BaseExchange>(Exchanges.UPBIT);
  const [quoteExchange, setQuoteExchange] = useState<QuoteExchange>(Exchanges.HTX);

  /**
   * 
   * @description upbit data
   */
  const [upbitMarketData] = useAtom(upbitMarketDataAtom);
  const upbitSymbols = useMemo(() => 
    upbitMarketData ? Object.keys(upbitMarketData) : []
  , [upbitMarketData]);

  const fetchUpbitPriceData = baseExchange === Exchanges.UPBIT && upbitSymbols.length > 0;
  const { data: upbitPriceData, error: upbitPriceError, isLoading: isUpbitPriceLoading } = useFetchUpbitPrice(fetchUpbitPriceData ? 3000 : null, upbitSymbols);

  const { data: upbitWalletStatusData, error: upbitWalletStatusError } = useFetchUpbitWalletStatus(fetchUpbitPriceData ? 0 : null);

  /**
   * 
   * @description binance data
   */
  const [binanceMarketData] = useAtom(binanceMarketDataAtom);
  const binanceSymbols = upbitSymbols.filter(symbol => binanceMarketData?.[symbol]);

  const [binancePriceDataInterval, setBinancePriceInterval] = useState<number | null>(3000);

  const fetchBinancePriceData = quoteExchange === Exchanges.BINANCE && binanceSymbols.length > 0;
  const { data: binancePriceData, error: binancePriceError, isLoading: isBinancePriceLoading } = useFetchBinacePrice(fetchBinancePriceData ? binancePriceDataInterval : null, binanceSymbols);

  // const { data: binanceSystemStatusData } = useFetchBinaceSystemStatus(0);
  const { data: binanceWalletStatusData, error: binanceWalletStatusError } = useFetchBinaceWalletStatus(fetchBinancePriceData ? 0 : null);

  useEffect(() => {
    let retryTimer: NodeJS.Timeout;

    if (binancePriceError?.response?.status === 429 || binancePriceError?.response?.status === 418 || binanceWalletStatusError?.response?.status === 429 || binanceWalletStatusError?.response?.status === 418) {
      setBinancePriceInterval(null);
      const retryAfter = binancePriceError?.response?.headers['Retry-After'];
      retryTimer = setTimeout(() => setBinancePriceInterval(3000), parseInt(retryAfter) * 1000);
    }

    return () => clearTimeout(retryTimer);
  }, [binancePriceError?.response, binanceWalletStatusError?.response]);

  /**
   * @description htx data 
   * 
   */
  const fetchHtxPriceData = quoteExchange === Exchanges.HTX;
  const { data: htxPriceData, error: htxPriceError, isLoading: isHtxPriceLoading } = useFetcHtxPrice(fetchHtxPriceData ? 3000 : null);

  const { data: htxWalletStatusData, error: HtxWalletStatusError } = useFetcHtxWalletStatus(fetchHtxPriceData ? 0 : null);

  /**
   * 
   * @description bybit data
   */
  const fetchBybitPriceData = quoteExchange === Exchanges.BYBIT;
  const { data: bybitPriceData, error: bybitPriceError, isLoading: isBybitPriceLoading } = useFetchBybitPrice(fetchBybitPriceData ? 3000 : null);
  
  const { data: bybitWalletStatusData } = useFetchBybitWalletStatus(fetchBybitPriceData ? 0 : null);

  /**
   * 
   * @description bybit data
   */
  const fetchBitgetPriceData = quoteExchange === Exchanges.BITGET;
  const { data: bitgetPriceData, error: bitgetPriceError, isLoading: isBitgetPriceLoading } = useFetchBitgetPrice(fetchBitgetPriceData ? 0 : null);
  
  const { data: bitgetWalletStatusData } = useFetchBitgetWalletStatus(fetchBitgetPriceData ? 0 : null);

  // console.log('bitgetPriceData', bitgetPriceData)
  // console.log('bitgetPriceError', bitgetPriceError)
  // console.log('bitgetWalletStatusData', bitgetWalletStatusData)

  /**
   * 
   * @description setup coin metadata
   */
  const [coinGeckoCoinIdMap] = useAtom(coinGeckoCoinIdMapAtom);
  
  const baseExchangeSymbols = upbitSymbols;

  const coinGeckoCoinIds = useMemo<readonly string[]>(() => {
    return baseExchangeSymbols.reduce<readonly string[]>((acc, symbol) => {
      const coinGeckoCoinIdData: CoinGeckoCoinApiData | undefined = coinGeckoCoinIdMap?.[symbol];
      return coinGeckoCoinIdData ? [...acc, coinGeckoCoinIdData.id] : acc;
    }, []) ?? [];
  }, [baseExchangeSymbols, coinGeckoCoinIdMap]);

  useCoinGeckoPriceUpdate(coinGeckoCoinIds);

  /**
   * 
   * @description track exchange data error
   */
  const { baseExchangePriceErrorMap, quoteExchangePriceErrorMap } = useMemo(() => {
    const baseExchangePriceErrorMap: Record<BaseExchange, AxiosError | null> = {
      [Exchanges.UPBIT]: upbitPriceError,
    }

    const quoteExchangePriceErrorMap: Record<QuoteExchange, AxiosError | null> = {
      [Exchanges.BINANCE]: binancePriceError,
      [Exchanges.HTX]: htxPriceError,
      [Exchanges.BYBIT]: bybitPriceError,
      [Exchanges.BITGET]: bitgetPriceError,
    }

    return { baseExchangePriceErrorMap, quoteExchangePriceErrorMap };
  }, [upbitPriceError, binancePriceError, htxPriceError, bybitPriceError, bitgetPriceError]);

  const isDataError = useMemo(() => {
    return krwByUsd === undefined || baseExchangePriceErrorMap[baseExchange] || quoteExchangePriceErrorMap[quoteExchange];
  }, [krwByUsd, baseExchange, quoteExchange, baseExchangePriceErrorMap, quoteExchangePriceErrorMap]);

  /**
   * 
   * @description watchlist
   */
  const { watchListSymbols, onToggleWatchList } = useWatchListSymbols();

  /**
   * 
   * @description build table rows
   */
  const { getPremiumTableRows } = useGetPremiumTableRows({ watchListSymbols, onToggleWatchList, krwByUsd, audByUsd });

  const mappedBaseExchangePriceData = useMemo<readonly BaseExchangePriceData[]>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT: return upbitPriceData?.data?.reduce(reduceBaseExchangePriceDataFromUpbit, []) ?? [];
    }
  }, [baseExchange, upbitPriceData]);

  const mappedQuoteExchangePriceData = useMemo<readonly QuoteExchangePriceData[]>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE: return binancePriceData?.data?.reduce(reduceQuoteExchangePriceDataFromBinance, []) ?? [];
      case Exchanges.HTX: return htxPriceData?.data?.data?.reduce(reduceQuoteExchangePriceDataFromHtx, []) ?? [];
      case Exchanges.BYBIT: return bybitPriceData?.data?.result.list?.reduce(reduceQuoteExchangePriceDataFromBybit, []) ?? [];
      case Exchanges.BITGET: return bitgetPriceData?.data?.data.reduce(reduceQuoteExchangePriceDataFromBitget, []) ?? [];

    }
  }, [quoteExchange, binancePriceData, htxPriceData?.data, bybitPriceData?.data?.result, bitgetPriceData?.data]);


  const mappedBaseExchangeWalletData = useMemo<Record<string, readonly ExchangeWalletData[]>>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT: return upbitWalletStatusData?.data ? getExchangeWalletDataMapFromUpbit(upbitWalletStatusData.data) : {};
    }
  }, [baseExchange, upbitWalletStatusData]);

  const mappedQuoteExchangeWalletData = useMemo<Record<string, readonly ExchangeWalletData[]>>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE: return binanceWalletStatusData?.data ? getExchangeWalletDataMapFromBinance(binanceWalletStatusData.data) : {};
      case Exchanges.HTX: return htxWalletStatusData?.data?.data ? getExchangeWalletDataMapFromHtx(htxWalletStatusData.data.data) : {};
      case Exchanges.BYBIT: return bybitWalletStatusData?.data?.result.rows ? getExchangeWalletDataMapFromBybit(bybitWalletStatusData.data.result.rows) : {};
      case Exchanges.BITGET: return bitgetWalletStatusData?.data?.data ? getExchangeWalletDataMapFromBitget(bitgetWalletStatusData.data.data) : {};
    }
  }, [quoteExchange, binanceWalletStatusData, htxWalletStatusData, bybitWalletStatusData, bitgetWalletStatusData]);

  const premiumTableRows = useMemo<readonly KimchiPremiumTableRow[]>(() => 
    getPremiumTableRows(baseExchange, quoteExchange, mappedBaseExchangePriceData, mappedQuoteExchangePriceData, mappedBaseExchangeWalletData, mappedQuoteExchangeWalletData)
  , [baseExchange, quoteExchange, mappedBaseExchangePriceData, mappedQuoteExchangePriceData, mappedBaseExchangeWalletData, mappedQuoteExchangeWalletData, getPremiumTableRows]);

  /**
   * 
   * @description filter table rows
   */
  const [showAllPremiumRows, setShowAllPremiumRows] = useState<boolean>(false);

  const usingPremiumRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    const premiumBasedSortedRows = [...premiumTableRows].sort((a, b) => a.premium.gt(b.premium) ? -1 : 1);
    return showAllPremiumRows ? premiumBasedSortedRows : premiumBasedSortedRows.slice(0, 15);
  }, [premiumTableRows, showAllPremiumRows]);

  const hiddenRowsLength = useMemo<number>(() => premiumTableRows.length - usingPremiumRows.length, [premiumTableRows.length, usingPremiumRows.length]);

  const [premiumSearchKeyword, setPremiumSearchKeyword] = useState<string>('');

  const premiumFilteredRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {

    if (premiumSearchKeyword === '') return usingPremiumRows;

    return usingPremiumRows.filter(row => {
      return row.symbol.toLowerCase().includes(premiumSearchKeyword.toLowerCase()) || row.koreanName.toLowerCase().includes(premiumSearchKeyword.toLowerCase());
    });
  }, [showAllPremiumRows, usingPremiumRows, premiumSearchKeyword]);

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
  const isBaseExchangeDataLoading = useMemo<boolean>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT: return !upbitPriceData || isUpbitPriceLoading;
    }
  }, [baseExchange, upbitPriceData, isUpbitPriceLoading]);

  const isQuoteExchangeDataLoading = useMemo<boolean>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE: return !binancePriceData || isBinancePriceLoading;
      case Exchanges.HTX: return isHtxPriceLoading;
      case Exchanges.BYBIT: return isBybitPriceLoading;
      case Exchanges.BITGET: return isBitgetPriceLoading;
    }
  }, [quoteExchange, binancePriceData, isBinancePriceLoading, isHtxPriceLoading, isBybitPriceLoading, isBitgetPriceLoading]);

  const isTableLoading = useMemo<boolean>(() => isBaseExchangeDataLoading || isQuoteExchangeDataLoading, [isBaseExchangeDataLoading, isQuoteExchangeDataLoading]);

    return (
        <div className="w-full flex flex-col items-center gap-y-20">
          {watchListTableRows.length > 0 && <section className="w-full max-w-app_container space-y-2 px-page_x">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >내 즐겨찾기 {isDataError && <ExchangeDataWarningTag className="ml-2" />}</div>
              
              <div className="flex items-center gap-x-4">
                <ExchangeDropDownPair baseExchange={baseExchange} onBaseExchangeChange={setBaseExchange} quoteExchange={quoteExchange} onQuoteExchangeChange={setQuoteExchange} />
                <TextInput form={null} label="코인 검색" type="search" className="w-80" value={watchListSearchKeyword} onChange={(value, isValid) => setWatchListSearchKeyword(value)}>
                  <TextInput.Icon type="search" />
                </TextInput>
              </div>
            </div>

            <Card color="glass" className="w-full space-y-4">
              <KimchiPremiumTable rows={watchListFilteredRows} isLoading={isTableLoading} />
            </Card>
          </section>}

          <section className="w-full max-w-app_container space-y-2 px-page_x">
            <div className="flex justify-between items-center gap-x-10">
              <div className="text-caption Font_label_12px p-4" >김치 프리미엄 {isDataError && <ExchangeDataWarningTag className="ml-2" />}</div>
              
              <div className="flex items-center gap-x-4">
                <ExchangeDropDownPair baseExchange={baseExchange} onBaseExchangeChange={setBaseExchange} quoteExchange={quoteExchange} onQuoteExchangeChange={setQuoteExchange} />
                <TextInput form={null} label="코인 검색" type="search" className="w-80" value={premiumSearchKeyword} onChange={(value, isValid) => setPremiumSearchKeyword(value)}>
                  <TextInput.Icon type="search" />
                </TextInput>
              </div>
            </div>

            <Card color="glass" className="w-full space-y-4">
              <KimchiPremiumTable rows={premiumFilteredRows} isLoading={isTableLoading} />
            </Card>

            {hiddenRowsLength > 0 && <div className="flex justify-center">
              <Button color="body" size="sm" iconType={showAllPremiumRows ? 'expand_less' : 'expand_more'} label={`${hiddenRowsLength}개 더보기`} onClick={() => setShowAllPremiumRows(!showAllPremiumRows)} />
            </div>}
          </section>
        </div>
    )
}

export default KimchiPremiumSection;