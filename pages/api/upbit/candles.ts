import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosUpbitClient } from '.';

export interface UpbitCandleApiData {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number; // 누적 거래 금액
  candle_acc_trade_volume: number;
  unit: number; // 분 단위
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const response = await axiosUpbitClient
    .get<readonly UpbitCandleApiData[] | undefined>('/v1/candles/minutes/1', { params: req.query })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
