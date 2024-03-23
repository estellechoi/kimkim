import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosUpbitClient } from '.';

export interface UpbitMarketApiData {
  english_name: string;
  korean_name: string;
  market: string;
  market_warning: string;
  market_event: {
    caution: {
      CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
      DEPOSIT_AMOUNT_SOARING: boolean;
      GLOBAL_PRICE_DIFFERENCES: boolean;
      PRICE_FLUCTUATIONS: boolean;
      TRADING_VOLUME_SOARING: boolean;
    };
    warning: boolean;
  }
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) => {
    const response = await axiosUpbitClient
      .get<readonly UpbitMarketApiData[]>('v1/market/all', { params: { isDetails: true } });

    const status = response.status === 0 ? 200 : response.status;
    res.status(status).json(response.data);
  };
  
  export default handler;
