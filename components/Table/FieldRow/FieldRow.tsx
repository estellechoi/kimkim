import Button from '@/components/Button';
import FieldCell from './FieldCell';
import {
  TABLE_EXPAND_ICON_GRID_X,
  TABLE_FIELD_BG_DICT,
  TABLE_FIELD_BORDER_DICT,
  TABLE_FIELD_GRID_X_DICT,
  TABLE_FIELD_GRID_Y_DICT,
  TABLE_FIELD_RIGHT_PADDING,
} from '../styles';
import { TableField, TableRowData, TableStyle } from '../types';
import type { TooltipLayer } from '@/components/Tooltip/styles';

type TableFieldRowProps<T> = {
  type: TableStyle;
  fields: readonly TableField<T>[];
  rowsScrollHeight?: string;
  onToggleAllSubJsx?: (isOpen: boolean) => void;
  sortBy: (field: TableField<T>) => void;
  sortValue?: string;
  isAsc?: boolean;
  needRightSpace: boolean;
  hasAnySubJsx: boolean;
  hasAnySubJsxOpen: boolean;
  tooltipContext: TooltipLayer;
};

const TableFieldRow = <T extends TableRowData>({
  type,
  fields,
  rowsScrollHeight,
  onToggleAllSubJsx,
  sortBy,
  sortValue,
  isAsc,
  needRightSpace,
  hasAnySubJsx,
  hasAnySubJsxOpen,
  tooltipContext,
}: TableFieldRowProps<T>) => {
  return (
    <div
      role="row"
      className={`relative w-full ${TABLE_FIELD_BORDER_DICT[type]} ${TABLE_FIELD_GRID_X_DICT[type]} ${
        needRightSpace ? TABLE_FIELD_RIGHT_PADDING : ''
      } ${TABLE_FIELD_GRID_Y_DICT[type]} ${TABLE_FIELD_BG_DICT[type]} ${rowsScrollHeight ? 'overflow-y-auto' : ''}`}
      style={{ scrollbarGutter: 'stable' }}
    >
      {fields
        .filter((field) => !field.hide)
        .map((field, index) => (
          <FieldCell
            key={field.value}
            type={type}
            field={field}
            fieldIndex={index}
            isAsc={isAsc}
            sortBy={sortBy}
            sortValue={sortValue}
            tooltipContext={tooltipContext}
          />
        ))}

      {hasAnySubJsx && onToggleAllSubJsx && (
        <div
          role="columnheader"
          aria-sort="none"
          className={`flex items-center justify-center absolute right-2 inset-y-0 ${TABLE_EXPAND_ICON_GRID_X[type]}`}
        >
          <Button
            iconType={hasAnySubJsxOpen ? 'expand_less' : 'expand_more'}
            size="sm"
            label="All"
            labelHidden
            onClick={() => onToggleAllSubJsx?.(!hasAnySubJsxOpen)}
          />
        </div>
      )}
    </div>
  );
};

export default TableFieldRow;
