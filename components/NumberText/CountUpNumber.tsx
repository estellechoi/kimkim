import { FORMAT_LOCALE_FALLBACK } from '@/constants/app';
import { getDecimalSeperator, getIntSeperator, unformatNumber } from '@/utils/number';
import { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';

type CountUpNumberProps = {
  formattedNumber: string;
  locale?: string;
  onEnd?: () => void;
  isStarted?: boolean;
  duration?: number;
};

const CountUpNumber = ({
  isStarted = true,
  formattedNumber,
  locale = FORMAT_LOCALE_FALLBACK,
  onEnd,
  duration = 3,
}: CountUpNumberProps) => {
  const decimalSeperator = useMemo<string>(() => getDecimalSeperator(locale), [locale]);
  const intSeperator = useMemo<string>(() => getIntSeperator(locale), [locale]);

  const { number, decimals, prefix } = useMemo<{ number: number; decimals: number; prefix?: string }>(
    () => unformatNumber(formattedNumber, locale),
    [formattedNumber, locale]
  );

  const [start, setStart] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isStarted) setStart(number);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [isStarted, number, duration]);

  useEffect(() => {
    if (isStarted && number === start) onEnd?.();
  }, [isStarted, number, start, onEnd]);

  return (
    <CountUp
      delay={0}
      duration={duration}
      start={start}
      end={isStarted ? number : 0}
      decimals={decimals}
      prefix={prefix}
      separator={intSeperator}
      decimal={decimalSeperator}
      //   onEnd={onEnd}
    />
  );
};

export default CountUpNumber;
