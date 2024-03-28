import Coin from "@/components/Coin";
import Icon from "@/components/Icon";
import AppSymbolSVG from "@/components/svgs/AppSymbolSVG";
import { KimchiPremiumTableRow } from "@/components/tables/KimchiPremiumTable";
import { formatKRW, formatNumber } from "@/utils/number";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { BaseExchangePriceData, QuoteExchangePriceData } from "@/utils/exchange";
import { useAtom } from "jotai";
import { tokenKoreanNameMapAtom } from "@/store/states";

type UseGetPremiumTableRowsProps = {
    watchListSymbols: Set<string>;
    onToggleWatchList: (symbol: string) => void;
    krwByUsd: number | null;
    audByUsd: number | null;
}

const useGetPremiumTableRows = ({ watchListSymbols, onToggleWatchList, krwByUsd, audByUsd }: UseGetPremiumTableRowsProps) => {
    const [tokenKoreanNameMap] = useAtom(tokenKoreanNameMapAtom);

    const getPremiumTableRows = useCallback((baseExchangeData: readonly BaseExchangePriceData[], quoteExchangeData: readonly QuoteExchangePriceData[]): readonly KimchiPremiumTableRow[] => {
        // map table rows
        return baseExchangeData.map(item => {
          const { symbol, price: baseExchangePrice, volume: baseExchangeVolume } = item;

          const koreanName = tokenKoreanNameMap?.[symbol] ?? symbol;

          const symbolLabel = (
            <div className="flex items-center gap-x-2">
              <Coin symbol={symbol} size="sm" />
              <div className="inline-flex items-center gap-x-2 Font_label_14px">{koreanName}<span className="Font_caption_xs text-caption">{symbol}</span></div>
            </div>
          );

          const quoteExchangeItem = quoteExchangeData.find(({ symbol: quoteExchangeSymbol }) => quoteExchangeSymbol === symbol);

          const quoteExchangePrice = quoteExchangeItem?.price;
          const quoteExchangeVolume = quoteExchangeItem?.volume;

          const quoteExchangePriceKrw = quoteExchangePrice ? BigNumber(quoteExchangePrice).multipliedBy(krwByUsd ?? 0) : undefined;
    
          const priceLabel = (
            <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
              <div>{formatKRW(baseExchangePrice, { fixDp: true })}</div>
              <div className="text-caption">{formatKRW(quoteExchangePriceKrw, { fixDp: true })}</div>
            </div>
          );
    
    
          const premium = quoteExchangePriceKrw?.gt(0) ? BigNumber(baseExchangePrice).minus(quoteExchangePriceKrw).div(quoteExchangePriceKrw).multipliedBy(100) : null;
          const premiumLabel = (
            <div className="flex items-center gap-x-1">
              {premium?.gte(10) && <Icon type="fire" size="md" className="text-semantic_danger" />}
    
              <div className={`inline-flex items-baseline gap-x-0.5 Font_data_16px_num ${premium === null ? 'text-caption' : premium.gt(0) ? 'text-semantic_bull' : 'text-semantic_bear'}`}>
                <span>{formatNumber(premium, 2)}</span>
                {premium !== null && <span className="Font_data_14px_unit">%</span>}
              </div>
            </div>
          );
    
          const quoteExchangeVolumeKrw = quoteExchangeVolume ? BigNumber(quoteExchangeVolume).multipliedBy(krwByUsd ?? 0) : undefined;
          const volumeLabel = (
            <div className="flex flex-col items-end gap-x-2 text-right Font_data_14px_num">
              <div>{formatKRW(baseExchangeVolume, { fixDp: true, compact: true })}</div>
              <div className="text-caption">{formatKRW(quoteExchangeVolumeKrw, { fixDp: true, compact: true })}</div>
            </div>
          );
    
          const isWatchList = watchListSymbols.has(symbol);
          const updateWatchListButton = (
            <button type="button" onClick={() => onToggleWatchList(symbol)}>
              <AppSymbolSVG className={`w-4 h-4 ${isWatchList ? 'text-primary' : 'text-caption'}`} />
              <span className="sr-only">즐겨찾기 {isWatchList ? '해제' : '추가'}</span>
            </button>
          )
    
          return {
            id: symbol,
            symbol: symbol,
            koreanName,
            symbolLabel,
            price: baseExchangePrice,
            priceLabel,
            premium: premium ?? BigNumber(0),
            premiumLabel,
            volume: baseExchangeVolume,
            volumeLabel,
            isWatchList,
            updateWatchListButton,
          };
        
        }) ?? [];
      }, [tokenKoreanNameMap, watchListSymbols, onToggleWatchList, krwByUsd]);

      return {
        getPremiumTableRows,
      }
}

export default useGetPremiumTableRows;