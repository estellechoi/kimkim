import axios from 'axios';
import { HmacSHA256, enc } from 'crypto-js';

export interface BitgetApiResponse<T> {
  code: string;
  msg: string;
  data: T;
}

const bitgetApiKey = process.env.NEXT_PUBLIC_BITGET_API_ACCESS_KEY ?? '';
const bitgetSecretKey = process.env.NEXT_PUBLIC_BITGET_API_SECRET_KEY ?? '';

export const bitgetAxiosClient = axios.create({
  baseURL: 'https://api.bitget.com',
  headers: {
    'Content-Type': 'application/json',
    locale: 'en-US',
  },
});

export const getBitgetSignature = (
  secretKey: string,
  method: 'GET',
  timestamp: string,
  path: string,
  params: Record<string, string>,
): string => {
  const paramsJoint = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const payload = `${timestamp}${method}${path}${paramsJoint.length > 0 ? `?${paramsJoint}` : ''}`;

  const signature = HmacSHA256(payload, secretKey).toString(enc.Base64);
  return signature;
};

export const getBitgetAuthorizedHeaders = (path: string, params: Record<string, string>): Record<string, string> => {
  const timestamp = new Date().getTime().toString();
  const signature = getBitgetSignature(bitgetSecretKey, 'GET', timestamp, path, params);

  return {
    'ACCESS-KEY': bitgetApiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
  };
};
