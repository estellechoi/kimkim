import { Fiats } from '@/constants/app';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface ForexApiData {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currency: string]: {
      code: Fiats;
      value: number;
    };
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const base_currency = req.query.base_currency ?? Fiats.USD;
  const currencies = req.query.currencies;

  const response = await axios
    .get<ForexApiData | undefined>(`https://api.fxapi.com/v1/latest`, {
      params: {
        apikey: process.env.NEXT_PUBLIC_FOREX_API_KEY,
        base_currency,
        currencies,
      },
    })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;

// <{ [id: string]: CMCMetadataItemData } | undefined>
