import { ExchangeWalletStatus, Exchanges } from "@/constants/app";
import { ExchangeWalletData } from "@/utils/exchange";
import ExchangeLogo from "../ExchangeLogo";
import StatusDot from "../StatusDot";
import { formatKRW, formatNumber } from "@/utils/number";
import { useCallback, useMemo } from "react";
import BigNumber from "bignumber.js";

type ExchangeNetworkLabelProps = {
    exchange: Exchanges;
    networks: readonly ExchangeWalletData[] | undefined;
    fundType: 'deposit' | 'withdraw';
    feeCurrencyPriceKrw?: number;
}

const FUND_TYPE_DICT: Record<ExchangeNetworkLabelProps['fundType'], { label: string; workingStatuses: readonly ExchangeWalletStatus[] }> = {
    deposit: {
        label: '입금',
        workingStatuses: [ExchangeWalletStatus.WORKING, ExchangeWalletStatus.DEPOSIT_ONLY],
    },
    withdraw: {
        label: '출금',
        workingStatuses: [ExchangeWalletStatus.WORKING, ExchangeWalletStatus.WITHDRAW_ONLY],
    }
}

const ExchangeNetworkLabel = ({ exchange, networks, fundType, feeCurrencyPriceKrw }: ExchangeNetworkLabelProps) => {
    const { label, workingStatuses } = FUND_TYPE_DICT[fundType];

    const getWithdrawFeeKrw = useCallback((withdrawFee: number): BigNumber | undefined => {
        return feeCurrencyPriceKrw ? BigNumber(withdrawFee).times(feeCurrencyPriceKrw) : undefined;
    }, [feeCurrencyPriceKrw]);

    const sortedNetwors = useMemo<readonly ExchangeWalletData[] | undefined>(() => {
        return networks? [...networks].sort((a, b) => a.status.localeCompare(b.status)): undefined;
    }, [networks])

    return (
        <div className="flex items-start gap-x-2 Font_caption_xs text-caption">
            <div className="flex items-center gap-x-2">
                <ExchangeLogo size="sm" exchange={exchange} /> 
                <span>{label}</span> 
            </div>

            <div className="flex flex-col">
                {sortedNetwors?.map(network => (
                    <div key={network.networkType} className="flex items-center gap-x-2">
                        <span>{network?.networkType}</span>
                        
                        <StatusDot 
                            status={network?.status && workingStatuses.includes(network.status) ? 'success' : 'neutral'}
                            // label={networks?.status}
                        />

                        {workingStatuses.includes(network.status) && network.withdrawFee !== undefined && (
                            <span className="flex items-baseline gap-x-0.5 Font_caption_xs_num text-semantic_success">
                                {/* <span>{formatNumber(network.withdrawFee)}</span> */}
                                {/* <span className="Font_caption_xs">{network.withdrawFeeCurrency}</span> */}
                                <span>{network?.withdrawFeeType === 'fixed'
                                    ? formatKRW(getWithdrawFeeKrw(network.withdrawFee), { semiequate: true }) 
                                    : `${formatNumber(network.withdrawFee)}%`}
                                </span>
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExchangeNetworkLabel;