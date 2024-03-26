import type { NextApiRequest, NextApiResponse } from 'next';
import { coingeckoAxiosClient } from '.';

export interface CoinGeckoCoinApiData {
    id: string;
    name: string;
    symbol: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await coingeckoAxiosClient
    .get<readonly CoinGeckoCoinApiData[]>('/coins/list', { params: req.query });

    res.status(response.status).json(response.data);
};

export default handler;