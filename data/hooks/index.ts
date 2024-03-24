import axios, { AxiosError, type AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import type { BinanceTickerApiData, ExchangeRateApiData } from "./types";
import type { UpbitTickerApiData } from "@/pages/api/upbit/ticker";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { CMCIdMapItemApiData } from "@/pages/api/cmc/idmap";
import { CMCMetadataItemData } from "@/pages/api/cmc/metadata";
import { CMCResponse } from "@/pages/api/cmc";
import { Fiats } from "@/constants/app";


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

export const useFetchUpbitPrice = (refetchInterval: number | null) => {
    const queryKey = ['fetchUpbitPrice'];

    return useQuery<AxiosResponse<readonly UpbitTickerApiData[]>, AxiosError>({
        queryFn: () => axios.get<readonly UpbitTickerApiData[]>('/api/upbit/ticker'),
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
export const useFetchBinacePrice = (refetchInterval: number | null) => {
    const queryKey = ['fetchBinancePrice'];

    return useQuery<AxiosResponse<readonly BinanceTickerApiData[]>, AxiosError>({
        queryFn: () => binanceAxiosClient.get<readonly BinanceTickerApiData[]>('/api/v3/ticker?symbols=["BTCUSDT","XRPUSDT"]'),
        queryKey,
        refetchInterval: refetchInterval ?? 0,
        enabled: refetchInterval !== null,
    });
};