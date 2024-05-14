import Table from '@/components/Table';
import BigNumber from 'bignumber.js';
import { TableField, TableRowData } from '@/components/Table/types';
import NetworkFeeInfoTooltipContent from '@/components/kits/NetworkFeeInfoTooltipContent';
import useUserAgent from '@/hooks/useUserAgent';
import { ReactNode, useMemo } from 'react';

export interface KimchiPremiumTableRow extends TableRowData {
  symbol: string;
  symbolLabel: ReactNode;
  koreanName: string;
  walletLabel: ReactNode;
  price: number;
  priceLabel: ReactNode;
  premium: BigNumber;
  premiumLabel: ReactNode;
  volume: number;
  volumeLabel: ReactNode;
  isWatchList: boolean;
  updateWatchListButton: ReactNode;
}

type KimchiPremiumTableProps = {
  rows: readonly KimchiPremiumTableRow[];
  isLoading?: boolean;
  onSort?: (isAsc: boolean, sortValue: string) => void;
};

const KimchiPremiumTable = ({ rows, isLoading, onSort }: KimchiPremiumTableProps) => {
  const { isMobile } = useUserAgent();

  const fields = useMemo<readonly TableField<KimchiPremiumTableRow>[]>(() => {
    const symbolLabel: TableField<KimchiPremiumTableRow> = {
      label: '코인',
      value: 'symbolLabel',
      type: 'jsx',
      sortType: 'string',
      sortValue: 'koreanName',
      widthRatio: 20,
    };

    const walletLabel: TableField<KimchiPremiumTableRow> = {
      label: '네트워크 수수료',
      value: 'walletLabel',
      type: 'jsx',
      sortType: 'string',
      sortValue: 'koreanName',
      widthRatio: 24,
      tooltipContent: <NetworkFeeInfoTooltipContent />,
    };

    const priceLabel: TableField<KimchiPremiumTableRow> = {
      label: '가격',
      value: 'priceLabel',
      type: 'jsx',
      sortType: 'number',
      sortValue: 'price',
      align: 'right',
    };

    const premiumLabel: TableField<KimchiPremiumTableRow> = {
      label: '프리미엄',
      value: 'premiumLabel',
      type: 'jsx',
      sortType: 'bignumber',
      sortValue: 'premium',
      align: 'right',
      widthRatio: 14,
    };

    const volumeLabel: TableField<KimchiPremiumTableRow> = {
      label: '24시간 거래량',
      value: 'volumeLabel',
      type: 'jsx',
      sortType: 'number',
      sortValue: 'volume',
      align: 'right',
      widthRatio: 14,
    };

    const updateWatchListButton: TableField<KimchiPremiumTableRow> = {
      label: '',
      value: 'updateWatchListButton',
      type: 'jsx',
      sortDisabled: true,
      align: 'right',
      widthRatio: 6,
    };

    return isMobile
      ? [symbolLabel, walletLabel, premiumLabel, priceLabel, volumeLabel, updateWatchListButton]
      : [symbolLabel, walletLabel, priceLabel, premiumLabel, volumeLabel, updateWatchListButton];
  }, [isMobile]);

  return (
    <Table<KimchiPremiumTableRow>
      tooltipContext="base"
      dSortValue="premium"
      rows={rows}
      isLoading={isLoading}
      fields={fields}
      onSort={onSort}>
      <Table.FieldRow />
    </Table>
  );
};

export default KimchiPremiumTable;
