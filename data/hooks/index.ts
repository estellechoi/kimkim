import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { BinanceTickerApiData, ExchangeRateApiData } from "./types";
import type { UpbitTickerApiData } from "@/pages/api/upbit/ticker";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { CMCIdMapItemApiData } from "@/pages/api/cmc/idmap";
import { CMCMetadataItemData } from "@/pages/api/cmc/metadata";
import { CMCResponse } from "@/pages/api/cmc";


/**
 * 
 * @description exchange rate api fetching
 */
export const useFetchExchangeRate = (refetchInterval = 0, baseCurrency?: 'KRW' | 'USD') => {
    const currency = baseCurrency ?? 'KRW';
    const queryKey = ['fetchExchangeRate', currency];

    return useQuery({
        queryFn: () => axios.get<ExchangeRateApiData>(`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/${currency}`),
        queryKey,
        refetchInterval,
    });
}

/**
 * 
 * @description coin market cap api fetching
 */
export const useFetchCoinMarketCapIdMap = (refetchInterval = 0) => {
    const queryKey = ['fetchCoinMarketCapIdMap'];

    return useQuery({
        queryFn: () => axios.get<CMCResponse<readonly CMCIdMapItemApiData[]>>('/api/cmc/idmap'),
        queryKey,
        refetchInterval,
    });
};

export const useFetchCoinMarketCapMetadata = (refetchInterval = 0, ids?: readonly number[]) => {
    const id = ids?.join(',');
    const options = id ? { params: { id } } : undefined;
    const queryKey = ['fetchCoinMarketCapListings', id];

    return useQuery({
        queryFn: () => axios.get<CMCResponse<{ [id: string]: CMCMetadataItemData }>>('/api/cmc/metadata', options),
        queryKey,
        refetchInterval,
    });
};

/**
 * 
 * @description upbit open api fetching
 */
export const useFetchUpbitMarket = (refetchInterval = 0) => {
    const queryKey = ['fetchUpbitMarket'];

    return useQuery({
        queryFn: () => axios.get<readonly UpbitMarketApiData[]>('/api/upbit/market'),
        queryKey,
        refetchInterval,
    });
};

export const useFetchUpbitPrice = (refetchInterval = 0) => {
    const queryKey = ['fetchUpbitPrice'];

    return useQuery({
        queryFn: () => axios.get<readonly UpbitTickerApiData[]>('/api/upbit/ticker'),
        queryKey,
        refetchInterval,
    });
};

/**
 * 
 * @description binance api fetching
 */
const binanceAxiosClient = axios.create({
    baseURL: 'https://api.binance.com',
});
export const useFetchBinacePrice = (refetchInterval = 0) => {
    const queryKey = ['fetchBinancePrice'];

    return useQuery({
        queryFn: () => binanceAxiosClient.get<readonly BinanceTickerApiData[]>('/api/v3/ticker?symbols=["BTCUSDT","XRPUSDT"]'),
        queryKey,
        refetchInterval,
    });
};