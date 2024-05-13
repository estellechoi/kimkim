import type { NextApiRequest, NextApiResponse } from 'next';
import { BitgetApiResponse, bitgetAxiosClient, getBitgetAuthorizedHeaders } from '.';

export interface BitgetWalletTickerApiData {
  symbol: string;
  high24h: string;
  open: string;
  low24h: string;
  lastPr: string;
  quoteVolume: string;
  baseVolume: string;
  usdtVolume: string;
  bidPr: string;
  askPr: string;
  bidSz: string;
  askSz: string;
  openUtc: string;
  ts: string;
  changeUtc24h: string;
  change24h: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<BitgetApiResponse<readonly BitgetWalletTickerApiData[]> | undefined>,
) => {
  const endpoint = '/api/v2/spot/market/tickers';
  const authorizedHeaders = getBitgetAuthorizedHeaders(endpoint, {});

  bitgetAxiosClient.defaults.headers = {
    ...bitgetAxiosClient.defaults.headers,
    ...authorizedHeaders,
  };

  const response = await bitgetAxiosClient
    .get<BitgetApiResponse<readonly BitgetWalletTickerApiData[]> | undefined>(endpoint)
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
