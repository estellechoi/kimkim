import type { NextApiRequest, NextApiResponse } from 'next';
import { CMCResponse, cmc } from '.';

export type CMCIdMapItemApiData = Readonly<{
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  first_historical_data: string;
  last_historical_data: string;
  platform: string | null;
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await cmc
    .get<CMCResponse<readonly CMCIdMapItemApiData[]>>('/v1/cryptocurrency/map', { params: req.query });

    const statusCode = response.data.status.error_code === 0 ? response.status : response.data.status.error_code;
    res.status(statusCode).json(response.data);
};

export default handler;

// <readonly CMCListingItemData[] | undefined>