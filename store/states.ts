import { atom } from 'jotai';
import { AllChains, Fiats, LOCAL_STORAGE_KEYS, TokenSymbols } from '@/constants/app';
import type { ConnectedWallet } from '@/types/wallet';
import apolloClients, { type AppApolloClients } from '@/data/graphql/apolloClients';
import { UpbitMarketApiData } from '@/pages/api/upbit/market';
import { CMCIdMapItemApiData } from '@/pages/api/cmc/idmap';
import { CMCMetadataItemData } from '@/pages/api/cmc/metadata';
import { BinanceMarketSymbolDetailApiData } from '@/data/hooks/types';

type TokenData = {
  logoURI: string;
};

export const apolloClientsAtom = atom<AppApolloClients>(apolloClients);

export const selectedCurrencyAtom = atom<Fiats>(Fiats.KRW);

/**
 *
 * @description token symbol is used as key atm; should be replaced with contract address
 */
export const allTokensDictAtom = atom<Record<TokenSymbols, TokenData>>({
  [TokenSymbols.CONST]: { logoURI: 'https://injective.talis.art/svg/icons/inj.svg' },
  [TokenSymbols.ARCH]: { logoURI: '' },
});

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
export const upbitMarketDataAtom = atom<Record<string, UpbitMarketApiData>>({});
export const binanceMarketDataAtom = atom<Record<string, BinanceMarketSymbolDetailApiData>>({});

export const coinMarketCapIdMapAtom = atom<Record<string, CMCIdMapItemApiData>>({});
export const coinMarketCapMetadataAtom = atom<Record<string, CMCMetadataItemData>>({});
export const currencyExchangeRateAtom = atom<{ lastUpdatedTime: number | undefined, rates: Record<Fiats, number | null> }>({
  lastUpdatedTime: undefined,
  rates: {
    [Fiats.KRW]: null,
    [Fiats.USD]: null,
    [Fiats.AUD]: null,
  }
});
