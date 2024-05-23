import axios, { AxiosError, type AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type {
  BinanceMarketApiData,
  BinanceSystemStatusApiData,
  BinanceTickerApiData,
  ExchangeRateApiData,
  UpbitWalletStatusApiData,
} from './types';
import type { UpbitTickerApiData } from '@/pages/api/upbit/ticker';
import { UpbitMarketApiData } from '@/pages/api/upbit/market';
import { CoinMarketCapMetadataApiData } from '@/pages/api/cmc/metadata';
import { CMCResponse } from '@/pages/api/cmc';
import { Fiats } from '@/constants/app';
import { HtxApiResponse, HtxMarketApiData } from '@/pages/api/htx/tickers';
import { HtxWalletStatusApiData } from '@/pages/api/htx/wallet';
import { BinanceWalletStatusApiData } from '@/pages/api/binance/wallet';
import { CoinMarketCapQuoteLatestApiData } from '@/pages/api/cmc/quote';
import { BithumbTickerApiData } from '@/pages/api/bithumb/ticker';
import { BithumbWalletApiData } from '@/pages/api/bithumb/wallet';
import { BithumbApiResponse } from '@/pages/api/bithumb';
import { BithumbNetworkInfoApiData } from '@/pages/api/bithumb/network-info';
import { BithumbTransactionApiData } from '@/pages/api/bithumb/transaction';
import { BitgetApiResponse } from '@/pages/api/bitget';
import { BitgetWalletTickerApiData } from '@/pages/api/bitget/ticker';
import { BitgetWalletStatusApiData } from '@/pages/api/bitget/wallet';
import { BybitApiResponse } from '@/pages/api/bybit';
import { BybitTickerApiData } from '@/pages/api/bybit/ticker';
import { BybitWalletStatusApiData } from '@/pages/api/bybit/wallet';
import { ForexApiData } from '@/pages/api/forex';
import { UpbitCandleApiData } from '@/pages/api/upbit/candles';
import { BithumbCandleApiData } from '@/pages/api/bithumb/candles';
import { UpbitTradeApiData } from '@/pages/api/upbit/trade';
import kimkimAxios, { getKimKimApiSignature, kimkimApiKey, kimkimSecretKey } from '@/data/hooks/kimkimAxios';

/**
 *
 * @description exchange rate api fetching
 */
export const useFetchExchangeRate = (refetchInterval: number | null, baseCurrency?: Fiats.USD | Fiats.KRW) => {
  const currency = baseCurrency ?? Fiats.USD;
  const queryKey = ['fetchExchangeRate', currency];

  return useQuery<AxiosResponse<ExchangeRateApiData | undefined>, AxiosError>({
    queryFn: () =>
      axios.get<ExchangeRateApiData | undefined>(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/${currency}`,
      ),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchForex = (
  refetchInterval: number | null,
  baseCurrency?: Fiats.USD | Fiats.KRW,
  currencies?: readonly Fiats[],
) => {
  const base_currency = baseCurrency ?? Fiats.USD;
  const currenciesJoint = (currencies?.length ? currencies : [Fiats.KRW, Fiats.AUD]).join(',');
  const queryKey = ['fetchExchangeRate', base_currency, currenciesJoint];

  return useQuery<AxiosResponse<ForexApiData | undefined>, AxiosError>({
    queryFn: () => axios.get<ForexApiData | undefined>('/api/forex', { params: { base_currency, currencies: currenciesJoint } }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

/**
 *
 * @description coin market cap api fetching
 */
export const useFetchCoinMarketCapCoinMetadata = (refetchInterval: number | null, symbols: readonly string[]) => {
  const symbolsJoint = symbols.join(',');
  const queryKey = ['useFetchCoinMarketCapCoinMetadata', symbolsJoint];

  return useQuery<
    AxiosResponse<CMCResponse<{ [symbol: string]: readonly CoinMarketCapMetadataApiData[] }> | undefined>,
    AxiosError
  >({
    queryFn: () =>
      axios.get<CMCResponse<{ [symbol: string]: readonly CoinMarketCapMetadataApiData[] }> | undefined>('/api/cmc/metadata', {
        params: { symbol: symbolsJoint, skip_invalid: 'true' },
      }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchCoinMarketCapPrice = (refetchInterval: number | null, symbols: readonly string[]) => {
  const symbolsJoint = symbols.join(',');
  const queryKey = ['useFetchCoinMarketCapPrice', symbolsJoint];

  return useQuery<
    AxiosResponse<CMCResponse<{ [symbol: string]: readonly CoinMarketCapQuoteLatestApiData[] }> | undefined>,
    AxiosError
  >({
    queryFn: () =>
      axios.get<CMCResponse<{ [symbol: string]: readonly CoinMarketCapQuoteLatestApiData[] }> | undefined>('/api/cmc/quote', {
        params: { symbol: symbolsJoint, skip_invalid: 'true' },
      }),
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

  return useQuery<AxiosResponse<readonly UpbitMarketApiData[] | undefined>, AxiosError>({
    queryFn: () => axios.get<readonly UpbitMarketApiData[] | undefined>('/api/upbit/market'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchUpbitNetwork = (refetchInterval: number | null) => {
  const queryKey = ['useFetchUpbitNetwork'];

  return useQuery<AxiosResponse<readonly UpbitWalletStatusApiData[] | undefined>, AxiosError>({
    queryFn: async () => {
      const signature = await getKimKimApiSignature(kimkimApiKey, kimkimSecretKey);
      return kimkimAxios.get<readonly UpbitWalletStatusApiData[] | undefined>('/api/upbit/wallet', {
        headers: { 'x-kimkim-signature': signature },
      });
    },
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchUpbitPrice = (refetchInterval: number | null, symbols: readonly string[]) => {
  const marketsJoint = symbols.map((symbol) => `KRW-${symbol}`).join(',');
  const queryKey = ['fetchUpbitPrice', marketsJoint];

  return useQuery<AxiosResponse<readonly UpbitTickerApiData[] | undefined>, AxiosError>({
    queryFn: () =>
      axios.get<readonly UpbitTickerApiData[] | undefined>('/api/upbit/ticker', { params: { markets: marketsJoint } }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchUpbitTrade = (refetchInterval: number | null, { symbol }: { symbol: string }) => {
  const market = `KRW-${symbol}`;
  const queryKey = ['useFetchUpbitTrade', market];

  return useQuery<AxiosResponse<readonly UpbitTradeApiData[] | undefined>, AxiosError>({
    queryFn: () => axios.get<readonly UpbitTradeApiData[] | undefined>('/api/upbit/trade', { params: { market } }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchUpbitCandles = (refetchInterval: number | null, { symbol }: { symbol: string }) => {
  const market = `KRW-${symbol}`;
  const queryKey = ['useFetchUpbitCandles', market];

  return useQuery<AxiosResponse<readonly UpbitCandleApiData[] | undefined>, AxiosError>({
    queryFn: () => axios.get<readonly UpbitCandleApiData[] | undefined>('/api/upbit/candles', { params: { market, count: '1' } }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

/**
 *
 * @description bithumb open api fetching
 */
export const useFetchBithumbPrice = (refetchInterval: number | null) => {
  const queryKey = ['useFetchBithumbPrice'];

  return useQuery<
    AxiosResponse<BithumbApiResponse<Readonly<{ [symbol: string]: BithumbTickerApiData }>> | undefined>,
    AxiosError
  >({
    queryFn: () =>
      axios.get<BithumbApiResponse<Readonly<{ [symbol: string]: BithumbTickerApiData }>> | undefined>('/api/bithumb/ticker'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBithumbWalletStatus = (refetchInterval: number | null) => {
  const queryKey = ['useFetchBithumbWalletStatus'];

  return useQuery<AxiosResponse<BithumbApiResponse<readonly BithumbWalletApiData[]> | undefined>, AxiosError>({
    queryFn: () => axios.get<BithumbApiResponse<readonly BithumbWalletApiData[]> | undefined>('/api/bithumb/wallet'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBithumbNetworkInfo = (refetchInterval: number | null) => {
  const queryKey = ['useFetchBithumbNetworkInfo'];

  return useQuery<AxiosResponse<BithumbApiResponse<readonly BithumbNetworkInfoApiData[]> | undefined>, AxiosError>({
    queryFn: () => axios.get<BithumbApiResponse<readonly BithumbNetworkInfoApiData[]> | undefined>('/api/bithumb/network-info'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBithumbTrade = (refetchInterval: number | null, { symbol }: { symbol: string }) => {
  const market = `${symbol}_KRW`;
  const queryKey = ['useFetchBithumbTrade', market];

  return useQuery<AxiosResponse<BithumbApiResponse<readonly [BithumbTransactionApiData]> | undefined>, AxiosError>({
    queryFn: () =>
      axios.get<BithumbApiResponse<readonly [BithumbTransactionApiData]> | undefined>('/api/bithumb/transaction', {
        params: { market },
      }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBithumbCandles = (refetchInterval: number | null, { symbol }: { symbol: string }) => {
  const market = `${symbol}_KRW`;
  const queryKey = ['useFetchBithumbCandles', market];

  return useQuery<AxiosResponse<BithumbApiResponse<readonly BithumbCandleApiData[]> | undefined>, AxiosError>({
    queryFn: () =>
      axios.get<BithumbApiResponse<readonly BithumbCandleApiData[]> | undefined>('/api/bithumb/candles', {
        params: { market },
      }),
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

  return useQuery<AxiosResponse<BinanceMarketApiData | undefined>, AxiosError>({
    queryFn: () =>
      binanceAxiosClient.get<BinanceMarketApiData | undefined>(`/api/v3/exchangeInfo`, { params: { permissions: 'SPOT' } }),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBinacePrice = (refetchInterval: number | null, symbols: readonly string[]) => {
  const marketsJoint = symbols.map((symbol) => `"${symbol}USDT"`).join(',');
  const queryKey = ['fetchBinancePrice', marketsJoint];

  return useQuery<AxiosResponse<readonly BinanceTickerApiData[] | undefined>, AxiosError>({
    queryFn: () =>
      binanceAxiosClient.get<readonly BinanceTickerApiData[] | undefined>(`/api/v3/ticker/24hr?symbols=[${marketsJoint}]`),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBinaceSystemStatus = (refetchInterval: number | null) => {
  const queryKey = ['fetchBinaceSystemStatus'];

  return useQuery<AxiosResponse<BinanceSystemStatusApiData | undefined>, AxiosError>({
    queryFn: () => binanceAxiosClient.get<BinanceSystemStatusApiData | undefined>('/sapi/v1/system/status'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBinaceWalletStatus = (refetchInterval: number | null) => {
  const queryKey = ['fetchBinaceWalletStatus'];

  return useQuery<AxiosResponse<readonly BinanceWalletStatusApiData[] | undefined>, AxiosError>({
    queryFn: () => axios.get<readonly BinanceWalletStatusApiData[] | undefined>(`/api/binance/wallet`),
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

  return useQuery<AxiosResponse<HtxApiResponse<readonly HtxMarketApiData[]> | undefined>, AxiosError>({
    queryFn: () => axios.get<HtxApiResponse<readonly HtxMarketApiData[]> | undefined>('/api/htx/tickers'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetcHtxWalletStatus = (refetchInterval: number | null) => {
  const queryKey = ['fetcHtxWalletStatus'];

  return useQuery<AxiosResponse<HtxApiResponse<readonly HtxWalletStatusApiData[]> | undefined>, AxiosError>({
    queryFn: () => axios.get<HtxApiResponse<readonly HtxWalletStatusApiData[]> | undefined>('/api/htx/wallet'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

/**
 *
 * @description bybit api fetching
 */
const bybitAxiosClient = axios.create({
  baseURL: 'https://api.bybit.com',
});

export const useFetchBybitPrice = (refetchInterval: number | null) => {
  const queryKey = ['useFetchBybitPrice'];

  return useQuery<AxiosResponse<BybitApiResponse<BybitTickerApiData> | undefined>, AxiosError>({
    queryFn: () => bybitAxiosClient.get<BybitApiResponse<BybitTickerApiData> | undefined>('/v5/market/tickers?category=spot'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBybitWalletStatus = (refetchInterval: number | null) => {
  const queryKey = ['useFetchBybitWalletStatus'];

  return useQuery<AxiosResponse<BybitApiResponse<BybitWalletStatusApiData> | undefined>, AxiosError>({
    queryFn: () => axios.get<BybitApiResponse<BybitWalletStatusApiData> | undefined>('/api/bybit/wallet'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

/**
 *
 * @description bybit api fetching
 */
export const useFetchBitgetPrice = (refetchInterval: number | null) => {
  const queryKey = ['fetchBitgetPrice'];

  return useQuery<AxiosResponse<BitgetApiResponse<readonly BitgetWalletTickerApiData[]> | undefined>, AxiosError>({
    queryFn: () => axios.get<BitgetApiResponse<readonly BitgetWalletTickerApiData[]> | undefined>('/api/bitget/ticker'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};

export const useFetchBitgetWalletStatus = (refetchInterval: number | null) => {
  const queryKey = ['fetchBitgetWalletStatus'];

  return useQuery<AxiosResponse<BitgetApiResponse<readonly BitgetWalletStatusApiData[]> | undefined>, AxiosError>({
    queryFn: () => axios.get<BitgetApiResponse<readonly BitgetWalletStatusApiData[]> | undefined>('api/bitget/wallet'),
    queryKey,
    refetchInterval: refetchInterval ?? 0,
    enabled: refetchInterval !== null,
  });
};
