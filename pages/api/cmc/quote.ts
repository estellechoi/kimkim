import type { NextApiRequest, NextApiResponse } from 'next';
import { CMCResponse, coinMarketCapAxiosClient } from '.';

export type CoinMarketCapQuoteLatestApiData = {
  quote: {
    USD: {
      price: number;
      last_updated: string;
      // should define others soon
    };
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await coinMarketCapAxiosClient
    .get<
      CMCResponse<{ [symbol: string]: readonly CoinMarketCapQuoteLatestApiData[] }>
    >('/v2/cryptocurrency/quotes/latest', { params: req.query })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  const status = response.data?.status.error_code === 0 ? 200 : response.status;
  res.status(status).json(response.data);
};

export default handler;

// <{ [id: string]: CMCMetadataItemData } | undefined>
