import axios from 'axios';
import { createHmac } from 'crypto';

export const kimkimApiKey = process.env.NEXT_PUBLIC_KIMKIM_API_KEY;
export const kimkimSecretKey = process.env.NEXT_PUBLIC_KIMKIM_SECRET_KEY;

export const getKimKimApiSignature = async (apiKey: string | undefined | null, secreteKey: string | undefined | null) => {
  if (!secreteKey || !apiKey) {
    return '';
  }

  const encoder = new TextEncoder();
  const encodedSecretKey = encoder.encode(secreteKey);
  const payloadData = encoder.encode(apiKey);

  const cryptoKey = await crypto.subtle.importKey('raw', encodedSecretKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

  const signatureArrayBuffer = await crypto.subtle.sign('HMAC', cryptoKey, payloadData);
  const signatureHex = Array.from(new Uint8Array(signatureArrayBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return signatureHex;
  // return createHmac('sha256', secreteKey).update(apiKey).digest('hex');
};

const kimkimAxios = axios.create({
  baseURL: 'https://kimkim.space',
  headers: {
    'x-kimkim-api-key': process.env.NEXT_PUBLIC_KIMKIM_API_KEY,
    // 'x-kimkim-signature': await getKimKimApiSignature(process.env.NEXT_PUBLIC_KIMKIM_API_KEY, process.env.NEXT_PUBLIC_KIMKIM_SECRET_KEY),
  },
});

export default kimkimAxios;
