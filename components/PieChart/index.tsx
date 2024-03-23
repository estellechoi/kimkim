import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { Cell, Pie, PieChart as Chart } from 'recharts';
import type { PieChartEntry, PieChartKey } from './types';

const DEFAULT_PX_SIZE = 150;

const EMPTY_DATA: PieChartEntry<string>[] = [{ type: '', label: '', value: 100 }];
const EMPTY_COLOR = '#e1e1e1';

export type PieChartProps<T extends PieChartKey> = {
  data: PieChartEntry<T>[];
  colorMap: { [key in T]: string };
  size?: number;
  value?: number;
  setValue?: (value: number | undefined) => void;
  type?: string;
  setType?: (value: T | undefined) => void;
  className?: string;
};

export default function PieChart<T extends PieChartKey>({
  data,
  colorMap,
  size = DEFAULT_PX_SIZE,
  value,
  setValue,
  type,
  setType,
  className = '',
}: PieChartProps<T>) {
  const isZero = useMemo<boolean>(
    () => data.reduce((accm, item) => accm.plus(new BigNumber(item.value)), new BigNumber(0)).isZero(),
    [data]
  );

  const validSize = useMemo<number>(() => (size <= 0 ? DEFAULT_PX_SIZE : size), [size]);

  const handleMouseOn = useCallback(
    (props: { value: any; type: any }) => {
      if (props) {
        const newValue = props.value;
        if (setValue && value !== newValue) {
          setValue(newValue);
        }

        const newLabel = props.type;
        if (setType && type !== newLabel) {
          setType(newLabel);
        }
      }
    },
    [setValue, value, setType, type]
  );

  const handleMouseLeave = useCallback(() => {
    setType && setType(undefined);
    setValue && setValue(undefined);
  }, [setType, setValue]);

  /** @caution outerRadius comes from recharts Pie's fixed min size; 200px. */
  return (
    <div
      className={className}
      style={{
        width: `${validSize}px`,
        height: `${validSize}px`,
        minWidth: `${validSize}px`,
        minHeight: `${validSize}px`,
      }}
    >
      <Chart width={validSize} height={validSize}>
        <Pie
          data={isZero ? EMPTY_DATA : data}
          dataKey="value"
          nameKey="type"
          cx="50%"
          cy="50%"
          innerRadius={((validSize / 2) * 3) / 5}
          outerRadius={validSize / 2}
          startAngle={90}
          endAngle={450}
          fill={EMPTY_COLOR}
          stroke="transparent"
          paddingAngle={0}
          onMouseEnter={handleMouseOn}
          onMouseMove={handleMouseOn}
          onMouseLeave={handleMouseLeave}
        >
          {data.map((item) => (
            <Cell key={item.type} fill={isZero ? EMPTY_COLOR : colorMap?.[item.type] ?? EMPTY_COLOR} />
          ))}
        </Pie>
      </Chart>
    </div>
  );
}
