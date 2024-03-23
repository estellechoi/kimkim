import { ReactNode, useMemo } from 'react';
import getReactElements from '../utils/getReactElements';
import { TEXTS } from '@/constants/app';
import { TABLE_SPACE_Y_DICT, TABLE_ROW_BG_DICT, TABLE_BG_COLOR_DICT } from './styles';
import Row from './Row';
import type { TableStyle, TableField, TableRowData } from './types';
import FieldRowPseudo from './FieldRow/Pseudo';
import TableFieldRow from './FieldRow/FieldRow';
import useSortedRows from './hooks/useSortedRows';
import type { TooltipLayer } from '@/components/Tooltip/styles';

const getFieldRows = (children: ReactNode) => getReactElements(children, FieldRowPseudo);

type TableProps<T extends TableRowData> = {
  children?: ReactNode;
  type?: TableStyle;
  hasMouseEffect?: boolean;
  fields: readonly TableField<T>[];
  rows: readonly T[];
  dSortValue?: string;
  dIsAsc?: boolean;
  onRowClick?: (row: T) => void;
  onToggleRowSubJsx?: (data: T, isOpen: boolean) => void;
  onToggleAllSubJsx?: (isOpen: boolean) => void;
  onToggleFoldableOnMobile?: (data: T, isOpen: boolean) => void;
  onSort?: (isAsc: boolean, sortValue: string) => void;
  showRowClickIcon?: boolean;
  noDataLabel?: string;
  rowsScrollHeight?: string;
  tooltipContext: TooltipLayer;
  isLoading?: boolean;
};

/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/treegrid_role for accessibility guideline
 */
const TableContainer = <T extends TableRowData>({
  children,
  type = 'primary',
  hasMouseEffect,
  fields,
  rows,
  dSortValue,
  dIsAsc,
  onRowClick,
  onToggleRowSubJsx,
  onToggleAllSubJsx,
  onToggleFoldableOnMobile,
  onSort,
  showRowClickIcon = false,
  noDataLabel = TEXTS.NO_DATA,
  rowsScrollHeight,
  isLoading = false,
  tooltipContext,
}: TableProps<T>) => {
  /** @summary sorting & filtering */
  const { sortedRows, isAsc, sortValue, sortBy } = useSortedRows({
    rows,
    fields,
    dSortValue,
    dIsAsc,
    onSort,
  });

  const hasAnySubJsx = useMemo<boolean>(() => rows.some((row) => row.subJsx !== undefined), [rows]);
  const hasAnySubJsxOpen = useMemo<boolean>(() => rows.some((row) => row.isSubJsxOpen), [rows]);
  const needRightSpace = useMemo<boolean>(
    () => (showRowClickIcon && onRowClick !== undefined) || hasAnySubJsx || rows.some((row) => row.rightEnd !== undefined),
    [hasAnySubJsx, showRowClickIcon, onRowClick, rows]
  );

  const hasField = useMemo<boolean>(() => getFieldRows(children).length > 0, [children]);

  // class names
  const { bgClassName, gapYClassName } = useMemo(
    () => ({
      bgClassName: TABLE_BG_COLOR_DICT[type],
      gapYClassName: `${TABLE_SPACE_Y_DICT[type]}`,
    }),
    [type]
  );
  const { heightClassName, overFlowClassName } = useMemo(
    () => ({
      heightClassName: rowsScrollHeight ? 'h-full' : '',
      overFlowClassName: rowsScrollHeight ? 'overflow-y-auto' : '',
    }),
    [rowsScrollHeight]
  );

  return (
    <div role="treegrid" className={`relative w-full ${heightClassName} overflow-hidden ${gapYClassName} ${bgClassName}`}>
      {hasField && (
        <TableFieldRow
          type={type}
          fields={fields}
          rowsScrollHeight={rowsScrollHeight}
          onToggleAllSubJsx={onToggleAllSubJsx}
          sortBy={sortBy}
          sortValue={sortValue}
          isAsc={isAsc}
          needRightSpace={needRightSpace}
          hasAnySubJsx={hasAnySubJsx}
          hasAnySubJsxOpen={hasAnySubJsxOpen}
          tooltipContext={tooltipContext}
        />
      )}

      {/* rows */}
      <div
        role="rowgroup"
        className={`relative w-full ${gapYClassName} ${overFlowClassName}`}
        style={{ height: rowsScrollHeight, scrollbarGutter: 'stable' }}
      >
        {sortedRows.map((row) => (
          <Row
            key={row.id}
            type={type}
            hasMouseEffect={hasMouseEffect}
            showRowClickIcon={showRowClickIcon}
            data={row}
            fields={fields}
            onClick={onRowClick}
            onToggleSubJsx={onToggleRowSubJsx}
            onToggleFoldableOnMobile={onToggleFoldableOnMobile}
            needRightSpace={needRightSpace}
            isLoading={isLoading}
          />
        ))}

        {/* no data */}
        {sortedRows.length === 0 && (
          <div
            role="row"
            className={`relative w-full h-[240px] flex items-center justify-center text-center px-3 py-5 md:px-4 hover:!bg-none font_body_m text-body ${TABLE_ROW_BG_DICT[type]}`}
          >
            <span className="opacity-70">{noDataLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableContainer;
