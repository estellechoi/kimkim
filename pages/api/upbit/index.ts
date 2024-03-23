import axios from 'axios';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

const upbitOpenApiPayload = {
    access_key: process.env.NEXT_PUBLIC_UPBIT_OPEN_API_ACCESS_KEY,
    nonce: v4(),
}

const jwtToken = jwt.sign(upbitOpenApiPayload, process.env.NEXT_PUBLIC_UPBIT_OPEN_API_SECRET_KEY ?? '');

const authorization = `Bearer ${jwtToken}`;

export const axiosUpbitClient = axios.create({
    baseURL: 'https://api.upbit.com',
    headers: {
        accept: 'application/json',
        authorization,
    },
});