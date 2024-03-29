import Table from "@/components/Table";
import BigNumber from "bignumber.js";
import { TableRowData } from "../Table/types";
import StatusDot from "../StatusDot";

export interface KimchiPremiumTableRow extends TableRowData {
    symbol: string;
    symbolLabel: JSX.Element | string;
    koreanName: string;
    walletLabel: JSX.Element;
    price: number;
    priceLabel: JSX.Element | string;
    premium: BigNumber;
    premiumLabel: JSX.Element | string;
    volume: number;
    volumeLabel: JSX.Element | string;
    isWatchList: boolean;
    updateWatchListButton: JSX.Element;
}
  
type KimchiPremiumTableProps = {
    rows: readonly KimchiPremiumTableRow[];
    isLoading?: boolean;
};

const KimchiPremiumTable = ({ rows, isLoading }: KimchiPremiumTableProps) => {
    return (
      <Table<KimchiPremiumTableRow>
        // hasMouseEffect={true}
        tooltipContext="base"
        dSortValue="premium"
        rows={rows}
        isLoading={isLoading}
        fields={[
          {
            label: '코인',
            value: 'symbolLabel',
            type: 'jsx',
            sortType: 'string',
            sortValue: 'koreanName',
            widthRatio: 14,
          },
          {
            label: '네트워크 수수료',
            value: 'walletLabel',
            type: 'jsx',
            sortType: 'string',
            sortValue: 'koreanName',
            widthRatio: 32,
            tooltipContent: (
              <div className="flex flex-col gap-y-1 Font_body_xs">
                <div className="flex items-center gap-x-2">
                  <StatusDot status="success" />
                  <span>입/출금 가능</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <StatusDot status="neutral" />
                  <span>입/출금 불가</span>
                </div>
              </div>
            )
          },
          {
            label: '가격',
            value: 'priceLabel',
            type: 'jsx',
            sortType: 'number',
            sortValue: 'price',
            align: 'right',
          },
          {
            label: '프리미엄',
            value: 'premiumLabel',
            type: 'jsx',
            sortType: 'bignumber',
            sortValue: 'premium',
            align: 'right',
            widthRatio: 14,
          },
          {
            label: '24시간 거래량',
            value: 'volumeLabel',
            type: 'jsx',
            sortType: 'number',
            sortValue: 'volume',
            align: 'right',
            widthRatio: 20,
          },
          {
            label: '',
            value: 'updateWatchListButton',
            type: 'jsx',
            sortDisabled: true,
            align: 'right',
            widthRatio: 6,
          },
        ]}
      >
        <Table.FieldRow />
      </Table>
    )
}

export default KimchiPremiumTable;