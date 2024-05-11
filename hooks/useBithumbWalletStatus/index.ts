import { useFetchBithumbNetworkInfo, useFetchBithumbWalletStatus } from '@/data/hooks';
import { BithumbNetworkInfoApiData } from '@/pages/api/bithumb/network-info';
import { BithumbWalletApiData } from '@/pages/api/bithumb/wallet';
import { useMemo } from 'react';

export type BithumbWalletData = BithumbWalletApiData &
  Readonly<{
    net_name: string | undefined;
  }>;

const useBithumbWalletStatus = (enabled: boolean) => {
  const { data: bithumbWalletStatusData, error } = useFetchBithumbWalletStatus(enabled ? 0 : null);
  const { data: bithumbNetworkInfoData } = useFetchBithumbNetworkInfo(enabled ? 0 : null);

  const bithumbNetworkInfoMap = useMemo<Record<string, BithumbNetworkInfoApiData>>(() => {
    return (
      bithumbNetworkInfoData?.data?.data.reduce<Record<string, BithumbNetworkInfoApiData>>((acc, item) => {
        return { ...acc, [item.net_type]: item };
      }, {}) ?? {}
    );
  }, [bithumbNetworkInfoData?.data?.data]);

  const data = useMemo<readonly BithumbWalletData[] | undefined>(() => {
    return bithumbWalletStatusData?.data?.data?.map((item) => {
      const net_name: string | undefined = bithumbNetworkInfoMap[item.net_type]?.net_name;
      return { ...item, net_name };
    });
  }, [bithumbWalletStatusData?.data?.data, bithumbNetworkInfoMap]);

  return { data, error };
};

export default useBithumbWalletStatus;
