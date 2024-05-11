import type { NextApiRequest, NextApiResponse } from 'next';
import { coingeckoAxiosClient } from '.';

export interface CoinGeckoCoinApiData {
  id: string;
  name: string;
  symbol: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await coingeckoAxiosClient
    .get<readonly CoinGeckoCoinApiData[]>('/coins/list', { params: req.query })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
