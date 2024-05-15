'use client';

import TextInput from '@/components/TextInput';
import KimchiPremiumTable, { KimchiPremiumTableRow } from '@/components/kits/KimchiPremiumTable';
import useWatchListSymbols from '@/hooks/useWatchListSymbols';
import ExchangeDropDownPair from '@/components/kits/ExchangeDropDownPair';
import {
  useFetcHtxWalletStatus,
  useFetchBinaceWalletStatus,
  useFetchBitgetWalletStatus,
  useFetchBybitPrice,
  useFetchBybitWalletStatus,
  useFetchUpbitWalletStatus,
} from '@/data/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  getExchangeWalletDataMapFromBithumb,
  getExchangeWalletDataMapFromBybit,
  getExchangeWalletDataMapFromHtx,
  getExchangeWalletDataMapFromUpbit,
  reduceBaseExchangePriceDataFromBithumb,
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
import useCoinMarketCapUpdate from '@/hooks/useCoinMarketCapUpdate';
import Tag from '@/components/Tag';
import useBithumbPriceData from '@/hooks/useBithumbPriceData';
import useBithumbWalletStatus from '@/hooks/useBithumbWalletStatus';
import useBitgetPriceData from '@/hooks/useBitgetPriceData';
import IconButton from '@/components/IconButton';
import useAnalytics from '@/hooks/useAnalytics';
import { EventCategory } from '@/analytics/constants';
import ForexPopover from '@/components/kits/ForexPopover';
import VolumeMatch from '@/components/kits/VolumeMatch';

type KimchiPremiumSectionProps = {
  krwByUsd: number | null;
  audByUsd: number | null;
  className?: string;
};

const KimchiPremiumSection = ({ krwByUsd, audByUsd, className = '' }: KimchiPremiumSectionProps) => {
  const [baseExchange, setBaseExchange] = useState<BaseExchange>(Exchanges.UPBIT);
  const [quoteExchange, setQuoteExchange] = useState<QuoteExchange>(Exchanges.BINANCE);

  const { sendEvent } = useAnalytics();

  const onChangeBaseExchange = useCallback(
    (exchange: BaseExchange) => {
      setBaseExchange(exchange);
      sendEvent(EventCategory.CHANGE_BASE_EXCHANGE, exchange);
    },
    [sendEvent],
  );

  const onChangeQuoteExchange = useCallback(
    (exchange: QuoteExchange) => {
      setQuoteExchange(exchange);
      sendEvent(EventCategory.CHANGE_QUOTE_EXCHANGE, exchange);
    },
    [sendEvent],
  );

  /**
   *
   * @description upbit data
   */
  const fetchUpbitPriceData = baseExchange === Exchanges.UPBIT;

  const {
    data: upbitPriceData,
    error: upbitPriceError,
    isLoading: isUpbitPriceLoading,
    symbols: upbitSymbols,
  } = useUpbitPriceData(fetchUpbitPriceData);

  const { data: upbitWalletStatusData, error: upbitWalletStatusError } = useFetchUpbitWalletStatus(
    fetchUpbitPriceData ? 0 : null,
  );

  /**
   *
   * @description bithumb data
   */
  const fetchBithumbPriceData = baseExchange === Exchanges.BITHUMB;

  const {
    data: bithumbPriceData,
    error: bithumbPriceError,
    isLoading: isBithumbPriceLoading,
    symbols: bithumbSymbols,
  } = useBithumbPriceData(fetchBithumbPriceData);

  const { data: bithumbWalletStatusData, error: bithumbWalletStatusError } = useBithumbWalletStatus(fetchBithumbPriceData);

  const symbols = useMemo<readonly string[]>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT:
        return upbitSymbols;
      case Exchanges.BITHUMB:
        return bithumbSymbols;
    }
  }, [baseExchange, upbitSymbols, bithumbSymbols]);
  /**
   *
   * @description binance data
   */
  const {
    data: binancePriceData,
    error: binancePriceError,
    isLoading: isBinancePriceLoading,
    queriedSymbols: binanceSymbols,
  } = useBinancePriceData(quoteExchange === Exchanges.BINANCE, symbols);

  const fetchBinancePriceData = quoteExchange === Exchanges.BINANCE && binanceSymbols.length > 0;
  const { data: binanceWalletStatusData, error: binanceWalletStatusError } = useFetchBinaceWalletStatus(
    fetchBinancePriceData ? 0 : null,
  );

  /**
   * @description htx data
   *
   */
  const fetchHtxPriceData = quoteExchange === Exchanges.HTX;

  const { data: htxPriceData, error: htxPriceError, isLoading: isHtxPriceLoading } = useHtxPriceData(fetchHtxPriceData, symbols);

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
  } = useFetchBybitPrice(fetchBybitPriceData ? 6000 : null);

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
  } = useBitgetPriceData(fetchBitgetPriceData, symbols);

  const { data: bitgetWalletStatusData } = useFetchBitgetWalletStatus(fetchBitgetPriceData ? 0 : null);

  /**
   *
   * @description setup coin metadata
   */
  useCoinMarketCapUpdate(symbols);

  /**
   *
   * @description track exchange data error
   */
  const { baseExchangePriceErrorMap, quoteExchangePriceErrorMap } = useMemo(() => {
    const baseExchangePriceErrorMap: Record<BaseExchange, AxiosError | Error | null> = {
      [Exchanges.UPBIT]: upbitPriceError,
      [Exchanges.BITHUMB]: bithumbPriceError,
    };

    const quoteExchangePriceErrorMap: Record<QuoteExchange, AxiosError | Error | null> = {
      [Exchanges.BINANCE]: binancePriceError,
      [Exchanges.HTX]: htxPriceError,
      [Exchanges.BYBIT]: bybitPriceError,
      [Exchanges.BITGET]: bitgetPriceError,
    };

    return { baseExchangePriceErrorMap, quoteExchangePriceErrorMap };
  }, [upbitPriceError, bithumbPriceError, binancePriceError, htxPriceError, bybitPriceError, bitgetPriceError]);

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
  const { watchListSymbols, onToggleWatchList, clearWatchList } = useWatchListSymbols();

  const onClickClearWatchList = useCallback(() => {
    clearWatchList();
    sendEvent(EventCategory.CLICK_BUTTON, 'Clear watchlist');
  }, [clearWatchList, sendEvent]);

  /**
   *
   * @description build table rows
   */
  const { getPremiumTableRows } = useGetPremiumTableRows({ watchListSymbols, onToggleWatchList, krwByUsd, audByUsd });

  const mappedBaseExchangePriceData = useMemo<readonly BaseExchangePriceData[]>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT:
        return upbitPriceData?.reduce(reduceBaseExchangePriceDataFromUpbit, []) ?? [];
      case Exchanges.BITHUMB:
        return bithumbPriceData?.reduce(reduceBaseExchangePriceDataFromBithumb, []) ?? [];
    }
  }, [baseExchange, upbitPriceData, bithumbPriceData]);

  const mappedQuoteExchangePriceData = useMemo<readonly QuoteExchangePriceData[]>(() => {
    switch (quoteExchange) {
      case Exchanges.BINANCE:
        return binancePriceData?.reduce(reduceQuoteExchangePriceDataFromBinance, []) ?? [];
      case Exchanges.HTX:
        return htxPriceData?.reduce(reduceQuoteExchangePriceDataFromHtx, []) ?? [];
      case Exchanges.BYBIT:
        return bybitPriceData?.data?.result.list?.reduce(reduceQuoteExchangePriceDataFromBybit, []) ?? [];
      case Exchanges.BITGET:
        return bitgetPriceData?.reduce(reduceQuoteExchangePriceDataFromBitget, []) ?? [];
    }
  }, [quoteExchange, binancePriceData, htxPriceData, bybitPriceData?.data?.result, bitgetPriceData]);

  const mappedBaseExchangeWalletData = useMemo<Record<string, readonly ExchangeWalletData[]>>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT:
        return upbitWalletStatusData?.data ? getExchangeWalletDataMapFromUpbit(upbitWalletStatusData.data) : {};
      case Exchanges.BITHUMB:
        return bithumbWalletStatusData ? getExchangeWalletDataMapFromBithumb(bithumbWalletStatusData) : {};
    }
  }, [baseExchange, upbitWalletStatusData, bithumbWalletStatusData]);

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

  useEffect(() => {
    sendEvent(EventCategory.SEARCH, premiumSearchKeyword, 'Kimchi premium table search');
  }, [premiumSearchKeyword]);

  const searchedRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    if (premiumSearchKeyword === '') return premiumTableRows;

    return premiumTableRows.filter((row) => {
      return (
        row.symbol.toLowerCase().includes(premiumSearchKeyword.toLowerCase()) ||
        row.koreanName.toLowerCase().includes(premiumSearchKeyword.toLowerCase())
      );
    });
  }, [premiumTableRows, premiumSearchKeyword]);

  const [showAllPremiumRows, setShowAllPremiumRows] = useState<boolean>(false);

  const visibleRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    return showAllPremiumRows ? searchedRows : searchedRows.slice(0, 15);
  }, [searchedRows, showAllPremiumRows]);

  const hiddenRowsLength = useMemo<number>(
    () => searchedRows.length - visibleRows.length,
    [searchedRows.length, visibleRows.length],
  );

  /**
   *
   * @description filter watchlist rows
   */
  const watchlistRows = useMemo<readonly KimchiPremiumTableRow[]>(() => {
    return premiumTableRows.filter((row) => watchListSymbols.has(row.symbol));
  }, [premiumTableRows, watchListSymbols]);

  /**
   *
   * @description loading
   */
  const isBaseExchangeDataLoading = useMemo<boolean>(() => {
    switch (baseExchange) {
      case Exchanges.UPBIT:
        return !upbitPriceData || isUpbitPriceLoading;
      case Exchanges.BITHUMB:
        return !bithumbPriceData || isBithumbPriceLoading;
    }
  }, [baseExchange, upbitPriceData, isUpbitPriceLoading, bithumbPriceData, isBithumbPriceLoading]);

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

  const onSortKimchiPremiumTable = useCallback(
    (isAsc: boolean, sortValue: string) => {
      sendEvent(EventCategory.SORT_TABLE, `${sortValue} by ${isAsc ? 'asc' : 'desc'}`, 'Kimchi premium table');
    },
    [sendEvent],
  );

  return (
    <div className={`w-full max-w-content_max_width mx-auto flex flex-col items-center gap-y-0 ${className}`}>
      <div className="w-full flex gap-2 md:gap-4 px-4 md:justify-end items-center md:pr-0.5 animate-fade_in_x_reverse mb-5">
        <ExchangeDropDownPair
          baseExchange={baseExchange}
          onBaseExchangeChange={onChangeBaseExchange}
          quoteExchange={quoteExchange}
          onQuoteExchangeChange={onChangeQuoteExchange}
          className="md:order-2"
        />
        <ForexPopover id="forex-popover-at-home" className="grow-0 shrink-0 basis-auto" />
      </div>

      {watchlistRows.length > 0 && (
        <section className="w-full animate-fade_in_x_reverse mb-10">
          <div className="flex justify-between items-center gap-4 pr-0.5">
            <div className="text-caption Font_label_12px px-4 py-4 md:py-0">
              관심 코인 {errorDataLabel && <Tag size="sm" color="warning" label={errorDataLabel} className="ml-2" />}
            </div>

            <IconButton iconType="delete" className="text-caption" label="모두 지우기" onClick={onClickClearWatchList} />
          </div>

          <Card color="glass" className="w-full space-y-4 mt-2">
            <KimchiPremiumTable rows={watchlistRows} isLoading={isTableLoading} />
          </Card>
        </section>
      )}

      {watchlistRows.length > 0 && (
        <section className="w-full animate-fade_in_x_reverse mb-10">
          <div className="text-caption Font_label_12px px-4 py-4 md:py-0">관심 코인 추세</div>

          <Card color="glass" className="w-full px-4 pt-6 py-5 mt-5">
            <ul className="flex flex-col items-stretch gap-y-5">
              {Array.from(watchListSymbols).map((symbol) => (
                <VolumeMatch key={symbol} exchange={baseExchange} symbol={symbol} />
              ))}
            </ul>
          </Card>
        </section>
      )}

      <section className="w-full animate-fade_in_x_reverse">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-10 md:items-center">
          <div className="text-caption Font_label_12px px-4 py-4 md:py-0">
            김치 프리미엄 {errorDataLabel && <Tag size="sm" color="warning" label={errorDataLabel} className="ml-2" />}
          </div>

          <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:p-0">
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
          <KimchiPremiumTable rows={visibleRows} isLoading={isTableLoading} onSort={onSortKimchiPremiumTable} />
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
