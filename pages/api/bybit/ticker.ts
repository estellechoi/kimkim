import type { NextApiRequest, NextApiResponse } from 'next';
import { BybitApiResponse, bybitAxiosClient } from '.';

export interface BybitTickerItemApiData {
  symbol: string;
  bid1Price: string;
  bid1Size: string;
  ask1Price: string;
  ask1Size: string;
  lastPrice: string;
  prevPrice24h: string;
  price24hPcnt: string;
  highPrice24h: string;
  lowPrice24h: string;
  turnover24h: string;
  volume24h: string;
  usdIndexPrice: string;
}

export interface BybitTickerApiData {
  category?: string;
  list?: readonly BybitTickerItemApiData[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse<BybitApiResponse<BybitTickerApiData> | undefined>) => {
  const endpoint = '/v5/market/tickers?category=spot';

  const response = await bybitAxiosClient.get<BybitApiResponse<BybitTickerApiData> | undefined>(endpoint).catch((err) => {
    return { status: err.response?.status, data: err.response?.data };
  });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
