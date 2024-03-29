import { ExchangeWalletStatus } from "@/constants/app";
import { BinanceTickerApiData, BinanceWalletStatusApiData } from "@/data/hooks/types";
import { HtxMarketApiData } from "@/pages/api/htx/ticker";
import { HtxWalletStatusApiData } from "@/pages/api/htx/wallet";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { UpbitTickerApiData } from "@/pages/api/upbit/ticker";
import { UpbitWalletStatusApiData } from "@/pages/api/upbit/wallet";
import BigNumber from "bignumber.js";

export type BaseExchangePriceData = { symbol: string; price: number; volume: number };
export type QuoteExchangePriceData = { symbol: string; price: number; volume: number };

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
export const reduceBaseExchangePriceDataFromUpbit = (acc: readonly BaseExchangePriceData[], data: UpbitTickerApiData): readonly BaseExchangePriceData[] => {
    if (data.market.startsWith('KRW-')) {
        const symbol = data.market.replace('KRW-', '');
        const price = data.opening_price;
        const volume = BigNumber(data.acc_trade_volume_24h).times(data.opening_price).toNumber();
        return [...acc, { symbol, price, volume }];
    }

    return acc;
}

/**
 * 
 * @description get quote exchange price data
 */
export const reduceQuoteExchangePriceDataFromBinance = (acc: readonly QuoteExchangePriceData[], data: BinanceTickerApiData): readonly QuoteExchangePriceData[] => {
    if (data.symbol.endsWith('USDT')){
        const symbol = data.symbol.replaceAll('USDT', '');
        const price = parseFloat(data.openPrice);
        const volume = parseFloat(data.quoteVolume);
        return [...acc, { symbol, price, volume }];    
    }

    return acc;
}

export const reduceQuoteExchangePriceDataFromHtx = (acc: readonly QuoteExchangePriceData[], data: HtxMarketApiData): readonly QuoteExchangePriceData[] => {
    if (data.symbol.endsWith('usdt')){
        const symbol = data.symbol.replaceAll('usdt', '').toUpperCase();
        const price = data.open;
        const volume = data.vol;
        return [...acc, { symbol, price, volume }];    
    }

    return acc;
}

/**
 * 
 * @description get exchange wallet status data
 */
export const getExchangeWalletDataFromUpbit = (data: UpbitWalletStatusApiData): readonly ExchangeWalletData[] => {
    const networkType = data.network_name;
    const withdrawFeeCurrency = data.currency;

    let status: ExchangeWalletStatus;

    switch (data.wallet_state){
        case ('working'): status = ExchangeWalletStatus.WORKING; break;
        case ('withdraw_only'): status = ExchangeWalletStatus.WITHDRAW_ONLY; break;
        case ('deposit_only'): status = ExchangeWalletStatus.DEPOSIT_ONLY; break;
        case ('paused'): status = ExchangeWalletStatus.PAUSED; break;
        case ('unsupported'): status = ExchangeWalletStatus.UNSUPPORTED;
    }

    return [{ networkType, status, withdrawFeeType: 'fixed', withdrawFee: undefined, withdrawFeeCurrency }];
}

export const getExchangeWalletDataMapFromUpbit = (data: readonly UpbitWalletStatusApiData[]): Record<string, readonly ExchangeWalletData[]> => {
    return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
        return { ...acc, [item.currency]: getExchangeWalletDataFromUpbit(item) };
    }, {});
}

export const getExchangeWalletDataFromBinance = (data: BinanceWalletStatusApiData): readonly ExchangeWalletData[] => {
    return data.networkList.map(network => {
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
}

export const getExchangeWalletDataMapFromBinance = (data: readonly BinanceWalletStatusApiData[]): Record<string, readonly ExchangeWalletData[]> => {
    return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
        return { ...acc, [item.coin]: getExchangeWalletDataFromBinance(item) };
    }, {});
}

export const getExchangeWalletDataFromHtx = (data: HtxWalletStatusApiData): readonly ExchangeWalletData[] => {
    return data.chains.map(chain => {
        const networkType = chain.fullName?.length ? chain.fullName : chain.displayName?.length ? chain.displayName : chain.baseChain?.length ? chain.baseChain : chain.baseChainProtocol?.length ? chain.baseChainProtocol : chain.chain.length ? chain.chain : 'Unknown chain';

        const withdrawFeeType = chain.withdrawFeeType === 'ratio' ? 'ratio' : 'fixed';
        const appliedWithrawFee = chain.withdrawFeeType === 'fixed' ? chain.transactFeeWithdraw : chain.withdrawFeeType === 'circulated' ? chain.maxTransactFeeWithdraw : chain.transactFeeRateWithdraw;
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
}

export const getExchangeWalletDataMapFromHtx = (data: readonly HtxWalletStatusApiData[]): Record<string, readonly ExchangeWalletData[]> => {
    return data.reduce<Record<string, readonly ExchangeWalletData[]>>((acc, item) => {
        return { ...acc, [item.currency.toUpperCase()]: getExchangeWalletDataFromHtx(item) };
    }, {});
}