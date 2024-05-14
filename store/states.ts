import { atom } from 'jotai';
import { ExchangeWalletStatus, Fiats } from '@/constants/app';
import apolloClients, { type AppApolloClients } from '@/data/graphql/apolloClients';
import { UpbitMarketApiData } from '@/pages/api/upbit/market';
import { CoinMarketCapMetadataApiData } from '@/pages/api/cmc/metadata';
import { BinanceMarketSymbolDetailApiData } from '@/data/hooks/types';

export const apolloClientsAtom = atom<AppApolloClients>(apolloClients);

export const selectedCurrencyAtom = atom<Fiats>(Fiats.KRW);

export const userAgentAtom = atom<
  { isMobile: boolean; isMobileOrTablet: boolean; isIOS: boolean; isNonIOSMobile: boolean } | undefined
>(undefined);

/**
 *
 * @description exchange-wide market data
 */
export const tokenKoreanNameMapAtom = atom<Record<string, string> | undefined>(undefined);

export const upbitMarketDataAtom = atom<Record<string, UpbitMarketApiData> | undefined>(undefined);
export const upbitWalletStatusAtom = atom<Record<string, { networkType: string; status: ExchangeWalletStatus }> | undefined>(
  undefined,
);

export const binanceMarketDataAtom = atom<Record<string, BinanceMarketSymbolDetailApiData> | undefined>(undefined);

export const coinMarketCapMetadataAtom = atom<Record<string, CoinMarketCapMetadataApiData | undefined> | undefined>(undefined);

export const currencyExchangeRateAtom = atom<{
  lastUpdatedTime: number | undefined;
  rates: Record<Fiats, number | null>;
}>({
  lastUpdatedTime: undefined,
  rates: {
    [Fiats.KRW]: null,
    [Fiats.USD]: null,
    [Fiats.AUD]: null,
  },
});
