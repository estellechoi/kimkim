import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosUpbitClient } from '.';

export interface UpbitTradeApiData {
  market: string;
  trade_date_utc: string;
  trade_time_utc: string;
  timestamp: number;
  trade_price: number;
  trade_volume: number;
  prev_closing_price: number;
  change_price: number;
  ask_bid: 'BID' | 'ASK';
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const endpoint = `/v1/trades/ticks`;
  const response = await axiosUpbitClient
    .get<readonly UpbitTradeApiData[] | undefined>(endpoint, { params: { count: '100', ...req.query } })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
