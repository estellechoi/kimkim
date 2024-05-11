import type { NextApiRequest, NextApiResponse } from 'next';
import {
  axiosBinanceClient,
  binanceApiKey,
  binanceSecretKey,
  fetchBinanceServerTime,
  getBinanceAuthorizedHeaders,
  getBinanceSignaturedParams,
} from '.';

export interface BinanceNetworkApiData {
  addressRegex: string;
  coin: string;
  depositDesc?: string;
  depositEnable?: boolean;
  isDefault: boolean;
  memoRegex: string;
  minConfirm: number;
  name: string;
  network: string;
  resetAddressStatus: boolean;
  specialTips: string;
  unLockConfirm: number;
  withdrawDesc?: string;
  withdrawEnable: boolean;
  withdrawFee: string;
  withdrawIntegerMultiple: string;
  withdrawMax: string;
  withdrawMin: string;
  sameAddress: boolean;
  estimatedArrivalTime: number;
  busy: boolean;
}

export interface BinanceWalletStatusApiData {
  coin: string;
  depositAllEnable: boolean;
  free: string;
  freeze: string;
  ipoable: string;
  ipoing: string;
  isLegalMoney: boolean;
  locked: string;
  name: string;
  networkList: readonly BinanceNetworkApiData[];
  storage: string;
  trading: boolean;
  withdrawAllEnable: boolean;
  withdrawing: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<readonly BinanceWalletStatusApiData[] | undefined>) => {
  const authorizedHeaders = getBinanceAuthorizedHeaders(binanceApiKey);

  const recvWindow = '5000';
  const timestamp = (await fetchBinanceServerTime())?.toString() ?? new Date().getTime().toString();
  const signaturedParams = getBinanceSignaturedParams(binanceSecretKey, { recvWindow, timestamp });

  const response = await axiosBinanceClient
    .get<
      readonly BinanceWalletStatusApiData[] | undefined
    >('/sapi/v1/capital/config/getall', { headers: authorizedHeaders, params: signaturedParams })
    .catch((err) => {
      return { status: err.response?.status, data: err.response?.data };
    });

  res.status(response.status ?? 500).json(response.data);
};

export default handler;
