import Table from "@/components/Table";
import BigNumber from "bignumber.js";
import { TableRowData } from "../Table/types";

export interface KimchiPremiumTableRow extends TableRowData {
    symbol: string;
    symbolLabel: JSX.Element | string;
    koreanName: string;
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
          },
          {
            label: '가격',
            value: 'priceLabel',
            type: 'jsx',
            sortType: 'number',
            sortValue: 'price',
            align: 'right',
            widthRatio: 20,
          },
          {
            label: '프리미엄',
            value: 'premiumLabel',
            type: 'jsx',
            sortType: 'bignumber',
            sortValue: 'premium',
            align: 'right',
            widthRatio: 20,
          },
          {
            label: '24시간 거래량',
            value: 'volumeLabel',
            type: 'jsx',
            sortType: 'number',
            sortValue: 'volume',
            align: 'right',
            widthRatio: 30,
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