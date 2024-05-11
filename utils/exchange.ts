import { ExchangeWalletStatus } from '@/constants/app';
import {
  BinanceTickerApiData,
  BitgetWalletStatusApiData,
  BitgetWalletTickerApiData,
  BybitTickerApiData,
  BybitTickerItemApiData,
  BybitWalletStatusApiData,
  BybitWalletStatusItemApiData,
} from '@/data/hooks/types';
import { BinanceWalletStatusApiData } from '@/pages/api/binance/wallet';
import { HtxMarketApiData } from '@/pages/api/htx/tickers';
import { HtxWalletStatusApiData } from '@/pages/api/htx/wallet';
import { UpbitTickerApiData } from '@/pages/api/upbit/ticker';
import { UpbitWalletStatusApiData } from '@/pages/api/upbit/wallet';
import { HtxTickerData } from '@/types/htx';
import BigNumber from 'bignumber.js';

export type BaseExchangePriceData = { symbol: string; lastPrice: number; volume: number };
export type QuoteExchangePriceData = { symbol: string; lastPrice: number | undefined; volume: number };

export type ExchangeWalletData = {
  networkType: string;
  status: ExchangeWalletStatus;
  withdrawFeeType: 'fixed' | 'ratio';
  withdrawFee: number | undefined;
  withdrawFeeCurrency: string;
};

/**
 *
 * @description get base exchange price data
 */
export const reduceBaseExchangePriceDataFromUpbit = (
  acc: readonly BaseExchangePriceData[],
  data: UpbitTickerApiData,
): readonly BaseExchangePriceData[] => {
  if (data.market.startsWith('KRW-')) {
    const symbol = data.market.replace('KRW-', '');
    const lastPrice = data.trade_price;
    const volume = BigNumber(data.acc_trade_volume_24h).times(lastPrice).toNumber();
    return [...acc, { symbol, lastPrice, volume }];
  }

  return acc;
};

/**
 *
 * @description get quote exchange price data
 */
export const reduceQuoteExchangePriceDataFromBinance = (
  acc: readonly QuoteExchangePriceData[],
  data: BinanceTickerApiData,
): readonly QuoteExchangePriceData[] => {
  if (data.symbol.endsWith('USDT')) {
    const symbol = data.symbol.replaceAll('USDT', '');
    const lastPrice = parseFloat(data.lastPrice);
    const volume = parseFloat(data.quoteVolume);
    return [...acc, { symbol, lastPrice, volume }];
  }

  return acc;
};

export const reduceQuoteExchangePriceDataFromHtx = (
  acc: readonly QuoteExchangePriceData[],
  data: HtxTickerData,
): readonly QuoteExchangePriceData[] => {
  if (data.symbol.endsWith('usdt')) {
    const symbol = data.symbol.replaceAll('usdt', '').toUpperCase();
    const lastPrice = data.lastPrice;
    const volume = data.vol;
    return [...acc, { symbol, lastPrice, volume }];
  }

  return acc;
};

export const reduceQuoteExchangePriceDataFromBybit = (
  acc: readonly QuoteExchangePriceData[],
  data: BybitTickerItemApiData,
): readonly QuoteExchangePriceData[] => {
  if (data.symbol.endsWith('USDT')) {
    const symbol = data.symbol.replaceAll('USDT', '');
    const lastPrice = parseFloat(data.lastPrice);
    const volume = parseFloat(data.volume24h);
    return [...acc, { symbol, lastPrice, volume }];
  }

  return acc;
};

export const reduceQuoteExchangePriceDataFromBitget = (
  acc: readonly QuoteExchangePriceData[],
  data: BitgetWalletTickerApiData,
): readonly QuoteExchangePriceData[] => {
  if (data.symbol.endsWith('USDT')) {
    const symbol = data.symbol.replaceAll('USDT', '');
    const lastPrice = parseFloat(data.lastPr);
    const volume = parseFloat(data.usdtVolume);
    return [...acc, { symbol, lastPrice, volume }];
  }

  return acc;
};

/**
 *
 * @description get exchange wallet status data
 */
export const getExchangeWalletDataFromUpbit = (data: UpbitWalletStatusApiData): readonly ExchangeWalletData[] => {
  const networkType = data.network_name;
  const withdrawFeeCurrency = data.currency;

  let status: ExchangeWalletStatus;

  switch (data.wallet_state) {
    case 'working':
      status = ExchangeWalletStatus.WORKING;
      break;
    case 'withdraw_only':
      status = ExchangeWalletStatus.WITHDRAW_ONLY;
      break;
    case 'deposit_only':
      status = ExchangeWalletStatus.DEPOSIT_ONLY;
      break;
    case 'paused':
      status = ExchangeWalletStatus.PAUSED;
      break;
    case 'unsupported':
      status = ExchangeWalletStatus.UNSUPPORTED;
  }

  return [{ networkType, status, withdrawFeeType: 'fixed', withdrawFee: undefined, withdrawFeeCurrency }];
};

export const getExchangeWalletDataMapFromUpbit = (
  data: readonly UpbitWalletStatusApiData[],
): Record<string, readonly ExchangeWalletData[]> => {
  return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
    return { ...acc, [item.currency]: getExchangeWalletDataFromUpbit(item) };
  }, {});
};

export const getExchangeWalletDataFromBinance = (data: BinanceWalletStatusApiData): readonly ExchangeWalletData[] => {
  return data.networkList.map((network) => {
    const networkType = network.network;
    const withdrawFee = parseFloat(network.withdrawFee);
    const withdrawFeeCurrency = data.coin;

    let status: ExchangeWalletStatus;

    if (network.depositEnable && network.withdrawEnable) {
      status = ExchangeWalletStatus.WORKING;
    } else if (network.depositEnable) {
      status = ExchangeWalletStatus.DEPOSIT_ONLY;
    } else if (network.withdrawEnable) {
      status = ExchangeWalletStatus.WITHDRAW_ONLY;
    } else {
      status = ExchangeWalletStatus.PAUSED;
    }

    return { networkType, status, withdrawFeeType: 'fixed', withdrawFee, withdrawFeeCurrency };
  });
};

export const getExchangeWalletDataMapFromBinance = (
  data: readonly BinanceWalletStatusApiData[],
): Record<string, readonly ExchangeWalletData[]> => {
  return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
    return { ...acc, [item.coin]: getExchangeWalletDataFromBinance(item) };
  }, {});
};

export const getExchangeWalletDataFromHtx = (data: HtxWalletStatusApiData): readonly ExchangeWalletData[] => {
  return data.chains.map((chain) => {
    const networkType = chain.fullName?.length
      ? chain.fullName
      : chain.displayName?.length
        ? chain.displayName
        : chain.baseChain?.length
          ? chain.baseChain
          : chain.baseChainProtocol?.length
            ? chain.baseChainProtocol
            : chain.chain.length
              ? chain.chain
              : 'Unknown chain';

    const withdrawFeeType = chain.withdrawFeeType === 'ratio' ? 'ratio' : 'fixed';
    const appliedWithrawFee =
      chain.withdrawFeeType === 'fixed'
        ? chain.transactFeeWithdraw
        : chain.withdrawFeeType === 'circulated'
          ? chain.maxTransactFeeWithdraw
          : chain.transactFeeRateWithdraw;
    const withdrawFee = appliedWithrawFee ? parseFloat(appliedWithrawFee) : undefined;
    const withdrawFeeCurrency = data.currency.toUpperCase();

    let status: ExchangeWalletStatus;

    if (chain.depositStatus === 'allowed' && chain.withdrawStatus === 'allowed') {
      status = ExchangeWalletStatus.WORKING;
    } else if (chain.depositStatus === 'allowed') {
      status = ExchangeWalletStatus.DEPOSIT_ONLY;
    } else if (chain.withdrawStatus === 'allowed') {
      status = ExchangeWalletStatus.WITHDRAW_ONLY;
    } else {
      status = ExchangeWalletStatus.PAUSED;
    }

    return { networkType, status, withdrawFeeType, withdrawFee, withdrawFeeCurrency };
  });
};

export const getExchangeWalletDataMapFromHtx = (
  data: readonly HtxWalletStatusApiData[],
): Record<string, readonly ExchangeWalletData[]> => {
  return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
    return { ...acc, [item.currency.toUpperCase()]: getExchangeWalletDataFromHtx(item) };
  }, {});
};

export const getExchangeWalletDataFromBybit = (data: BybitWalletStatusItemApiData): readonly ExchangeWalletData[] => {
  return data.chains.map((chain) => {
    const networkType = chain.chainType;

    const withdrawFeeType = chain.withdrawPercentageFee === '0' ? 'fixed' : 'ratio';
    const withdrawFee =
      withdrawFeeType === 'fixed'
        ? parseFloat(chain.withdrawFee.length ? chain.withdrawFee : '0')
        : parseFloat(chain.withdrawPercentageFee) * 100;
    const withdrawFeeCurrency = data.coin;

    let status: ExchangeWalletStatus;

    if (chain.chainDeposit === '1' && chain.chainWithdraw === '1') {
      status = ExchangeWalletStatus.WORKING;
    } else if (chain.chainDeposit === '1') {
      status = ExchangeWalletStatus.DEPOSIT_ONLY;
    } else if (chain.chainWithdraw === '1') {
      status = ExchangeWalletStatus.WITHDRAW_ONLY;
    } else {
      status = ExchangeWalletStatus.PAUSED;
    }

    return { networkType, status, withdrawFeeType, withdrawFee, withdrawFeeCurrency };
  });
};

export const getExchangeWalletDataMapFromBybit = (
  data: readonly BybitWalletStatusItemApiData[],
): Record<string, readonly ExchangeWalletData[]> => {
  return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
    return { ...acc, [item.coin]: getExchangeWalletDataFromBybit(item) };
  }, {});
};

export const getExchangeWalletDataFromBitget = (data: BitgetWalletStatusApiData): readonly ExchangeWalletData[] => {
  return data.chains.map((chain) => {
    const networkType = chain.chain;

    const withdrawFeeType = 'fixed';
    const withdrawFee = parseFloat(chain.withdrawFee) + parseFloat(chain.extraWithdrawFee);
    const withdrawFeeCurrency = data.coin;

    let status: ExchangeWalletStatus;

    if (chain.rechargeable === 'true' && chain.withdrawable === 'true') {
      status = ExchangeWalletStatus.WORKING;
    } else if (chain.rechargeable === 'true') {
      status = ExchangeWalletStatus.DEPOSIT_ONLY;
    } else if (chain.withdrawable === 'true') {
      status = ExchangeWalletStatus.WITHDRAW_ONLY;
    } else {
      status = ExchangeWalletStatus.PAUSED;
    }

    return { networkType, status, withdrawFeeType, withdrawFee, withdrawFeeCurrency };
  });
};

export const getExchangeWalletDataMapFromBitget = (
  data: readonly BitgetWalletStatusApiData[],
): Record<string, readonly ExchangeWalletData[]> => {
  return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
    return { ...acc, [item.coin]: getExchangeWalletDataFromBitget(item) };
  }, {});
};
