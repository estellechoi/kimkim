import DropDown from "@/components/DropDown";
import { Exchanges } from "@/constants/app";
import { useState } from "react";
import ExchangeLogo from "../ExchangeLogo";
import Icon from "@/components/Icon";

const ExchangeDropDownLabel = ({ exchange }: { exchange: Exchanges }) => {
    return <div className="flex items-center gap-x-2 Font_label_12px"><ExchangeLogo exchange={exchange} /><span>{exchange}</span></div>;
}

export type BaseExchange = Exchanges.UPBIT;
export type QuoteExchnage = Exchanges.BINANCE | Exchanges.HTX;

type ExchangeDropDownPairProps = {
    baseExchange?: BaseExchange;
    quoteExchange?: QuoteExchnage;
    onBaseExchangeChange?: (exchange: Exchanges.UPBIT) => void;
    onQuoteExchangeChange?: (exchange: Exchanges.BINANCE | Exchanges.HTX) => void;
    className?: string;
};

const BASE_EXCHANGES: readonly BaseExchange[] = [Exchanges.UPBIT];
const QUOTE_EXCHANGES: readonly QuoteExchnage[] = [Exchanges.BINANCE, Exchanges.HTX];

const ExchangeDropDownPair = ({ baseExchange = Exchanges.UPBIT, quoteExchange = Exchanges.BINANCE, onBaseExchangeChange, onQuoteExchangeChange, className = '' }: ExchangeDropDownPairProps) => {
    return (
        <div className={`flex items-center gap-x-2 ${className}`}>
          <DropDown<BaseExchange>
            size="sm"
            placeholder="Select"
            defaultKey={baseExchange}
            options={BASE_EXCHANGES.map(exchange => ({ label: <ExchangeDropDownLabel exchange={exchange} />, key: exchange }))}
            onChange={(exchange) => onBaseExchangeChange?.(exchange)}
          />

          <Icon type="arrow_back" className="text-caption" />

          <DropDown<QuoteExchnage>
            size="sm"
            placeholder="Select"
            defaultKey={quoteExchange}
            options={QUOTE_EXCHANGES.map(exchange => ({ label: <ExchangeDropDownLabel exchange={exchange} />, key: exchange }))}
            onChange={(exchange) => onQuoteExchangeChange?.(exchange)}
          />
        </div>
    )
}

export default ExchangeDropDownPair;