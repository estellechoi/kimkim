import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosUpbitClient, getUpbitAuthorizationHeader } from '.';

export interface UpbitWalletStatusApiData {
  block_elapsed_minutes: number;
  block_height: number;
  block_state: 'normal' | 'delayed' | 'inactive';
  block_updated_at: string;
  currency: string;
  net_type: string;
  network_name: string;
  wallet_state: 'working' | 'withdraw_only' | 'deposit_only' | 'paused' | 'unsupported';
}

const handler = async (req: NextApiRequest, res: NextApiResponse<readonly UpbitWalletStatusApiData[]>) => {
  const Authorization = getUpbitAuthorizationHeader();
  axiosUpbitClient.defaults.headers['Authorization'] = Authorization;

  const response = await axiosUpbitClient.get<readonly UpbitWalletStatusApiData[]>('/v1/status/wallet').catch((err) => {
    return { status: err.response?.status, data: err.response?.data };
  });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
