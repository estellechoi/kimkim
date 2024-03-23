import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { TableField, TableRowData, TableSortType } from '../types';

type HookProps<T> = {
  rows: readonly T[];
  fields: readonly TableField<T>[];
  dSortValue?: string;
  dIsAsc?: boolean;
  onSort?: (isAsc: boolean, sortValue: string) => void;
};

const useSortedRows = <T extends TableRowData>({ rows, fields, dSortValue, dIsAsc, onSort }: HookProps<T>) => {
  /** @desc topFixOrder */
  const topFixRows = useMemo<T[]>(() => {
    return rows.filter((row) => row.topFixOrder !== undefined).sort((a, b) => (a.topFixOrder ?? 0) - (b.topFixOrder ?? 0));
  }, [rows]);

  const normalRows = useMemo<T[]>(() => rows.filter((row) => row.topFixOrder === undefined), [rows]);

  /** @desc sorting conditions */
  const [isAsc, setIsAsc] = useState<boolean>(dIsAsc ?? false);
  const [sortValue, setSortValue] = useState<string>(dSortValue ?? '');

  /** @desc set sorting conditions  */
  useEffect(() => {
    if (dSortValue !== undefined) setSortValue(dSortValue);
    if (dIsAsc !== undefined) setIsAsc(dIsAsc);
  }, [dSortValue, dIsAsc]);

  const sortBy = (field: TableField<T>) => {
    const isSameField = sortValue === (field.sortValue ?? field.value);
    const newIsAsc = isSameField ? !isAsc : false;
    const newSortValue = isSameField ? sortValue : field.sortValue ?? field.value;

    setIsAsc(newIsAsc);
    setSortValue(newSortValue);
    onSort?.(newIsAsc, newSortValue);
  };

  /** @desc sorted rows */
  const sortedNormalRows = useMemo<T[]>(() => {
    const matchedSortField = fields.find((field) => (field.sortValue ?? field.value) === sortValue);
    if (matchedSortField === undefined) return normalRows;

    const SORT_FUNC_DICT: { [key in TableSortType]: (a: T, b: T) => number } = {
      number: (a, b) => {
        if (typeof a[sortValue] === 'number' && typeof b[sortValue] === 'number')
          return isAsc ? a[sortValue] - b[sortValue] : b[sortValue] - a[sortValue];
        return 0;
      },
      string: (a, b) => {
        if (typeof a[sortValue] === 'string' && typeof b[sortValue] === 'string')
          return isAsc
            ? a[sortValue].toUpperCase().localeCompare(b[sortValue].toUpperCase())
            : b[sortValue].toUpperCase().localeCompare(a[sortValue].toUpperCase());
        return 0;
      },
      bignumber: (a, b) => {
        if (BigNumber.isBigNumber(a[sortValue]) && BigNumber.isBigNumber(b[sortValue]))
          return a[sortValue].gt(b[sortValue]) ? (isAsc ? 1 : -1) : isAsc ? -1 : 1;

        return 0;
      },
    };

    return normalRows.sort(SORT_FUNC_DICT[matchedSortField.sortType ?? 'number']);
  }, [normalRows, fields, sortValue, isAsc]);

  /** @desc final sorted rows */
  const sortedRows: T[] = [...topFixRows, ...sortedNormalRows];

  return {
    sortedRows,
    isAsc,
    sortValue,
    sortBy,
  };
};

export default useSortedRows;
