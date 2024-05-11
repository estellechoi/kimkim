import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosHtxClient, getHtxSignaturedURLParams } from '.';

export interface HtxApiResponse<T> {
  data: T | undefined;
  status: string;
  ts: number;
}

export interface HtxMarketApiData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  amount: number;
  vol: number;
  count: number;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<HtxApiResponse<readonly HtxMarketApiData[]> | undefined>) => {
  const endpoint = '/market/tickers';
  const signaturedParams = getHtxSignaturedURLParams(endpoint);

  const response = await axiosHtxClient
    .get<HtxApiResponse<readonly HtxMarketApiData[]> | undefined>(endpoint, { params: signaturedParams })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.data?.status === 'error' ? 400 : response.status ?? 500).json(response.data);
};

export default handler;
