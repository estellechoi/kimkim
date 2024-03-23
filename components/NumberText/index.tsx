import { FORMAT_LOCALE_FALLBACK } from '@/constants/app';
import { getFormattedNumberParts } from '@/utils/number';
import CountUpNumber from './CountUpNumber';
import { useCallback, useMemo, useState } from 'react';
import { TEXT_COLOR_CLASS_DICT, TextColor } from '@/components/styles';

export type NumberTextColor = TextColor;
export type NumberTextType = 'normal' | 'small_fractions';
export type NumberTextSize = 'sm' | 'md' | 'lg' | 'xl';

const COLOR_CLASS_DICT = TEXT_COLOR_CLASS_DICT;
const SIZE_CLASS_DICT: Record<NumberTextSize, { integer: string; fractions: string; unit: string }> = {
  sm: { integer: 'Font_data_12px_num', fractions: 'Font_data_12px_num', unit: 'Font_data_12px_unit' },
  md: { integer: 'Font_data_16px_num', fractions: 'Font_data_12px_num', unit: 'Font_data_12px_unit' },
  lg: { integer: 'Font_data_20px_num', fractions: 'Font_data_14px_num', unit: 'Font_data_14px_unit' },
  xl: { integer: 'Font_data_32px_num', fractions: 'Font_data_20px_num', unit: 'Font_data_20px_unit' },
};

type NumberTextProps = {
  color?: NumberTextColor;
  type?: NumberTextType;
  formattedNumber?: string;
  unit?: string;
  size?: NumberTextSize;
  locale?: string;
  animate?: boolean;
};

const NumberText = ({
  color = 'primary',
  type = 'normal',
  formattedNumber,
  unit,
  size = 'md',
  locale = FORMAT_LOCALE_FALLBACK,
  animate = false,
}: NumberTextProps) => {
  // styles
  const colorClassName = COLOR_CLASS_DICT[color];
  const sizeClassNames = SIZE_CLASS_DICT[size];
  const fractionsSizeClassName = useMemo(
    () => (type === 'small_fractions' ? sizeClassNames.fractions : sizeClassNames.integer),
    [type, sizeClassNames]
  );

  // number parts
  const [integer, fractions] = formattedNumber ? getFormattedNumberParts(formattedNumber, locale) : [null, null];

  // animation effect
  const [isFractionsAnimated, setIsFractionsAnimated] = useState<boolean>(false);
  const onFractionsAnimationEnd = useCallback(() => setIsFractionsAnimated(true), []);

  return (
    <span className={`flex items-baseline gap-x-1 ${colorClassName}`}>
      {integer !== null ? (
        <>
          <span className="flex items-baseline">
            <span className={sizeClassNames.integer}>
              {animate ? <CountUpNumber formattedNumber={integer} locale={locale} isStarted={!fractions || isFractionsAnimated} /> : integer}
            </span>

            {fractions && (
              <span className={fractionsSizeClassName}>
                .
                {animate ? (
                  <CountUpNumber formattedNumber={fractions} locale={locale} duration={0.4} onEnd={onFractionsAnimationEnd} />
                ) : (
                  fractions
                )}
              </span>
            )}
          </span>
          {unit && <span className={sizeClassNames.unit}>{unit}</span>}
        </>
      ) : (
        '-'
      )}
    </span>
  );
};

export default NumberText;
