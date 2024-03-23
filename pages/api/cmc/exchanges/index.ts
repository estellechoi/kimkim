import type { NextApiRequest, NextApiResponse } from 'next';
import { CMCResponse, cmc } from '..';

export type ExchangeData = Readonly<{
  id: number;
  name: string;
  slug: string;
  is_active: 0 | 1;
  first_historical_data: string;
  last_historical_data: string;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse<readonly ExchangeData[] | undefined>) => {
  const cmcRes = await cmc
    .get<CMCResponse<readonly ExchangeData[]>>('/v1/exchange/map', { params: req.query })
    .then((res) => res.data);

  const statusCode = cmcRes.status.error_code === 0 ? 200 : cmcRes.status.error_code;
  res.status(statusCode).json(cmcRes.data);
};

export default handler;
