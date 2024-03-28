import { BinanceTickerApiData } from "@/data/hooks/types";
import { HtxMarketApiData } from "@/pages/api/htx/ticker";
import { UpbitMarketApiData } from "@/pages/api/upbit/market";
import { UpbitTickerApiData } from "@/pages/api/upbit/ticker";
import BigNumber from "bignumber.js";

export type BaseExchangePriceData = { symbol: string; price: number; volume: number };
export type QuoteExchangePriceData = { symbol: string; price: number; volume: number };

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
        const volume = data.vol; // BigNumber(data.vol).times(data.open).toNumber();
        return [...acc, { symbol, price, volume }];    
    }

    return acc;
}