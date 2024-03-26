import Polling from "@/components/Polling";
import { Fiats } from "@/constants/app";
import { coinGeckoCoinMapAtom, currencyExchangeRateAtom, selectedCurrencyAtom } from "@/store/states";
import { FormatCurrencyFunction, formatKRW, formatUSD } from "@/utils/number";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useMemo } from "react";

type USDTPricePollingProps = {
    className?: string;
};

const TEXT_FORMATTER_DICT: Record<Fiats, FormatCurrencyFunction> = {
    [Fiats.KRW]: formatKRW,
    [Fiats.USD]: formatUSD,
    [Fiats.AUD]: formatUSD,
};

const USDTPricePolling = ({ className = '' }: USDTPricePollingProps) => {
    const [coinGeckoCoinMap] = useAtom(coinGeckoCoinMapAtom);

    const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
    const [selectedCurrency] = useAtom(selectedCurrencyAtom);
    const selectedCurrencyExchangeRate = currencyExchangeRate.rates[selectedCurrency];

    const usdtPriceInSelectedCurrency = useMemo<BigNumber | undefined>(() => {
        const usdtPriceUsd = coinGeckoCoinMap?.USDT?.current_price;
        return usdtPriceUsd && selectedCurrencyExchangeRate ? BigNumber(usdtPriceUsd).times(selectedCurrencyExchangeRate) : undefined;
    }, [coinGeckoCoinMap?.USDT?.current_price])

    const format = TEXT_FORMATTER_DICT[selectedCurrency];

    return (
        <Polling
            caption="USDT"
            formattedNumber={`${usdtPriceInSelectedCurrency ? format(usdtPriceInSelectedCurrency, { semiequate: true }) : '?'}`}
            isLoading={!usdtPriceInSelectedCurrency}
            className={className}
        />
    )
}

export default USDTPricePolling;