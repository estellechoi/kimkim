import BigNumber from 'bignumber.js';
import { FORMAT_LOCALE_FALLBACK, MAX_DECIMALS } from '@/constants/app';

/**
 *
 * @description stands for which currency is supported by the app
 */
export type CurrencySymbol = '$' | '₩';

export type FormatAmountOptions = {
  currencySymbol?: CurrencySymbol;
  semiequate?: boolean;
  compact?: boolean;
  fixDp?: boolean;
  roundMode?: BigNumber.RoundingMode;
  locale?: string;
  abs?: boolean;
};

export const formatNumber = (
  targetValue: BigNumber | number | undefined | null,
  decimals?: number,
  options?: FormatAmountOptions,
): string => {
  if (targetValue === undefined || targetValue === null) return '-';

  const value = new BigNumber(targetValue);

  const dp = decimals ?? MAX_DECIMALS;
  const currencySymbol = options?.currencySymbol ? `${options.currencySymbol} ` : '';
  const semiequateSymbol = options?.semiequate ? '≈' : '';
  const abs = options?.abs ?? false;

  const mindp = options?.fixDp ? dp : undefined;

  const formatter = new Intl.NumberFormat(options?.locale ?? FORMAT_LOCALE_FALLBACK, {
    notation: options?.compact ? 'compact' : 'standard',
    maximumFractionDigits: dp,
    minimumFractionDigits: mindp,
    // @ts-ignore
    trailingZeroDisplay: mindp === undefined ? 'stripIfInteger' : 'auto',
  });

  if (value.isZero()) return `${semiequateSymbol}${currencySymbol}${formatter.format(0)}`;

  const directionSymbol = !abs && value.isNegative() ? '-' : '';

  const min = new BigNumber(1).shiftedBy(-dp);
  if (value.abs().lt(min)) return `${semiequateSymbol}${directionSymbol}<${currencySymbol}${formatter.format(min.toNumber())}`;

  const amount = value.dp(dp, options?.roundMode ?? BigNumber.ROUND_DOWN);
  return `${semiequateSymbol}${directionSymbol}${currencySymbol}${formatter.format(amount.abs().toNumber()).toLocaleLowerCase()}`;
};

export type FormatCurrencyFunction = (value: BigNumber | number | undefined | null, options?: FormatAmountOptions) => string;

export const formatUSD: FormatCurrencyFunction = (
  value: BigNumber | number | undefined | null,
  options?: FormatAmountOptions,
): string => {
  return formatNumber(value, 2, { currencySymbol: '$', ...options });
};

export const formatKRW: FormatCurrencyFunction = (
  value: BigNumber | number | undefined | null,
  options?: FormatAmountOptions,
): string => {
  return formatNumber(value, 0, { currencySymbol: '₩', locale: 'ko', ...options });
};

export const getDecimalSeperator = (locale: string): string => {
  return new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.';
};

export const getIntSeperator = (locale: string): string => {
  return new Intl.NumberFormat(locale).formatToParts(10000).find((part) => part.type === 'group')?.value ?? ',';
};

export const getFormattedNumberParts = (formattedNumber: string, locale: string): [string, string | null] => {
  const decimalSeperator = getDecimalSeperator(locale);
  const [integer, fractions] = formattedNumber.split(decimalSeperator);
  return [integer, fractions !== '' ? fractions : null];
};

export const unformatNumber = (formattedValue: string, locale: string): { number: number; decimals: number; prefix?: string } => {
  const [integer, fractions] = getFormattedNumberParts(formattedValue, locale);

  const integerNumberStartIndex = Array.from(integer).findIndex((char) => Number.isSafeInteger(Number(char)));
  const includePrefix = integerNumberStartIndex > -1;
  const prefix = includePrefix ? integer.slice(0, integerNumberStartIndex) : undefined;
  const numberOnlyInteger = includePrefix ? integer.slice(integerNumberStartIndex) : integer;

  const parsedInteger = Number(numberOnlyInteger.replaceAll(getIntSeperator(locale), ''));
  const parsedFractions = fractions ? parseFloat(`0.${fractions}`) : 0;

  const number = Number.isSafeInteger(parsedInteger) ? parsedInteger + parsedFractions : 0;
  const decimals = fractions?.length ?? 0;
  return { number, decimals, prefix };
};
