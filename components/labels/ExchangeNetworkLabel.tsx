import { ExchangeWalletStatus, Exchanges } from "@/constants/app";
import { ExchangeWalletData } from "@/utils/exchange";
import ExchangeLogo from "@/components/ExchangeLogo";
import StatusDot from "@/components/StatusDot";
import { formatKRW, formatNumber } from "@/utils/number";
import { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";

type ExchangeNetworkFeeLabelProps = { network: ExchangeWalletData; fundType: 'deposit' | 'withdraw'; feeCurrencyPriceKrw?: number };

const FUND_TYPE_DICT: Record<ExchangeNetworkFeeLabelProps['fundType'], { label: string; workingStatuses: readonly ExchangeWalletStatus[] }> = {
    deposit: {
        label: '입금',
        workingStatuses: [ExchangeWalletStatus.WORKING, ExchangeWalletStatus.DEPOSIT_ONLY],
    },
    withdraw: {
        label: '출금',
        workingStatuses: [ExchangeWalletStatus.WORKING, ExchangeWalletStatus.WITHDRAW_ONLY],
    }
}

const ExchangeNetworkFeeLabel = ({ network, fundType, feeCurrencyPriceKrw }: ExchangeNetworkFeeLabelProps) => {
    const { workingStatuses } = FUND_TYPE_DICT[fundType];

    const getWithdrawFeeKrw = useCallback((withdrawFee: number): BigNumber | undefined => {
        return feeCurrencyPriceKrw ? BigNumber(withdrawFee).times(feeCurrencyPriceKrw) : undefined;
    }, [feeCurrencyPriceKrw]);

    return (
        <div key={network.networkType} className="flex items-center gap-x-2">
            <span>{network.networkType}</span>
            
            <StatusDot 
                status={network.status && workingStatuses.includes(network.status) ? 'success' : 'neutral'}
                // label={networks?.status}
            />

            {workingStatuses.includes(network.status) && network.withdrawFee !== undefined && (
                <span className="flex items-baseline gap-x-0.5 Font_caption_xs_num text-semantic_success">
                    {/* <span>{formatNumber(network.withdrawFee)}</span> */}
                    {/* <span className="Font_caption_xs">{network.withdrawFeeCurrency}</span> */}
                    <span>{network.withdrawFeeType === 'fixed'
                        ? formatKRW(getWithdrawFeeKrw(network.withdrawFee)) 
                        : `${formatNumber(network.withdrawFee)}%`}
                    </span>
                </span>
            )}
        </div>
    );
}

type ExchangeNetworkLabelProps = {
    exchange: Exchanges;
    networks: readonly ExchangeWalletData[] | undefined;
    fundType: ExchangeNetworkFeeLabelProps['fundType'];
    feeCurrencyPriceKrw?: number;
}

const ExchangeNetworkLabel = ({ exchange, networks, fundType, feeCurrencyPriceKrw }: ExchangeNetworkLabelProps) => {
    const { label } = FUND_TYPE_DICT[fundType];

    const getWithdrawFeeKrw = useCallback((withdrawFee: number): BigNumber | undefined => {
        return feeCurrencyPriceKrw ? BigNumber(withdrawFee).times(feeCurrencyPriceKrw) : undefined;
    }, [feeCurrencyPriceKrw]);

    const sortedNetworks = useMemo<readonly ExchangeWalletData[] | undefined>(() => {
        return networks? [...networks].sort((a, b) => {
            const compare = a.status.localeCompare(b.status);

            if (compare !== 0) return compare;
            if (a.withdrawFee === undefined || b.withdrawFee === undefined) return compare;

            const aWithdrawFeeKrw = getWithdrawFeeKrw(a.withdrawFee);
            const bWithdrawFeeKrw = getWithdrawFeeKrw(b.withdrawFee);

            if (aWithdrawFeeKrw === undefined || bWithdrawFeeKrw === undefined) return compare;

            return aWithdrawFeeKrw.gt(bWithdrawFeeKrw) ? 1 : -1;
        }): undefined;
    }, [networks, getWithdrawFeeKrw])

    return (
        <div className="flex items-start gap-x-2 Font_caption_xs text-caption">
            <div className="flex items-center gap-x-2">
                <ExchangeLogo size="sm" exchange={exchange} /> 
                <span>{label}</span> 
            </div>

            <div className="flex flex-col">
                {sortedNetworks?.[0] && (
                    <div className="flex items-center gap-x-2">
                        <ExchangeNetworkFeeLabel network={sortedNetworks[0]} fundType={fundType} feeCurrencyPriceKrw={feeCurrencyPriceKrw} />
                        
                        {sortedNetworks.length > 1 && (
                            <Tooltip layer="base" placement="bottom-end" content={(
                                <div className="flex flex-col">
                                    {sortedNetworks?.map(network => (
                                        <ExchangeNetworkFeeLabel network={network} fundType={fundType} feeCurrencyPriceKrw={feeCurrencyPriceKrw} />
                                    ))}
                                </div>
                            )}>
                                <Icon 
                                    type="more"
                                    className="text-caption" 
                                />
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExchangeNetworkLabel;