import type { NextApiRequest, NextApiResponse } from 'next';
import { BitgetApiResponse, bitgetAxiosClient, getBitgetAuthorizedHeaders } from '.';

export interface BitgetWalletStatusApiData {
  coinId: string;
  coin: string;
  transfer: 'true' | 'false';
  chains: readonly {
    chain: string;
    needTag: 'true' | 'false';
    withdrawable: 'true' | 'false';
    rechargeable: 'true' | 'false';
    withdrawFee: string;
    extraWithdrawFee: string;
    depositConfirm: string;
    withdrawConfirm: string;
    minDepositAmount: string;
    minWithdrawAmount: string;
    browserUrl: string;
    contractAddress: string;
    withdrawStep: string;
  }[];
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<BitgetApiResponse<readonly BitgetWalletStatusApiData[]> | undefined>,
) => {
  const endpoint = '/api/v2/spot/public/coins';
  const authorizedHeaders = getBitgetAuthorizedHeaders(endpoint, {});

  bitgetAxiosClient.defaults.headers = {
    ...bitgetAxiosClient.defaults.headers,
    ...authorizedHeaders,
  };

  const response = await bitgetAxiosClient
    .get<BitgetApiResponse<readonly BitgetWalletStatusApiData[]> | undefined>(endpoint)
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
