import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosHtxClient, getHtxSignaturedURLParams } from '.';

export interface HtxApiResponse<T> {
  data: T | undefined;
  status?: string;
  ts?: number;
  code?: number;
}

export interface HtxNetworkApiData {
  chain: string;
  displayName?: string;
  fullName?: string;
  baseChain?: string;
  baseChainProtocol?: string;
  isDynamic: boolean;
  depositStatus: 'allowed' | 'prohibited';
  maxTransactFeeWithdraw?: string;
  maxWithdrawAmt: string;
  minDepositAmt: string;
  minTransactFeeWithdraw?: string;
  minWithdrawAmt: string;
  numOfConfirmations: number;
  numOfFastConfirmations: number;
  withdrawFeeType: 'fixed' | 'circulated' | 'ratio';
  withdrawPrecision: number;
  withdrawQuotaPerDay: string;
  withdrawQuotaPerYear: string;
  withdrawQuotaTotal: string;
  withdrawStatus: 'allowed' | 'prohibited';
  transactFeeRateWithdraw?: string;
  transactFeeWithdraw?: string;
}

export interface HtxWalletStatusApiData {
  chains: HtxNetworkApiData[];
  currency: string;
  instStatus: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<HtxApiResponse<readonly HtxWalletStatusApiData[]> | undefined>,
) => {
  const endpoint = '/v2/reference/currencies';
  // const params = { currency: 'usdt' };
  const signaturedParams = getHtxSignaturedURLParams(endpoint);

  const response = await axiosHtxClient
    .get<HtxApiResponse<readonly HtxWalletStatusApiData[]> | undefined>(endpoint, { params: signaturedParams })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
