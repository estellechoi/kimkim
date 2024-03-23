export enum EventCategory {
  PAGE_VIEW = 'Pageview',
  ERROR_BOUNDARY = 'ErrorBoundary',
  WALLET_CONNECTION = 'WalletConnection',
  TRY_CONNECT_WALLET = 'TryConnectWallet',
  FAIL_CONNECT_WALLET = 'FailConnectWallet',
}

export const isDevMode = process.env.NODE_ENV === 'development';
