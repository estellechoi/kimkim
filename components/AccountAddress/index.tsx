import Image from 'next/image';
import type { ConnectedWallet } from '@/types/wallet';
import CopyHelper from '@/components/CopyHelper';
import { shortenAddress } from '@/utils/text';

type AccountAddressProps = {
  wallet: ConnectedWallet;
};

const AccountAddress = ({ wallet }: AccountAddressProps) => {
  const address = wallet.account?.address ?? '';

  return (
    <CopyHelper toCopy={address} className="text-body">
      <span className="flex items-center gap-x-2">
        <Image src={wallet.logoURL} alt={wallet.name} width={28} height={28} className="w-7 h-7" />
        <span className="w-full truncate Font_button_md">{shortenAddress(address, 4, 4)}</span>
      </span>
    </CopyHelper>
  );
};

export default AccountAddress;
