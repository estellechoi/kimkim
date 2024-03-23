import type { NextApiRequest, NextApiResponse } from 'next';
import { CMCResponse, cmc } from '.';

export type CMCMetadataItemData = Readonly<{
  id: number;
  category: string;
  date_added: string;
  date_launched: string | null;
  description: string;
  contract_address: readonly {
    contract_address: string;
    platform: {
      coin: {
        id: string;
        symbol: string;
        name: string;
        slug: string;
      };
      name: string;
    };
  }[];
  infinite_supply: boolean;
  is_hidden: 0 | 1;
  logo: string;
  name: string;
  notice: string | null;
  platform: {
    id: number;
    name: string;
    slug: string;
    symbol: string;
    token_address: string;
  } | null;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
  self_reported_tags: readonly string[] | null;
  slug: string;
  symbol: string;
  tags: readonly string[];
  'tag-names': readonly string[];
  'tag-groups': readonly string[];
  twitter_username: string | null;
  urls: {
    announcement: readonly string[];
    chat: readonly string[];
    explorer: readonly string[];
    message_board: readonly string[];
    reddit: readonly string[];
    source_code: readonly string[];
    twitter: readonly string[];
    website: readonly string[];
  };
}>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await cmc
    .get<CMCResponse<{ [id: string]: CMCMetadataItemData }>>('/v2/cryptocurrency/info', { params: req.query })

  const statusCode = response.data.status.error_code === 0 ? 200 : response.data.status.error_code;
  res.status(statusCode).json(response.data);
};

export default handler;

// <{ [id: string]: CMCMetadataItemData } | undefined>