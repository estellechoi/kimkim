import axios from 'axios';
import { HmacSHA256, enc } from 'crypto-js';

export const binanceApiKey = process.env.NEXT_PUBLIC_BINANCE_API_ACCESS_KEY ?? '';
export const binanceSecretKey = process.env.NEXT_PUBLIC_BINANCE_API_SECRET_KEY ?? '';

export const axiosBinanceClient = axios.create({
  baseURL: 'https://api.binance.com',
  headers: {
    accept: 'application/json',
  },
});

export const getBinanceAuthorizedHeaders = (apiKey: string): Record<string, string> => {
  return {
    'X-MBX-APIKEY': apiKey,
  };
};

export const getBinanceSignaturedParams = (
  secretKey: string,
  params: { recvWindow: string; timestamp: string } & Record<string, string>,
): { signature: string; [key: string]: string } => {
  const { recvWindow, timestamp, ...otherParams } = params;

  const mappedOtherParams = Object.entries(otherParams).map(([key, value]) => `${key}=${value}`);
  const payload = [...mappedOtherParams, `recvWindow=${recvWindow}`, `timestamp=${timestamp}`].join('&');
  const signature = HmacSHA256(payload, secretKey).toString(enc.Hex);

  return { ...params, signature };
};

export const fetchBinanceServerTime = async () => {
  try {
    const serverTimeResponse = await axiosBinanceClient.get<{ serverTime: number }>('/api/v3/time');
    return serverTimeResponse.data.serverTime;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
