import type { NextApiRequest, NextApiResponse } from 'next';
import { BithumbApiResponse, axiosBithumbClient } from '.';

// 기준시간, 시가, 종가, 고가, 저가, 거래량
export type BithumbCandleApiData = readonly [number, `${number}`, `${number}`, `${number}`, `${number}`, `${number}`];

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const endpoint = `/public/candlestick/${req.query.market}/1m`;

  const response = await axiosBithumbClient
    .get<BithumbApiResponse<readonly BithumbCandleApiData[] | undefined>>(endpoint)
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
