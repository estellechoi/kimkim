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
  };
  
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
  };

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