import type { NextApiRequest, NextApiResponse } from 'next';
import { CMCResponse, coinMarketCapAxiosClient } from '.';

export type CoinMarketCapMetadataApiData = {
  urls: {
    website: string[];
    technical_doc: string[];
    twitter: string[];
    reddit: string[];
    message_board: string[];
    announcement: string[];
    chat: string[];
    explorer: string[];
    source_code: string[];
  };
  logo: string;
  id: number;
  name: string;
  symbol: string;
  slug: string;
  description: string;
  date_added: string;
  date_launched: string;
  tags: string[];
  platform: null | {
    id: string;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  };
  category: string;
  twitter_username?: string;
  'tag-names'?: string;
  self_reported_tags?: readonly string[];
  contract_address?: readonly {
    contract_address: string;
    platform: {
      name: string;
      coin: {
        id: string;
        name: string;
        slug: string;
        symbol: string;
      };
    } | null;
  }[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await coinMarketCapAxiosClient
    .get<
      CMCResponse<{ [symbol: string]: readonly CoinMarketCapMetadataApiData[] }>
    >('/v2/cryptocurrency/info', { params: req.query })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  const status = response.data?.status.error_code === 0 ? 200 : response.status;
  res.status(status).json(response.data);
};

export default handler;

// <{ [id: string]: CMCMetadataItemData } | undefined>
