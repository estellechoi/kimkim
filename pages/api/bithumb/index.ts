import axios from 'axios';
import { HmacSHA512 } from 'crypto-js';

export type BithumbApiResponse<T> = Readonly<{
  status: string;
  data: T;
  date: string;
}>;

export const bithumbConnectKey = process.env.NEXT_PUBLIC_BITHUMB_API_CONNECT_KEY ?? '';
export const bithumbSecretKey = process.env.NEXT_PUBLIC_BITHUMB_API_SECRET_KEY ?? '';

export const axiosBithumbClient = axios.create({
  baseURL: 'https://api.bithumb.com',
  headers: {
    accept: 'application/json',
  },
});

export const getBithumbAuthorizedHeaders = (endpoint: string, pararms?: Record<string, string>): Record<string, string> => {
  const queryString = new URLSearchParams(pararms).toString();
  const nonce = Date.now().toString();
  const payload = `${endpoint};endpoint=${endpoint.replaceAll('/', '%2F')}?${queryString};${nonce}`;
  const sha512Signature = HmacSHA512(payload, bithumbSecretKey).toString();
  const encodedSignature = Buffer.from(sha512Signature).toString('base64');

  return {
    'api-client-type': '2',
    'Api-Key': bithumbConnectKey,
    'Api-Sign': encodedSignature,
    'Api-Nonce': nonce,
  };
};
