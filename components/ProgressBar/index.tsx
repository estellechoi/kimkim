import {FormatAmountOptions, formatNumber} from '@/utils/number';
import {useMemo} from 'react';

type ProgressBarProps = {
  currentNumber: number;
  targetNumber: number;
  currentNumberCaption?: string;
  decimals?: number;
  formatOptions?: FormatAmountOptions;
  className?: string;
};

const ProgressBar = ({
  currentNumber,
  targetNumber,
  currentNumberCaption,
  decimals,
  formatOptions,
  className = '',
}: ProgressBarProps) => {
  const percentage = useMemo<number>(() => (currentNumber / targetNumber) * 100, [currentNumber, targetNumber]);
  const percentageFormatted = useMemo<string>(() => formatNumber(percentage, 0), [percentage]);
  const currentNumberFormatted = useMemo<string>(
    () => formatNumber(currentNumber, decimals ?? 2, formatOptions),
    [currentNumber, formatOptions]
  );

  return (
    <div className={`${className} w-full flex flex-col items-end gap-y-2`}>
      <div className="w-full flex items-baseline justify-end gap-x-2 text-secondary">
        {/* <CaptionAmount size="sm" formattedAmount={`${percentageFormatted}%`} /> */}

        <div className="flex items-baseline gap-x-1">
          <span className="Font_data_20px_num">{currentNumberFormatted}</span>
          {currentNumberCaption && <span className="Font_caption_xs">{currentNumberCaption}</span>}
        </div>
      </div>

      <div className="w-full h-4 rounded-full overflow-hidden bg-white">
        <div className="h-full rounded-full bg-primary" style={{width: `${percentage}%`}}></div>
        <div className="h-full rounded-full bg-secondary" style={{width: `${percentage}%`}}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
