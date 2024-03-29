import { ExchangeWalletStatus, Exchanges } from "@/constants/app";
import { ExchangeWalletData } from "@/utils/exchange";
import ExchangeLogo from "../ExchangeLogo";
import StatusDot from "../StatusDot";

type ExchangeNetworkLabelProps = {
    exchange: Exchanges;
    networks: readonly ExchangeWalletData[] | undefined;
    fundType: 'deposit' | 'withdraw';
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

const ExchangeNetworkLabel = ({ exchange, networks, fundType }: ExchangeNetworkLabelProps) => {
    const { label, workingStatuses } = FUND_TYPE_DICT[fundType];

    return (
        <div className="flex items-center gap-x-2 Font_caption_xs text-caption">
            <ExchangeLogo size="sm" exchange={exchange} /> 

            <span>{label}</span> 

            {networks?.map(network => (
                <div key={network.networkType} className="flex items-center gap-x-1">
                    <span>{network?.networkType}</span>
                    <StatusDot 
                        status={network?.status && workingStatuses.includes(network.status) ? 'success' : 'error'}
                        // label={networks?.status}
                    />
                </div>
            ))}
        </div>
    )
}

export default ExchangeNetworkLabel;