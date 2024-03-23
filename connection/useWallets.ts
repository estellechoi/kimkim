import type { Wallet, WalletType } from '@/types/wallet';
import { wallets } from '@/constants/wallet';

const useWallets = (): Record<WalletType, Wallet> => {
  return wallets;
};

export default useWallets;
