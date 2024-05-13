import type { NextApiRequest, NextApiResponse } from 'next';
import { BybitApiResponse, bybitAxiosClient, getBybitAuthorizedHeaders } from '.';

export interface BybitWalletStatusItemApiData {
  name: string;
  coin: string;
  remainAmount: string;
  chains: readonly {
    chainType: string;
    confirmation: string;
    withdrawFee: string;
    depositMin: string;
    withdrawMin: string;
    chain: string;
    chainDeposit: '0' | '1'; // 0: suspend, 1: normal
    chainWithdraw: '0' | '1'; // 0: suspend, 1: normal
    minAccuracy: string;
    withdrawPercentageFee: string;
  }[];
}

export interface BybitWalletStatusApiData {
  rows?: readonly BybitWalletStatusItemApiData[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse<BybitApiResponse<BybitWalletStatusApiData> | undefined>) => {
  const endpoint = '/v5/asset/coin/query-info';
  const authorizedHeaders = getBybitAuthorizedHeaders({});

  bybitAxiosClient.defaults.headers = {
    ...bybitAxiosClient.defaults.headers,
    ...authorizedHeaders,
  };

  const response = await bybitAxiosClient.get<BybitApiResponse<BybitWalletStatusApiData> | undefined>(endpoint).catch((err) => {
    return { status: err.response?.status, data: err.response?.data };
  });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
