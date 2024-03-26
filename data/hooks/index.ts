import axios, { AxiosError, type AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import type { BinanceMarketApiData, BinanceTickerApiData, ExchangeRateApiData } from "./types";
import type { UpbitTickerApiData } from "@/pages/api/upbit/ticker";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { CMCIdMapItemApiData } from "@/pages/api/cmc/idmap";
import { CMCMetadataItemData } from "@/pages/api/cmc/metadata";
import { CMCResponse } from "@/pages/api/cmc";
import { Fiats } from "@/constants/app";
import { CoinGeckoCoinApiData } from "@/pages/api/coingecko/coins";
import { CoinGeckoCoinPriceApiData } from "@/pages/api/coingecko/prices";
import { HtxMarketApiData } from "@/pages/api/htx/ticker";


/**
 * 
 * @description exchange rate api fetching
 */
export const useFetchExchangeRate = (refetchInterval: number | null, baseCurrency?: Fiats.USD | Fiats.KRW) => {
    const currency = baseCurrency ?? Fiats.USD;
    const queryKey = ['fetchExchangeRate', currency];

    return useQuery<AxiosResponse<ExchangeRateApiData>, AxiosError>({
        queryFn: () => axios.get<ExchangeRateApiData>(`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/${currency}`),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
}

/**
 * 
 * @description coin market cap api fetching
 */
export const useFetchCoinMarketCapIdMap = (refetchInterval: number | null) => {
    const queryKey = ['fetchCoinMarketCapIdMap'];

    return useQuery<AxiosResponse<CMCResponse<readonly CMCIdMapItemApiData[]>>, AxiosError>({
        queryFn: () => axios.get<CMCResponse<readonly CMCIdMapItemApiData[]>>('/api/cmc/idmap'),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

export const useFetchCoinMarketCapMetadata = (refetchInterval: number | null, ids?: readonly number[]) => {
    const id = ids?.join(',');
    const options = id ? { params: { id } } : undefined;
    const queryKey = ['fetchCoinMarketCapListings', id];

    return useQuery<AxiosResponse<CMCResponse<{ [id: string]: CMCMetadataItemData }>>, AxiosError>({
        queryFn: () => axios.get<CMCResponse<{ [id: string]: CMCMetadataItemData }>>('/api/cmc/metadata', options),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

/**
 * 
 * @description coingecko api fetching
 */
export const useFetchCoinGeckoCoinIds = (refetchInterval: number | null) => {
    const queryKey = ['fetchCoinGeckoCoinIds'];

    return useQuery<AxiosResponse<readonly CoinGeckoCoinApiData[]>, AxiosError>({
        queryFn: () => axios.get<readonly CoinGeckoCoinApiData[]>('/api/coingecko/coins'),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

export const useFetchCoinGeckoCoins = (refetchInterval: number | null, ids?: readonly string[]) => {
    const idsJoint = ids?.join(',');
    const options = { params: { ids: idsJoint ? `${idsJoint},tether` : 'tether' } };
    const queryKey = ['fetchCoinGeckoCoins', idsJoint];

    return useQuery<AxiosResponse<readonly CoinGeckoCoinPriceApiData[]>, AxiosError>({
        queryFn: () => axios.get<readonly CoinGeckoCoinPriceApiData[]>('/api/coingecko/prices', options),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

/**
 * 
 * @description upbit open api fetching
 */
export const useFetchUpbitMarket = (refetchInterval: number | null) => {
    const queryKey = ['fetchUpbitMarket'];

    return useQuery<AxiosResponse<readonly UpbitMarketApiData[]>, AxiosError>({
        queryFn: () => axios.get<readonly UpbitMarketApiData[]>('/api/upbit/market'),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

export const useFetchUpbitPrice = (refetchInterval: number | null, symbols: readonly string[]) => {
    const marketsJoint = symbols.map(symbol => `KRW-${symbol}`).join(',');
    const queryKey = ['fetchUpbitPrice', marketsJoint];

    return useQuery<AxiosResponse<readonly UpbitTickerApiData[]>, AxiosError>({
        queryFn: () => axios.get<readonly UpbitTickerApiData[]>('/api/upbit/ticker', { params: { markets: marketsJoint } }),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

/**
 * 
 * @description binance api fetching
 */
const binanceAxiosClient = axios.create({
    baseURL: 'https://api.binance.com',
});

export const useFetchBinaceMarket = (refetchInterval: number | null) => {
    const queryKey = ['fetchBinanceMarket'];

    return useQuery<AxiosResponse<BinanceMarketApiData>, AxiosError>({
        queryFn: () => binanceAxiosClient.get<BinanceMarketApiData>(`/api/v3/exchangeInfo`),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

export const useFetchBinacePrice = (refetchInterval: number | null, symbols: readonly string[]) => {
    const marketsJoint = symbols.map(symbol => `"${symbol}USDT"`).join(',');
    const queryKey = ['fetchBinancePrice', marketsJoint];

    return useQuery<AxiosResponse<readonly BinanceTickerApiData[]>, AxiosError>({
        queryFn: () => binanceAxiosClient.get<readonly BinanceTickerApiData[]>(`/api/v3/ticker?symbols=[${marketsJoint}]`),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};

/**
 * 
 * @description htx api fetching
 */

export const useFetcHtxPrice = (refetchInterval: number | null) => {
    const queryKey = ['fetcHtxPrice'];

    return useQuery<AxiosResponse<readonly HtxMarketApiData[]>, AxiosError>({
        queryFn: () => axios.get<readonly HtxMarketApiData[]>('/api/htx/ticker'),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};