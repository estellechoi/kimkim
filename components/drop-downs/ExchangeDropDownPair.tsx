import DropDown from "@/components/DropDown";
import { Exchanges } from "@/constants/app";
import { useState } from "react";
import ExchangeLogo from "../ExchangeLogo";
import Icon from "@/components/Icon";

const ExchangeDropDownLabel = ({ exchange }: { exchange: Exchanges }) => {
    return <div className="flex items-center gap-x-2 Font_label_12px"><ExchangeLogo exchange={exchange} /><span>{exchange}</span></div>;
}

type ExchangeDropDownPairProps = {
    className?: string;
};

const BASE_EXCHANGES = [Exchanges.UPBIT];
const QUOTE_EXCHANGES = [Exchanges.BINANCE];

const ExchangeDropDownPair = ({ className = '' }: ExchangeDropDownPairProps) => {
    const [baseExchange, setBaseExchange] = useState<Exchanges>(Exchanges.UPBIT);
    const [quoteExchange, setQuoteExchange] = useState<Exchanges>(Exchanges.BINANCE);

    return (
        <div className={`flex items-center gap-x-2 ${className}`}>
          <DropDown<Exchanges>
            size="sm"
            placeholder="Select"
            defaultKey={baseExchange}
            options={BASE_EXCHANGES.map(exchange => ({ label: <ExchangeDropDownLabel exchange={exchange} />, key: exchange }))}
            onChange={setBaseExchange}
          />

          <Icon type="arrow_back" className="text-caption" />

          <DropDown<Exchanges>
            size="sm"
            placeholder="Select"
            defaultKey={quoteExchange}
            options={QUOTE_EXCHANGES.map(exchange => ({ label: <ExchangeDropDownLabel exchange={exchange} />, key: exchange }))}
            onChange={setQuoteExchange}
          />
        </div>
    )
}

export default ExchangeDropDownPair;