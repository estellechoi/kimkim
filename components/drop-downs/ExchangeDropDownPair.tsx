import DropDown from "@/components/DropDown";
import { BASE_EXCHANGES, BaseExchange, Exchanges, QUOTE_EXCHANGES, QuoteExchange } from "@/constants/app";
import ExchangeLogo from "../ExchangeLogo";
import Icon from "@/components/Icon";

const ExchangeDropDownLabel = ({ exchange }: { exchange: Exchanges }) => {
    return <div className="flex items-center gap-x-2 Font_label_12px"><ExchangeLogo exchange={exchange} /><span>{exchange}</span></div>;
}

type ExchangeDropDownPairProps = {
    baseExchange?: BaseExchange;
    quoteExchange?: QuoteExchange;
    onBaseExchangeChange?: (exchange: BaseExchange) => void;
    onQuoteExchangeChange?: (exchange: QuoteExchange) => void;
    className?: string;
};


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

          <DropDown<QuoteExchange>
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