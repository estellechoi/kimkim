import { useCallback, useMemo } from 'react';
import {
  TABLE_ROW_BG_DICT,
  TABLE_ROW_GRID_X_DICT,
  TABLE_ROW_GRID_Y_DICT,
  getHidableAreaClassName,
  TABLE_ROW_HOVER_LAYER_BG_DICT,
  TABLE_ROW_BORDER_DICT,
  TABLE_ROW_RIGHT_PADDING,
} from './styles';
import type { TableField, TableRowData, TableStyle } from './types';
import RowCell from './RowCell';
import useMouseEffect from './hooks/useMouseEffect';

type RowProps<T extends TableRowData> = {
  data: T;
  fields: readonly TableField<T>[];
  onClick?: (data: T) => void;
  onToggleSubJsx?: (data: T, isOpen: boolean) => void;
  onToggleFoldableOnMobile?: (data: T, isOpen: boolean) => void;
  type: TableStyle;
  hasMouseEffect?: boolean;
  showRowClickIcon?: boolean;
  needRightSpace: boolean;
  isLoading: boolean;
};

const Row = <T extends TableRowData>({
  data,
  fields,
  onClick,
  onToggleSubJsx,
  onToggleFoldableOnMobile,
  type,
  hasMouseEffect,
  showRowClickIcon = false,
  needRightSpace,
  isLoading,
}: RowProps<T>) => {
  /** subjsx */
  const isSubJsxOpen = useMemo<boolean>(() => data.isSubJsxOpen ?? true, [data.isSubJsxOpen]);

  const tailwindGroupName = useMemo<string>(() => (data.subJsx === undefined ? `group` : 'group/hassub'), [data.subJsx]);

  const onRowClick = useCallback(() => {
    onClick?.(data);

    if (data.subJsx !== undefined) {
      onToggleSubJsx?.(data, !isSubJsxOpen);
    }
  }, [data, onClick, onToggleSubJsx, isSubJsxOpen]);

  /** click area */
  const isWholeRowClickable = useMemo<boolean>(() => {
    return !showRowClickIcon;
  }, [showRowClickIcon]);

  // mouse-interactive effect
  const { style: mouseEffectStyle, onMouseMove, onMouseLeave } = useMouseEffect(hasMouseEffect);

  const ariaExpanded = !!data.subJsx ? isSubJsxOpen : undefined;

  // class names
  const overlayClassName = useMemo<string>(
    () => (onClick || (data.subJsx && onToggleSubJsx) ? `cursor-pointer ${TABLE_ROW_HOVER_LAYER_BG_DICT[type]}` : ''),
    [onClick, data.subJsx, onToggleSubJsx, type]
  );

  const colorClassName = useMemo<string>(
    () => `${TABLE_ROW_BG_DICT[type]} ${TABLE_ROW_BORDER_DICT[type]} ${tailwindGroupName} ${data.className ?? ''}`,
    [type, tailwindGroupName, data.className]
  );

  const gridClassName = useMemo<string>(
    () => `w-full ${TABLE_ROW_GRID_X_DICT[type]} ${needRightSpace ? TABLE_ROW_RIGHT_PADDING : ''} ${TABLE_ROW_GRID_Y_DICT[type]}`,
    [type, needRightSpace]
  );

  return (
    <div role="row" aria-expanded={ariaExpanded} className={`relative ${colorClassName} ${overlayClassName}`}>
      <div
        className={`relative ${gridClassName}`}
        onClick={isWholeRowClickable ? onRowClick : undefined}
        style={mouseEffectStyle}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {fields.map((field, index) => (
          <RowCell key={field.value} colIndex={index} data={data} field={field} type={type} isLoading={isLoading} />
        ))}
      </div>

      {data.subJsx && <div className={`relative box-content ${getHidableAreaClassName(isSubJsxOpen)}`}>{data.subJsx}</div>}
    </div>
  );
};

export default Row;
