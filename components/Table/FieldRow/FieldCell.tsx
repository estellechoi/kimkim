import { useMemo } from 'react';
import Icon from '@/components/Icon';
import { TABLE_CELL_TEXT_COLOR_DICT, TABLE_FIELD_TYPO_DICT, getTableCellAlignClassName, getTableCellWidthStyle } from '../styles';
import type { TableField, TableRowData, TableStyle } from '../types';
import Tooltip from '@/components/Tooltip';
import type { TooltipLayer } from '@/components/Tooltip/styles';

type FieldCellProps<T> = {
  type: TableStyle;
  field: TableField<T>;
  fieldIndex: number;
  className?: string;
  isAsc?: boolean;
  sortValue?: string;
  sortBy: (field: TableField<T>) => void;
  tooltipContext: TooltipLayer;
};

const FieldCell = <T extends TableRowData>({
  type,
  field,
  fieldIndex,
  isAsc,
  sortValue,
  sortBy,
  className = '',
  tooltipContext,
}: FieldCellProps<T>) => {
  const isSortingField = useMemo<boolean>(
    () => sortValue === (field.sortValue ?? field.value),
    [sortValue, field.sortValue, field.value]
  );

  const ariaSort = useMemo(() => {
    return isSortingField ? (isAsc ? 'ascending' : 'descending') : 'none';
  }, [isSortingField, isAsc]);

  const colorClassName = TABLE_CELL_TEXT_COLOR_DICT[type];

  return (
    <div
      role="columnheader"
      aria-colindex={fieldIndex}
      aria-sort={ariaSort}
      className={`flex items-center gap-x-1 ${colorClassName} ${
        field.sortDisabled ? '' : 'cursor-pointer'
      } ${getTableCellAlignClassName(field, type)}`}
      style={getTableCellWidthStyle(field)}
      onClick={() => {
        if (!field.sortDisabled) sortBy(field);
      }}
    >
      <div className={`${className} flex items-center gap-x-1 ${TABLE_FIELD_TYPO_DICT[type]}`}>
        <Tooltip content={field.tooltipContent} layer={tooltipContext}>
          {field.label}
        </Tooltip>
      </div>

      {isSortingField && <Icon type={isAsc ? 'arrow_up' : 'arrow_down'} size="md" className="text-body" />}
    </div>
  );
};

export default FieldCell;
