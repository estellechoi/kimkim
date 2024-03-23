import { type ComponentPropsWithoutRef, useMemo } from 'react';
import ButtonLeadingIcon from './ButtonLeadingIcon';
import {
  BUTTON_COLOR_CLASS_DICT,
  BUTTON_CURSOR_CLASS_DICT,
  BUTTON_HEIGHT_CLASS_DICT,
  BUTTON_LABEL_PADDING_CLASS_DICT,
  BUTTON_PADDING_CLASS_DICT,
  BUTTON_WAITING_SYMBOL_COLOR_DICT,
  TEXT_SIZE_CLASS_DICT,
} from './constants';
import type { ButtonColor, ButtonSize, ButtonStatus, ButtonType } from './types';
import type { IconType } from '@/components/Icon';
import WaitingSymbol from '../WaitingSymbol';

export type ButtonProps = Readonly<
  {
    type?: ButtonType;
    iconType?: IconType;
    label: string;
    onClick?: () => void;
    labelHidden?: boolean;
    color?: ButtonColor;
    size?: ButtonSize;
    status?: ButtonStatus;
    className?: string;
  } & Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'disabled' | 'onClick' | 'className'>
>;

const Button = ({
  type = 'fill',
  iconType,
  label,
  onClick,
  labelHidden = false,
  color = 'primary',
  size = 'md',
  status = 'enabled',
  className = '',
  ...intrinsicProps
}: ButtonProps) => {
  const disabled = useMemo<boolean>(() => status === 'disabled' || status === 'processing', [status]);
  const processing = useMemo<boolean>(() => status === 'processing', [status]);

  // class names
  const cursorClassName = useMemo(() => BUTTON_CURSOR_CLASS_DICT[status], [status]);
  const colorClassName = useMemo(
    () => (labelHidden ? '' : BUTTON_COLOR_CLASS_DICT[type][status === 'disabled' ? 'disabled' : color]),
    [labelHidden, type, color, status]
  );
  const { fontClassName, heightClassName, labelPaddingClassName, paddingClassName } = useMemo(
    () => ({
      fontClassName: TEXT_SIZE_CLASS_DICT[size],
      heightClassName: BUTTON_HEIGHT_CLASS_DICT[size],
      paddingClassName: BUTTON_PADDING_CLASS_DICT[type][size],
      labelPaddingClassName: BUTTON_LABEL_PADDING_CLASS_DICT[size],
    }),
    [type, size]
  );
  const textVisibilityClassName = useMemo(() => (labelHidden ? 'sr-only' : ''), [labelHidden]);
  const hoverAnimationClassName = disabled
    ? ''
    : 'transition-transform Transition_500 group-enabled/button:group-hover/button:translate-x-0.5';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`Component group/button relative w-fit inline-flex justify-between items-center rounded-button ${heightClassName} ${paddingClassName} ${cursorClassName} ${colorClassName} ${className}`}
      {...intrinsicProps}
    >
      {iconType && <ButtonLeadingIcon type={type} color={color} size={size} iconType={iconType} disabled={disabled} />}

      <span
        className={`grow truncate ${fontClassName} ${labelPaddingClassName} ${textVisibilityClassName} ${hoverAnimationClassName}`}
      >
        {processing ? <WaitingSymbol color={BUTTON_WAITING_SYMBOL_COLOR_DICT[type][color]} /> : label}
      </span>
    </button>
  );
};

export default Button;
