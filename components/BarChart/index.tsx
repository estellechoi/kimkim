import { TimeTick, formatDate } from '@/utils/date'
import LoadingRows from 'components/LoadingRows'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { HTMLAttributes, ReactNode, useCallback, useMemo } from 'react'
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { BarProps } from 'recharts/types/cartesian/Bar'
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart'
import { ActiveShape } from 'recharts/types/util/types'

dayjs.extend(utc)
dayjs.extend(weekOfYear)

export type TimeChartEntry = {
  time: number
  value: number
}

const DEFAULT_HEIGHT = 300

export type LineChartProps = {
  isLoading?: boolean
  data: TimeChartEntry[]
  highlightTime?: TimeChartEntry['time']
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: (value: number | undefined) => void
  setLabel?: (value: string | undefined) => void
  value?: number
  label?: string
  chartTimeTick?: TimeTick
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
  onClick?: (time: number | undefined) => void
} & Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>

export default function BarChart({
  isLoading = false,
  data,
  highlightTime,
  color = '#000',
  setValue,
  setLabel,
  value,
  label,
  chartTimeTick,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  className = '',
  onClick,
  ...rest
}: LineChartProps) {
  // const parsedValue = value

  const timeTickedChartData = useCallback((chartData: TimeChartEntry[], type: TimeTick) => {
    if (!chartData) return []

    const data: Record<string, TimeChartEntry> = {}

    chartData.forEach(({ time, value }: TimeChartEntry) => {
      const tickType = unixToType(time, type)
      if (data[tickType]) {
        data[tickType].value += value
      } else {
        data[tickType] = {
          time,
          value,
        }
      }
    })

    return Object.values(data)
  }, [])

  const chartData: TimeChartEntry[] = useMemo(
    () => timeTickedChartData(data, chartTimeTick ?? TimeTick.DAILY),
    [data, timeTickedChartData, chartTimeTick]
  )

  const handleMouseOn: CategoricalChartFunc = useCallback(
    (props) => {
      // value
      if (setValue && props.activePayload && value !== props.activePayload[0]?.payload?.value) {
        setValue(props.activePayload[0]?.payload?.value)
      }

      // label

      if (setLabel && props.isTooltipActive && label !== props.activeLabel) {
        setLabel(formatDate(props.activeLabel, chartTimeTick));
      }
    },
    [setValue, value, setLabel, label, chartTimeTick]
  )

  const handleMouseLeave = useCallback(() => {
    setLabel && setLabel(undefined)
    setValue && setValue(undefined)
  }, [setLabel, setValue])

  const handleClick: CategoricalChartFunc = useCallback(
    (props) => {
      if (onClick) onClick(props.activeLabel as number | undefined)
    },
    [onClick]
  )

  //@ts-ignore
  const getBarShape: ActiveShape<BarProps, SVGPathElement> = useCallback((props) => (
    <CustomBar
      height={props.height}
      width={props.width}
      x={props.x}
      y={props.y}
      fill={props.time === highlightTime ? '#CFFF04' : color}
      cursor={onClick ? 'pointer' : 'default'}
    />
  ), []);

  return (
    <div
      className={`${className} w-full`}
      style={{
        minWidth: '0',
        height: `${minHeight}px`,
        minHeight: `${minHeight}px`,
      }}
      {...rest}
    >
      {isLoading ? (
        <LoadingRows rowsCnt={12} />
      ) : (
        <>
          <div className="shrink-0 grow-0 flex justify-between">
            {topLeft ?? null}
            {topRight ?? null}
          </div>

          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <Chart
                width={400}
                height={220}
                data={chartTimeTick !== undefined ? chartData : data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                onMouseEnter={handleMouseOn}
                onMouseMove={handleMouseOn}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              >
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(time) =>
                    chartTimeTick !== undefined
                      ? dayjs(time).format(chartTimeTick === TimeTick.MONTHLY ? 'MMM' : 'DD')
                      : ''
                  }
                  minTickGap={10}
                />
                <Tooltip cursor={{ fill: '#CFFF04' }} contentStyle={{ display: 'none' }} />
                <Bar
                  dataKey="value"
                  fill={color}
                  shape={getBarShape}
                />
              </Chart>
            </ResponsiveContainer>
          </div>

          <div className="shrink-0 grow-0 flex justify-between">
            {bottomLeft ?? null}
            {bottomRight ?? null}
          </div>
        </>
      )}
    </div>
  )
}

function CustomBar({
  x,
  y,
  width,
  height,
  fill,
  cursor,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
  cursor?: string
}) {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" cursor={cursor} />
    </g>
  )
}

function unixToType(time: number, type: TimeTick) {
  const day = dayjs(time)

  switch (type) {
    case TimeTick.MONTHLY:
      return day.format('YYYY-MM')
    case TimeTick.WEEKLY:
      let week = String(day.week())
      if (week.length === 1) {
        week = `0${week}`
      }
      return `${day.year()}-${week}`
    default:
      return day.format('YYYY-MM-DD')
  }
}
