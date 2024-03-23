import { WaitingSymbolColor } from '../WaitingSymbol/types';
import type { ButtonColor, ButtonSize, ButtonStatus, ButtonType } from './types';

export const BUTTON_COLOR_CLASS_DICT: Record<ButtonType, Record<ButtonColor | 'disabled', string>> = {
  fill: {
    primary: 'bg-primary text-white border border-solid border-primary',
    on_primary: 'bg-white text-primary border border-solid border-white',
    secondary: 'bg-secondary text-white',
    on_secondary: 'bg-white text-secondary',
    disabled: 'bg-disabled text-white',
  },
  outline: {
    primary: 'bg-transparent text-primary border border-solid border-primary',
    on_primary: 'bg-transparent text-white border border-solid border-white',
    secondary: 'bg-transparent text-secondary border border-solid border-secondary',
    on_secondary: 'bg-transparent text-white border border-solid border-white',
    disabled: 'bg-transparent text-disabled border border-solid border-disabled',
  },
  text: {
    primary: 'bg-transparent text-primary',
    on_primary: 'bg-transparent text-white',
    secondary: 'bg-transparent text-secondary',
    on_secondary: 'bg-transparent text-white',
    disabled: 'bg-transparent text-disabled',
  },
};

export const BUTTON_WAITING_SYMBOL_COLOR_DICT: Record<ButtonType, Record<ButtonColor, WaitingSymbolColor>> = {
  fill: {
    primary: 'white',
    on_primary: 'primary',
    secondary: 'white',
    on_secondary: 'secondary',
  },
  outline: {
    primary: 'primary',
    on_primary: 'white',
    secondary: 'secondary',
    on_secondary: 'white',
  },
  text: {
    primary: 'primary',
    on_primary: 'white',
    secondary: 'secondary',
    on_secondary: 'white',
  },
};

export const TEXT_SIZE_CLASS_DICT: Record<ButtonSize, string> = {
  xs: 'Font_button_xs',
  sm: 'Font_button_sm',
  md: 'Font_button_md',
  lg: 'Font_button_lg',
  xl: 'Font_button_xl',
};

export const BUTTON_LABEL_PADDING_CLASS_DICT: Record<ButtonSize, string> = {
  xs: 'px-3 py-0.5',
  sm: 'px-4 py-1',
  md: 'px-6 py-3',
  lg: 'px-7 py-4',
  xl: 'px-8 py-5',
};

export const BUTTON_HEIGHT_CLASS_DICT: Record<ButtonSize, string> = {
  xs: 'h-[1.875rem]',
  sm: 'h-[2.375rem]',
  md: 'h-[3.125rem]',
  lg: 'h-[4.375rem]',
  xl: 'h-[5.625rem]',
};

export const BUTTON_PADDING_CLASS_DICT: Record<ButtonType, Record<ButtonSize, string>> = {
  fill: {
    xs: 'p-1',
    sm: 'p-1',
    md: 'p-1',
    lg: 'p-1.5',
    xl: 'p-1.5',
  },
  outline: {
    xs: 'p-1',
    sm: 'p-1',
    md: 'p-1',
    lg: 'p-1.5',
    xl: 'p-1.5',
  },
  text: {
    xs: 'p-0',
    sm: 'p-0',
    md: 'p-0',
    lg: 'p-0',
    xl: 'p-0',
  },
};

export const BUTTON_CURSOR_CLASS_DICT: Record<ButtonStatus, string> = {
  enabled: 'cursor-pointer',
  disabled: 'cursor-not-allowed',
  processing: 'cursor-wait',
};
