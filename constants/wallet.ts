import type { Wallet, WalletType } from "@/types/wallet";
import KEPLR_LOGO_URL from '@/resources/svgs/keplr_logo.svg';

export const keplr: Wallet = {
    type: 'keplr',
    name: 'Keplr',
    logoURL: KEPLR_LOGO_URL,
    onNoConnector: () => {
      window.open('', '_blank');
    }, 
}

export const wallets: Record<WalletType, Wallet> = { keplr };