import type { HtxMarketApiData } from "@/pages/api/htx/tickers";

export interface HtxTickerData extends HtxMarketApiData {
    lastPrice?: number;
    lastSize?: number;
}