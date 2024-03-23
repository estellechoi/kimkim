import type { LoaderStyle } from '@/components/LoadingRows/styles';

export type TableStyle = 'primary';
export type TableDataType = 'number' | 'jsx';
export type TableSortType = 'bignumber' | 'number' | 'string';
export type TableCellAlign = 'left' | 'right' | 'center';
export type TableCellLoaderType = LoaderStyle;

/** row */
export type TableRowData = {
  id: string; // unique id for list key which is to prevent re-rendering
  ping?: boolean;
  topFixOrder?: number; // not affected by sorting; fixed on top by order
  subJsx?: JSX.Element;
  isSubJsxOpen?: boolean;
  isFoldableOpen?: boolean;
  rightEnd?: JSX.Element;
  exponent?: number;
  className?: string;
  [key: string]: any; // shoud match field value
};

/** field */
export type TableFieldBase<T> = {
  label: string | JSX.Element;
  value: string;
  type: TableDataType;
  sortValue?: string;
  sortType?: TableSortType;
  sortDisabled?: boolean;
  tooltipContent?: string | JSX.Element;
  tooltipWordBreak?: 'break-all' | 'break-keep';
  align?: TableCellAlign;
  widthPx?: number;
  widthRatio?: number;
  foldableOnMobile?: boolean;
  hide?: boolean;
  generateClassName?: (data: T) => string;
  loaderType?: TableCellLoaderType;
};

export interface TableFieldNumber<T> extends TableFieldBase<T> {
  type: 'number';
}

export interface TableFieldJsx<T> extends TableFieldBase<T> {
  type: 'jsx';
}

export type TableField<T> = TableFieldNumber<T> | TableFieldJsx<T>;
