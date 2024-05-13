import axios from 'axios';
import * as crypto from 'crypto';

export interface BybitApiResponse<T> {
  retCode: number;
  retMsg: string;
  retExtInfo: Record<string, unknown>;
  time: number;
  result: T;
}

const bybitApiKey = process.env.NEXT_PUBLIC_BYBIT_API_ACCESS_KEY ?? '';
const bybitSecretKey = process.env.NEXT_PUBLIC_BYBIT_API_SECRET_KEY ?? '';

export const bybitAxiosClient = axios.create({
  baseURL: 'https://api.bybit.com',
});

export const getBybitSignature = (
  apiKey: string,
  secretKey: string,
  timestamp: string,
  recvWindow: string,
  params: Record<string, string>,
): string => {
  const paramsJoint = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const payload = `${timestamp}${apiKey}${recvWindow}${paramsJoint}`;

  const signature = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
  return signature;
};

export const getBybitAuthorizedHeaders = (params: Record<string, string>): Record<string, string> => {
  const timestamp = new Date().getTime().toString();
  const recvWindow = '5000';
  const signature = getBybitSignature(bybitApiKey, bybitSecretKey, timestamp, recvWindow, params);

  return {
    'X-BAPI-SIGN-TYPE': '2',
    'X-BAPI-API-KEY': bybitApiKey,
    'X-BAPI-TIMESTAMP': timestamp,
    'X-BAPI-RECV-WINDOW': recvWindow,
    'X-BAPI-SIGN': signature,
  };
};
