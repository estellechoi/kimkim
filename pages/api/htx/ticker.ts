import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosHtxClient, getHtxSignaturedURLParams } from '.';

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
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<readonly HtxMarketApiData[]>
  ) => {
    const endpoint = '/market/tickers';
    const signaturedParams = getHtxSignaturedURLParams(endpoint);

    const response = await axiosHtxClient.get<readonly HtxMarketApiData[]>(endpoint, { params: signaturedParams });
    res.status(response.status).json(response.data);
  };
  
  export default handler;
