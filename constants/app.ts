import GoogleAnalytics from '@/analytics/googleAnalytics/GoogleAnalytics';
import Mixpanel from '@/analytics/mixpanel/Mixpanel';
import CHAIN_LOGO_ARCHWAY from '@/resources/logos/chain_logo_archway.png';
import CHAIN_LOGO_NIBIRU from '@/resources/logos/chain_logo_nibiru.png';
import FLAG_KR from '@/resources/images/flag_kr.png';
import FLAG_US from '@/resources/images/flag_us.png';
import FLAG_AU from '@/resources/images/flag_au.png';
import EXCHANGE_BINANCE_LOGO from '@/resources/images/exchange_logo_binance.svg';
import EXCHANGE_UPBIT_LOGO from '@/resources/images/exchange_logo_upbit.svg';
import EXCHANGE_BITHUMB_LOGO from '@/resources/images/exchange_logo_bithumb.svg';
import EXCHANGE_HTX_LOGO from '@/resources/images/exchange_logo_htx.svg';
import EXCHANGE_BYBIT_LOGO from '@/resources/images/exchange_logo_bybit.svg';
import EXCHANGE_BITGET_LOGO from '@/resources/images/exchange_logo_bitget.svg';

export const googleAnalytics = new GoogleAnalytics('google analytics');
export const mixpanel = new Mixpanel('mixpanel');

export const FORMAT_LOCALE_FALLBACK = 'en';

export const MAX_DECIMALS = 18;

export const COMPACT_DECIMALS = 4;

export const TEXTS = {
  NO_DATA: 'No data found',
};

export const IS_DEV = process.env.NODE_ENV === 'development';

export enum AllChains {
  ARCH_MAINNET = 'Archway Mainnet',
  ARCH_TESTNET = 'Archway Testnet',
  NIBIRU_MAINNET = 'Nibiru Mainnet',
  NIBIRU_TESTNET = 'Nibiru Testnet-1',
}

export const CHAIN_METADATA_DICT: Record<AllChains, { explorerAddressURL: string; logoURL: string }> = {
  [AllChains.ARCH_MAINNET]: {
    explorerAddressURL: '',
    logoURL: CHAIN_LOGO_ARCHWAY.src,
  },
  [AllChains.ARCH_TESTNET]: {
    explorerAddressURL: 'https://testnet.explorer.injective.network',
    logoURL: CHAIN_LOGO_ARCHWAY.src,
  },
  [AllChains.NIBIRU_MAINNET]: {
    explorerAddressURL: '',
    logoURL: CHAIN_LOGO_NIBIRU.src,
  },
  [AllChains.NIBIRU_TESTNET]: {
    explorerAddressURL: '',
    logoURL: CHAIN_LOGO_NIBIRU.src,
  },
};

export enum Languages {
  KR = 'ko',
  EN = 'en',
}

export enum Fiats {
  KRW = 'KRW',
  USD = 'USD',
  AUD = 'AUD',
}

export const FIATS_METADATA_DICT: Record<Fiats, { logoURL: string }> = {
  [Fiats.KRW]: {
    logoURL: FLAG_KR.src,
  },
  [Fiats.USD]: {
    logoURL: FLAG_US.src,
  },
  [Fiats.AUD]: {
    logoURL: FLAG_AU.src,
  },
};

export enum Exchanges {
  BINANCE = 'Binance',
  UPBIT = 'Upbit',
  BITHUMB = 'Bithumb',
  HTX = 'HTX',
  BYBIT = 'Bybit',
  BITGET = 'Bitget',
}

export const EXCHANGES_METADATA_DICT: Record<Exchanges, { logoURL: string }> = {
  [Exchanges.BINANCE]: {
    logoURL: EXCHANGE_BINANCE_LOGO.src,
  },
  [Exchanges.UPBIT]: {
    logoURL: EXCHANGE_UPBIT_LOGO.src,
  },
  [Exchanges.BITHUMB]: {
    logoURL: EXCHANGE_BITHUMB_LOGO.src,
  },
  [Exchanges.HTX]: {
    logoURL: EXCHANGE_HTX_LOGO.src,
  },
  [Exchanges.BYBIT]: {
    logoURL: EXCHANGE_BYBIT_LOGO.src,
  },
  [Exchanges.BITGET]: {
    logoURL: EXCHANGE_BITGET_LOGO.src,
  },
};

export type BaseExchange = Exchanges.UPBIT | Exchanges.BITHUMB;
export type QuoteExchange = Exchanges.BINANCE | Exchanges.HTX | Exchanges.BYBIT | Exchanges.BITGET;

export const BASE_EXCHANGES: readonly BaseExchange[] = [Exchanges.UPBIT, Exchanges.BITHUMB];
export const QUOTE_EXCHANGES: readonly QuoteExchange[] = [Exchanges.BINANCE, Exchanges.HTX, Exchanges.BYBIT, Exchanges.BITGET];

/**
 *
 * @description exchange wallet status
 */
export enum ExchangeWalletStatus {
  WORKING = '가능',
  WITHDRAW_ONLY = '출금만',
  DEPOSIT_ONLY = '입금만',
  PAUSED = '정지',
  UNSUPPORTED = '미지원',
}

/**
 *
 * @description the below types are tmp for wireframing
 */

export enum TokenSymbols {
  CONST = 'CONST',
  ARCH = 'ARCH',
}

export type CoinData = { denomOn: Record<AllChains, string | null>; decimals: number };

export const COIN_DICT: Record<TokenSymbols, CoinData> = {
  [TokenSymbols.CONST]: {
    denomOn: {
      [AllChains.ARCH_TESTNET]: 'uconst',
      [AllChains.ARCH_MAINNET]: 'uconst',
      [AllChains.NIBIRU_MAINNET]: null,
      [AllChains.NIBIRU_TESTNET]: null,
    },
    decimals: 18,
  },
  [TokenSymbols.ARCH]: {
    denomOn: {
      [AllChains.ARCH_TESTNET]: 'aarch',
      [AllChains.ARCH_MAINNET]: 'aarch',
      [AllChains.NIBIRU_MAINNET]: null,
      [AllChains.NIBIRU_TESTNET]: null,
    },
    decimals: 6,
  },
};

export const PRICE_ORACLE_DICT: Record<TokenSymbols, number> = {
  [TokenSymbols.CONST]: 35,
  [TokenSymbols.ARCH]: 1,
};

export enum ProposalStatus {
  Pending = 'pending',
  Open = 'open',
  Rejected = 'rejected',
  Passed = 'passed',
  Executed = 'executed',
}

export const PROPOSAL_STATUS_LABEL_DICT: Record<ProposalStatus, string> = {
  [ProposalStatus.Pending]: 'Pending',
  [ProposalStatus.Open]: 'Open',
  [ProposalStatus.Rejected]: 'Rejected',
  [ProposalStatus.Passed]: 'Passed',
  [ProposalStatus.Executed]: 'Executed',
};
