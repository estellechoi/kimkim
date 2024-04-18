import { atom } from 'jotai';
import { ExchangeWalletStatus, Fiats, LOCAL_STORAGE_KEYS, TokenSymbols } from '@/constants/app';
import type { ConnectedWallet } from '@/types/wallet';
import apolloClients, { type AppApolloClients } from '@/data/graphql/apolloClients';
import { UpbitMarketApiData } from '@/pages/api/upbit/market';
import { CoinMarketCapMetadataApiData } from '@/pages/api/cmc/metadata';
import { BinanceMarketSymbolDetailApiData } from '@/data/hooks/types';
import { CoinGeckoCoinPriceApiData } from '@/pages/api/coingecko/prices';

export const apolloClientsAtom = atom<AppApolloClients>(apolloClients);

export const selectedCurrencyAtom = atom<Fiats>(Fiats.KRW);

const userWalletAtomOrigin = atom<ConnectedWallet | null>(null);

export const userWalletAtom = atom(
  (get) => get(userWalletAtomOrigin),
  (_, set, userWallet: ConnectedWallet | null) => {
    set(userWalletAtomOrigin, userWallet);

    if (userWallet?.type) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_USED_WALLET, userWallet.type);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_USED_WALLET);
    }
  }
);

export const userAgentAtom = atom<
  { isMobile: boolean; isMobileOrTablet: boolean; isIOS: boolean; isNonIOSMobile: boolean } | undefined
>(undefined);

/**
 * 
 * @description exchange-wide market data
 */
export const tokenKoreanNameMapAtom = atom<Record<string, string> | undefined>(undefined);

export const upbitMarketDataAtom = atom<Record<string, UpbitMarketApiData> | undefined>(undefined);
export const upbitWalletStatusAtom = atom<Record<string, { networkType: string; status: ExchangeWalletStatus }> | undefined>(undefined);

export const binanceMarketDataAtom = atom<Record<string, BinanceMarketSymbolDetailApiData> | undefined>(undefined);

export const coinMarketCapMetadataAtom = atom<Record<string, CoinMarketCapMetadataApiData | undefined> | undefined>(undefined);

export const currencyExchangeRateAtom = atom<{ 
  lastUpdatedTime: number | undefined, 
  rates: Record<Fiats, number | null> 
}>({
  lastUpdatedTime: undefined,
  rates: {
    [Fiats.KRW]: null,
    [Fiats.USD]: null,
    [Fiats.AUD]: null,
  }
});
