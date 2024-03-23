import { useCallback, useMemo } from 'react';
import isNthChild from './isNthChild';
import { BG_CLASS_DICT, type LoaderStyle, type LoadingRowsColor } from './styles';

type LoadingRowsProps = {
  type?: LoaderStyle;
  rowsCnt?: number;
  color?: LoadingRowsColor;
  fontClassName?: string;
  className?: string;
};

export default function LoadingRows({
  type = 'span',
  rowsCnt = 1,
  color = 'primary',
  fontClassName,
  className = '',
}: LoadingRowsProps) {
  const rows = useMemo<number[]>(() => new Array(rowsCnt).fill(0), [rowsCnt]);

  const bgClassName = useMemo<string>(() => BG_CLASS_DICT[color], [color]);
  const getRowColClassName = useCallback(
    (index: number) => {
      return type === 'span' || type === 'coin_label'
        ? 'col-span-3'
        : isNthChild(index + 1, 4, 1)
        ? 'col-start-1 col-end-3'
        : isNthChild(index + 1, 4, 0)
        ? 'col-start-3 col-end-4'
        : '';
    },
    [type]
  );

  const CoinSkeleton = useMemo(
    () => <span className={`grow-0 shrink-0 w-[1em] h-[1em] rounded-full ${bgClassName} mr-1.5`}></span>,
    [bgClassName]
  );
  const RowSkeleton = useMemo(() => <span className={`grow basis-full rounded-row ${bgClassName}`}></span>, [bgClassName]);

  return (
    <span className={`relative animate-pulse min-w-[50%] grid grid-cols-3 gap-x-[0.5em] gap-y-[0.8em] ${className}`}>
      <span className="sr-only">Loading...</span>

      {rows.map((_, index) => (
        <span key={index} aria-hidden className={`flex w-full h-[1em] ${fontClassName} ${getRowColClassName(index)}`}>
          {type === 'coin_label' ? CoinSkeleton : null}
          {RowSkeleton}
        </span>
      ))}
    </span>
  );
}
