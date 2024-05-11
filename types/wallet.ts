import { ArchwayClient } from '@archwayhq/arch3.js/build';

export type WalletType = 'keplr';

export type Wallet = Readonly<{
  type: WalletType;
  name: string;
  logoURL: string;
  // getConnector: () => Promise<Connector | null>;
  onNoConnector?: () => void;
  isComing?: boolean;
}>;

export type ArchAccount = Awaited<ReturnType<ArchwayClient['getAccount']>>;

export type ConnectedWallet = Readonly<
  Omit<Wallet, 'onNoConnector'> & {
    account: ArchAccount;
  }
>;
