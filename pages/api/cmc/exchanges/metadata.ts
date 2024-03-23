import type { NextApiRequest, NextApiResponse } from 'next';
import { CMCResponse, cmc } from '..';

export type ExchangeDetailData = Readonly<{
  id: number;
  name: string;
  slug: string;
  logo: string;
  description: string;
  countries: readonly string[];
  urls: Readonly<{
    website: readonly string[];
    twitter: readonly string[];
    chat: readonly string[];
    reddit: readonly string[];
    facebook: readonly string[];
    other: readonly string[];
  }>;
  date_launched: string;
  notice: string | null;
  fiats: readonly string[];
  tags: readonly string[] | null;
  type: string;
  maker_fee: number;
  taker_fee: number;
  weekly_visits: number;
  spot_volume_usd: number;
  spot_volume_last_updated: string;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse<{ [id: string]: ExchangeDetailData } | undefined>) => {
  const cmcRes = await cmc
    .get<CMCResponse<{ [id: string]: ExchangeDetailData }>>('/v1/exchange/info', { params: req.query })
    .then((res) => res.data);

  const statusCode = cmcRes.status.error_code === 0 ? 200 : cmcRes.status.error_code;
  res.status(statusCode).json(cmcRes.data);
};

export default handler;
