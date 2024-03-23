import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { formatNumber } from '@/utils/number';
import Icon, { IconType } from '@/components/Icon';
import { TEXT_COLOR_CLASS_DICT, type TextColor } from '@/components/styles';

type UpDownNumberTextColor = TextColor;

const COLOR_CLASS_DICT = TEXT_COLOR_CLASS_DICT;

type UpDownNumberTextProps = {
  number: number | BigNumber | undefined | null;
  unit?: string;
  color?: UpDownNumberTextColor;
  className?: string;
};

const UpDownNumberText = ({ number, unit, color = 'primary', className = '' }: UpDownNumberTextProps) => {
  const fallbackedNumber = useMemo<BigNumber>(() => new BigNumber(number ?? 0), [number]);

  const colorClassName = useMemo<string>(
    () =>
      fallbackedNumber.gt(0) ? 'text-semantic_bull' : fallbackedNumber.lt(0) ? 'text-semantic_bear' : COLOR_CLASS_DICT[color],
    [fallbackedNumber, color]
  );
  const iconType = useMemo<IconType | undefined>(
    () => (fallbackedNumber.gt(0) ? 'increase' : fallbackedNumber.lt(0) ? 'decrease' : undefined),
    [fallbackedNumber]
  );

  return (
    <span className={`inline-flex items-center Font_data_16px_num ${colorClassName} ${className}`}>
      {iconType && <Icon type={iconType} size="lg" />}
      {formatNumber(number, 1, { fixDp: true, abs: true })}
      {!!number ? unit : ''}
    </span>
  );
};

export default UpDownNumberText;
