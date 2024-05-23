import axios from 'axios';
import { v4 } from 'uuid';
import jsonwebtoken from 'jsonwebtoken';

const upbitAccessKey = process.env.NEXT_PUBLIC_UPBIT_OPEN_API_ACCESS_KEY ?? '';
const upbitSecretKey = process.env.NEXT_PUBLIC_UPBIT_OPEN_API_SECRET_KEY ?? '';

export const axiosUpbitClient = axios.create({
  baseURL: 'https://api.upbit.com',
  headers: {
    accept: 'application/json',
    // Authorization,
  },
});

export const getUpbitAuthorizationHeader = (): string => {
  const payload = {
    access_key: upbitAccessKey,
    nonce: v4(),
  };

  const jwt = jsonwebtoken.sign(payload, upbitSecretKey, { algorithm: 'HS256' });

  const authorization = `Bearer ${jwt}`;

  return authorization;
};
