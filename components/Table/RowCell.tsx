import {
  CELL_FONT_CLASS_GETTER,
  TABLE_CELL_BORDER_DICT,
  TABLE_CELL_GRID_X_DICT,
  TABLE_CELL_GRID_Y_DICT,
  TABLE_CELL_LOADER_DICT,
  TABLE_CELL_TEXT_COLOR_DICT,
  getTableCellAlignClassName,
  getTableCellWidthStyle,
} from './styles';
import type { TableField, TableRowData, TableStyle } from './types';

type RowCellProps<T> = {
  type: TableStyle;
  data: T;
  field: TableField<T>;
  colIndex: number;
  isLoading: boolean;
};

const RowCell = <T extends TableRowData>({ data, field, type, colIndex, isLoading }: RowCellProps<T>) => {
  if (data[field.value] === undefined || data[field.value] === null) return <></>;

  const colorClassName = TABLE_CELL_TEXT_COLOR_DICT[type];
  const getCellFontClassName = CELL_FONT_CLASS_GETTER[type];

  const Loader = TABLE_CELL_LOADER_DICT[field.loaderType ?? 'span'];

  return (
    <div
      key={field.value}
      role="cell"
      aria-colindex={colIndex}
      className={`Component ${field.generateClassName?.(data) ?? ''} ${TABLE_CELL_GRID_X_DICT[type]} ${
        TABLE_CELL_GRID_Y_DICT[type]
      } ${TABLE_CELL_BORDER_DICT[type]} ${getTableCellAlignClassName(field, type)}`}
      style={getTableCellWidthStyle(field)}
    >
      {isLoading ? (
        <Loader fontClassName={getCellFontClassName(field.type)} className="w-1/2" type={field.loaderType} />
      ) : (
        <div className={`flex flex-col justify-center ${colorClassName} ${getCellFontClassName(field.type)}`}>
          {data[field.value]}
        </div>
      )}
    </div>
  );
};

export default RowCell;
