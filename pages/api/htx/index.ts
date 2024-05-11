import axios from 'axios';
import { HmacSHA512 } from 'crypto-js';

export const htxAccessKey = process.env.NEXT_PUBLIC_HTX_API_ACCESS_KEY ?? '';
export const htxSecretKey = process.env.NEXT_PUBLIC_HTX_API_SECRET_KEY ?? '';

export const axiosHtxClient = axios.create({
  baseURL: 'https://api.huobi.pro',
  headers: {
    accept: 'application/json',
  },
});

type HtxSignParams = {
  AccessKeyId: string;
  SignatureMethod: string;
  SignatureVersion: string;
  Timestamp: string;
  [key: string]: string;
};

export const getHtxSignaturedURLParams = (
  endpoint: string,
  pararms?: Record<string, string>,
): HtxSignParams & { Signature: string } => {
  const basicParams = {
    AccessKeyId: htxAccessKey,
    SignatureMethod: 'HmacSHA256',
    SignatureVersion: '2',
    Timestamp: new Date()
      .toISOString()
      .replace(/\.\d{3}/, '')
      .replace('Z', ''),
  };

  const signParams: HtxSignParams = {
    ...basicParams,
    ...pararms,
  };

  const signParamsJoint = Object.keys(signParams)
    .sort((a, b) => encodeURIComponent(signParams[a]).localeCompare(encodeURIComponent(signParams[b])))
    .map((key) => `${key}=${encodeURIComponent(signParams[key])}`)
    .join('&');

  const requestMethod = 'GET\n';
  const host = 'api.huobi.pro\n';
  const path = `${endpoint}\n`;
  const payload = `${requestMethod}${host}${path}${signParamsJoint}`;

  const sha512Signature = HmacSHA512(payload, htxSecretKey).toString();
  const encodedSignature = Buffer.from(sha512Signature).toString('base64');

  return { ...signParams, Signature: encodedSignature };
};
