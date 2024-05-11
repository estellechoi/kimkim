'use client';

import TextInput from '@/components/TextInput';
import KimchiPremiumTable, { KimchiPremiumTableRow } from '@/components/tables/KimchiPremiumTable';
import useWatchListSymbols from '@/hooks/useWatchListSymbols';
import ExchangeDropDownPair from '@/components/drop-downs/ExchangeDropDownPair';
import {
  useFetcHtxWalletStatus,
  useFetchBinaceWalletStatus,
  useFetchBitgetPrice,
  useFetchBitgetWalletStatus,
  useFetchBybitPrice,
  useFetchBybitWalletStatus,
  useFetchUpbitPrice,
  useFetchUpbitWalletStatus,
} from '@/data/hooks';
import { useMemo, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { BaseExchange, Exchanges, QuoteExchange } from '@/constants/app';
import useGetPremiumTableRows from '@/hooks/useGetPremiumTableRows';
import {
  BaseExchangePriceData,
  ExchangeWalletData,
  QuoteExchangePriceData,
  getExchangeWalletDataMapFromBinance,
  getExchangeWalletDataMapFromBitget,
  getExchangeWalletDataMapFromBybit,
  getExchangeWalletDataMapFromHtx,
  getExchangeWalletDataMapFromUpbit,
  reduceBaseExchangePriceDataFromUpbit,
  reduceQuoteExchangePriceDataFromBinance,
  reduceQuoteExchangePriceDataFromBitget,
  reduceQuoteExchangePriceDataFromBybit,
  reduceQuoteExchangePriceDataFromHtx,
} from '@/utils/exchange';
import { AxiosError } from 'axios';
import useUpbitPriceData from '@/hooks/useUpbitPriceData';
import useBinancePriceData from '@/hooks/useBinancePriceData';
import useHtxPriceData from '@/hooks/useHtxPriceData';
import useUpbitMarketUpdate from '@/hooks/useUpbitMarketUpdate';
import useCoinMarketCapUpdate from '@/hooks/useCoinMarketCapUpdate';
import Tag from '@/components/Tag';

type KimchiPremiumSectionProps = {
  krwByUsd: number | null;
  audByUsd: number | null;
};

const KimchiPremiumSection = ({ krwByUsd, audByUsd }: KimchiPremiumSectionProps) => {
  const [baseExchange, setBaseExchange] = useState<BaseExchange>(Exchanges.UPBIT);
  const [quoteExchange, setQuoteExchange] = useState<QuoteExchange>(Exchanges.HTX);

  /**
   *
   * @description upbit data
   */
  const { upbitMarketData } = useUpbitMarketUpdate();

  const upbitSymbols = useMemo(() => (upbitMarketData ? Object.keys(upbitMarketData) : []), [upbitMarketData]);

  const fetchUpbitPriceData = baseExchange === Exchanges.UPBIT && upbitSymbols.length > 0;

  const {
    data: upbitPriceData,
    error: upbitPriceError,
    isLoading: isUpbitPriceLoading,
  } = useUpbitPriceData(fetchUpbitPriceData, upbitSymbols);

  const { data: upbitWalletStatusData, error: upbitWalletStatusError } = useFetchUpbitWalletStatus(
    fetchUpbitPriceData ? 0 : null,
  );

  /**
   *
   * @description binance data
   */
  const {
    data: binancePriceData,
    error: binancePriceError,
    isLoading: isBinancePriceLoading,
    queriedSymbols: binanceSymbols,
  } = useBinancePriceData(quoteExchange === Exchanges.BINANCE, upbitSymbols);

  const fetchBinancePriceData = quoteExchange === Exchanges.BINANCE && binanceSymbols.length > 0;
  const { data: binanceWalletStatusData, error: binanceWalletStatusError } = useFetchBinaceWalletStatus(
    fetchBinancePriceData ? 0 : null,
  );

  /**
   * @description htx data
   *
   */
  const fetchHtxPriceData = quoteExchange === Exchanges.HTX;

  const {
    data: htxPriceData,
    error: htxPriceError,
    isLoading: isHtxPriceLoading,
  } = useHtxPriceData(fetchHtxPriceData, upbitSymbols);

  const { data: htxWalletStatusData, error: HtxWalletStatusError } = useFetcHtxWalletStatus(fetchHtxPriceData ? 0 : null);

  /**
   *
   * @description bybit data
   */
  const fetchBybitPriceData = quoteExchange === Exchanges.BYBIT;
  const {
    data: bybitPriceData,
    error: bybitPriceError,
    isLoading: isBybitPriceLoading,
  } = useFetchBybitPrice(fetchBybitPriceData ? 3000 : null);

  const { data: bybitWalletStatusData } = useFetchBybitWalletStatus(fetchBybitPriceData ? 0 : null);

  /**
   *
   * @description bybit data
   */
  const fetchBitgetPriceData = quoteExchange === Exchanges.BITGET;
  const {
    data: bitgetPriceData,
    error: bitgetPriceError,
    isLoading: isBitgetPriceLoading,
  } = useFetchBitgetPrice(fetchBitgetPriceData ? 0 : null);

  const { data: bitgetWalletStatusData } = useFetchBitgetWalletStatus(fetchBitgetPriceData ? 0 : null);

  // console.log('bitgetPriceData', bitgetPriceData)
  // console.log('bitgetPriceError', bitgetPriceError)
  // console.log('bitgetWalletStatusData', bitgetWalletStatusData)

  /**
   *
   * @description setup coin metadata
   */
  useCoinMarketCapUpdate(upbitSymbols);

  /**
   *
   * @description track exchange data error
   */
  const { baseExchangePriceErrorMap, quoteExchangePriceErrorMap } = useMemo(() => {
    const baseExchangePriceErrorMap: Record<BaseExchange, AxiosError | Error | null> = {
      [Exchanges.UPBIT]: upbitPriceError,
    };

    const quoteExchangePriceErrorMap: Record<QuoteExchange, AxiosError | Error | null> = {
      [Exchanges.BINANCE]: binancePriceError,
      [Exchanges.HTX]: htxPriceError,
      [Exchanges.BYBIT]: bybitPriceError,
      [Exchanges.BITGET]: bitgetPriceError,
    };

    return { baseExchangePriceErrorMap, quoteExchangePriceErrorMap };
  }, [upbitPriceError, binancePriceError, htxPriceError, bybitPriceError, bitgetPriceError]);

  const errorDataLabel = useMemo<string | undefined>(() => {
    if (krwByUsd === undefined) return '환율 데이터에 지연이 있어요';
    if (baseExchangePriceErrorMap[baseExchange]) return `${baseExchange} 데이터에 지연이 있어요`;
    if (quoteExchangePriceErrorMap[quoteExchange]) return `${quoteExchange} 데이터에 지연이 있어요`;
    return undefined;
  }, [baseExchange, quoteExchange, baseExchangePriceErrorMap, quoteExchangePriceErrorMap]);

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
      case Exchanges.UPBIT:
        return upbitPriceData?.reduce(reduceBaseExchangePriceDataFromUpbit, []) ?? [];
    }
  }, [baseExchange, upbitPriceData]);

  const mappedQuoteExchangePriceData = useMemo<readonly QuoteExchangePriceData[]>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE:
        return binancePriceData?.reduce(reduceQuoteExchangePriceDataFromBinance, []) ?? [];
      case Exchanges.HTX:
        return htxPriceData?.reduce(reduceQuoteExchangePriceDataFromHtx, []) ?? [];
      case Exchanges.BYBIT:
        return bybitPriceData?.data?.result.list?.reduce(reduceQuoteExchangePriceDataFromBybit, []) ?? [];
      case Exchanges.BITGET:
        return bitgetPriceData?.data?.data.reduce(reduceQuoteExchangePriceDataFromBitget, []) ?? [];
    }
  }, [quoteExchange, binancePriceData, htxPriceData, bybitPriceData?.data?.result, bitgetPriceData?.data]);

  const mappedBaseExchangeWalletData = useMemo<Record<string, readonly ExchangeWalletData[]>>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT:
        return upbitWalletStatusData?.data ? getExchangeWalletDataMapFromUpbit(upbitWalletStatusData.data) : {};
    }
  }, [baseExchange, upbitWalletStatusData]);

  const mappedQuoteExchangeWalletData = useMemo<Record<string, readonly ExchangeWalletData[]>>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE:
        return binanceWalletStatusData?.data ? getExchangeWalletDataMapFromBinance(binanceWalletStatusData.data) : {};
      case Exchanges.HTX:
        return htxWalletStatusData?.data?.data ? getExchangeWalletDataMapFromHtx(htxWalletStatusData.data.data) : {};
      case Exchanges.BYBIT:
        return bybitWalletStatusData?.data?.result.rows
          ? getExchangeWalletDataMapFromBybit(bybitWalletStatusData.data.result.rows)
          : {};
      case Exchanges.BITGET:
        return bitgetWalletStatusData?.data?.data ? getExchangeWalletDataMapFromBitget(bitgetWalletStatusData.data.data) : {};
    }
  }, [quoteExchange, binanceWalletStatusData, htxWalletStatusData, bybitWalletStatusData, bitgetWalletStatusData]);

  const premiumTableRows = useMemo<readonly KimchiPremiumTableRow[]>(
    () =>
      getPremiumTableRows(
        baseExchange,
        quoteExchange,
        mappedBaseExchangePriceData,
        mappedQuoteExchangePriceData,
        mappedBaseExchangeWalletData,
        mappedQuoteExchangeWalletData,
      ),
    [
      baseExchange,
      quoteExchange,
      mappedBaseExchangePriceData,
      mappedQuoteExchangePriceData,
      mappedBaseExchangeWalletData,
      mappedQuoteExchangeWalletData,
      getPremiumTableRows,
    ],
  );

  /**
   *
   * @description filter table rows
   */

  const [premiumSearchKeyword, setPremiumSearchKeyword] = useState<string>('');

  const premiumSearchedRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    if (premiumSearchKeyword === '') return premiumTableRows;

    return premiumTableRows.filter((row) => {
      return (
        row.symbol.toLowerCase().includes(premiumSearchKeyword.toLowerCase()) ||
        row.koreanName.toLowerCase().includes(premiumSearchKeyword.toLowerCase())
      );
    });
  }, [premiumTableRows, premiumSearchKeyword]);

  const [showAllPremiumRows, setShowAllPremiumRows] = useState<boolean>(false);

  const visiblePremiumRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    const premiumBasedSortedRows = [...premiumSearchedRows].sort((a, b) => (a.premium.gt(b.premium) ? -1 : 1));
    return showAllPremiumRows ? premiumBasedSortedRows : premiumBasedSortedRows.slice(0, 15);
  }, [premiumSearchedRows, showAllPremiumRows]);

  const hiddenRowsLength = useMemo<number>(
    () => premiumSearchedRows.length - visiblePremiumRows.length,
    [premiumSearchedRows.length, visiblePremiumRows.length],
  );

  /**
   *
   * @description watchlist table rows
   */
  const watchListTableRows = useMemo(
    () => premiumTableRows.filter((row) => watchListSymbols.has(row.symbol)),
    [premiumTableRows, watchListSymbols],
  );

  const [watchListSearchKeyword, setWatchListSearchKeyword] = useState<string>('');

  const watchListFilteredRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    if (watchListSearchKeyword === '') return premiumTableRows;

    return watchListTableRows.filter((row) => {
      return (
        row.symbol.toLowerCase().includes(watchListSearchKeyword.toLowerCase()) ||
        row.koreanName.toLowerCase().includes(watchListSearchKeyword.toLowerCase())
      );
    });
  }, [watchListTableRows, watchListSearchKeyword]);

  /**
   *
   * @description loading
   */
  const isBaseExchangeDataLoading = useMemo<boolean>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT:
        return !upbitPriceData || isUpbitPriceLoading;
    }
  }, [baseExchange, upbitPriceData, isUpbitPriceLoading]);

  const isQuoteExchangeDataLoading = useMemo<boolean>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE:
        return !binancePriceData || isBinancePriceLoading;
      case Exchanges.HTX:
        return isHtxPriceLoading;
      case Exchanges.BYBIT:
        return isBybitPriceLoading;
      case Exchanges.BITGET:
        return isBitgetPriceLoading;
    }
  }, [quoteExchange, binancePriceData, isBinancePriceLoading, isHtxPriceLoading, isBybitPriceLoading, isBitgetPriceLoading]);

  const isTableLoading = useMemo<boolean>(
    () => isBaseExchangeDataLoading || isQuoteExchangeDataLoading,
    [isBaseExchangeDataLoading, isQuoteExchangeDataLoading],
  );

  return (
    <div className="w-full flex flex-col items-center gap-y-20 px-page_x">
      {watchListTableRows.length > 0 && (
        <section className="w-full max-w-content_max_width space-y-2">
          <div className="flex justify-between items-center gap-x-10">
            <div className="text-caption Font_label_12px p-4">
              내 즐겨찾기 {errorDataLabel && <Tag size="sm" color="warning" label={errorDataLabel} className="ml-2" />}
            </div>

            <div className="flex items-center gap-x-4">
              <ExchangeDropDownPair
                baseExchange={baseExchange}
                onBaseExchangeChange={setBaseExchange}
                quoteExchange={quoteExchange}
                onQuoteExchangeChange={setQuoteExchange}
              />
              <TextInput
                form={null}
                label="코인 검색"
                type="search"
                className="w-80"
                value={watchListSearchKeyword}
                onChange={(value, isValid) => setWatchListSearchKeyword(value)}>
                <TextInput.Icon type="search" />
              </TextInput>
            </div>
          </div>

          <Card color="glass" className="w-full space-y-4">
            <KimchiPremiumTable rows={watchListFilteredRows} isLoading={isTableLoading} />
          </Card>
        </section>
      )}

      <section className="w-full max-w-content_max_width">
        <div className="flex justify-between items-center gap-x-10">
          <div className="text-caption Font_label_12px p-4">
            김치 프리미엄 {errorDataLabel && <Tag size="sm" color="warning" label={errorDataLabel} className="ml-2" />}
          </div>

          <div className="flex items-center gap-x-4">
            <ExchangeDropDownPair
              baseExchange={baseExchange}
              onBaseExchangeChange={setBaseExchange}
              quoteExchange={quoteExchange}
              onQuoteExchangeChange={setQuoteExchange}
            />
            <TextInput
              form={null}
              label="코인 검색"
              type="search"
              className="w-80"
              value={premiumSearchKeyword}
              onChange={(value, isValid) => setPremiumSearchKeyword(value)}>
              <TextInput.Icon type="search" />
            </TextInput>
          </div>
        </div>

        <Card color="glass" className="w-full space-y-4 mt-2">
          <KimchiPremiumTable rows={visiblePremiumRows} isLoading={isTableLoading} />
        </Card>

        {(showAllPremiumRows || hiddenRowsLength > 0) && (
          <div className="flex justify-center mt-4">
            <Button
              color="body"
              type="outline"
              size="sm"
              iconType={showAllPremiumRows ? 'expand_less' : 'expand_more'}
              label={`${hiddenRowsLength}개 더보기`}
              labelHidden={showAllPremiumRows}
              onClick={() => setShowAllPremiumRows(!showAllPremiumRows)}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default KimchiPremiumSection;
