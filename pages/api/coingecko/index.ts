import axios from 'axios';

export type CMCResponse<T extends any> = {
  data?: T;
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
  };
};

export const coingeckoAxiosClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  params: {
    x_cg_demo_api_key: process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY,
  },
});
