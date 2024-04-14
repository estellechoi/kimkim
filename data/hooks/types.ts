export interface ExchangeRateApiData {
    result: string;
    documentation: string;
    terms_of_use: string;
    time_last_update_unix: number;
    time_last_update_utc: string;
    time_next_update_unix: number;
    time_next_update_utc: string;
    base_code: string;
    conversion_rates: { [currencyCode: string]: number };
}

export interface BinanceMarketApiData {
    timezone: string;
    serverTime: number;
    rateLimits: any[];
    exchangeFilters: any[];
    symbols: {
        symbol: string;
        status: string;
        baseAsset: string;
        baseAssetPrecision: number;
        quoteAsset: string;
        quotePrecision: number;
        quoteAssetPrecision: number;
        orderTypes: ('LIMIT' | 'LIMIT_MAKER' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT')[];
        icebergAllowed: boolean;
        ocoAllowed: boolean;
        quoteOrderQtyMarketAllowed: boolean;
        allowTrailingStop: boolean;
        cancelReplaceAllowed: boolean;
        isSpotTradingAllowed: boolean;
        isMarginTradingAllowed: boolean;
        filters: any[];
        permissions: ('SPOT' | 'MARGIN')[];
        defaultSelfTradePreventionMode: string;
        allowedSelfTradePreventionModes: 'NONE'[];
    }[];
}

export type BinanceMarketSymbolDetailApiData = BinanceMarketApiData['symbols'][0];

export interface BinanceTickerApiData {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number; // First tradeId
    lastId: number;  // Last tradeId
    count: number;
}

export interface BinanceSystemStatusApiData {
  status: 0 | 1; // 0: normal，1：system maintenance
  msg: 'normal' | 'system_maintenance';
};

/**
 * 
 * @description bybit api data
 */
export interface BybitApiResponse<T> {
  retCode: number;
  retMsg: string;
  retExtInfo: Record<string, unknown>;
  time: number;
  result: T;
}

export interface BybitTickerItemApiData {
  symbol: string;
  bid1Price: string;
  bid1Size: string;
  ask1Price: string;
  ask1Size: string;
  lastPrice: string;
  prevPrice24h: string;
  price24hPcnt: string;
  highPrice24h: string;
  lowPrice24h: string;
  turnover24h: string;
  volume24h: string;
  usdIndexPrice: string;
}

export interface BybitTickerApiData {
  category?: string;
  list?: readonly BybitTickerItemApiData[];
};

export interface BybitWalletStatusItemApiData {
  name: string;
  coin: string;
  remainAmount: string;
  chains: readonly {
    chainType: string;
    confirmation: string;
    withdrawFee: string;
    depositMin: string;
    withdrawMin: string;
    chain: string;
    chainDeposit: '0' | '1'; // 0: suspend, 1: normal
    chainWithdraw: '0' | '1'; // 0: suspend, 1: normal
    minAccuracy: string;
    withdrawPercentageFee: string;
  }[];
};

export interface BybitWalletStatusApiData {
  rows?: readonly BybitWalletStatusItemApiData[];
}

/**
 * 
 * @description bitget api data
 */
export interface BitgetApiResponse<T> {
  code: string;
  msg: string;
  data: T;
}

export interface BitgetWalletTickerApiData {
  symbol: string;
  high24h: string;
  open: string;
  low24h: string;
  lastPr: string;
  quoteVolume: string;
  baseVolume: string;
  usdtVolume: string;
  bidPr: string;
  askPr: string;
  bidSz: string;
  askSz: string;
  openUtc: string;
  ts: string;
  changeUtc24h: string;
  change24h: string;
};

export interface BitgetWalletStatusApiData {
  coinId: string;
  coin: string;
  transfer: 'true' | 'false';
  chains: readonly {
    chain: string;
    needTag: 'true' | 'false';
    withdrawable: 'true' | 'false';
    rechargeable: 'true' | 'false';
    withdrawFee: string;
    extraWithdrawFee: string;
    depositConfirm: string;
    withdrawConfirm: string;
    minDepositAmount: string;
    minWithdrawAmount: string;
    browserUrl: string;
    contractAddress: string;
    withdrawStep: string;
  }[];
};