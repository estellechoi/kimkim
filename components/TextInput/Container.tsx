import { type HTMLProps, type ReactNode, useEffect, useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import getReactElements from '@/components/utils/getReactElements';
import Icon from '@/components/Icon';
import { TextInputType } from './types';
import { PATTERN_DICT } from './constants';

const getIcon = (children: ReactNode | undefined) => getReactElements(children, Icon)[0];

export type TextInputProps = Omit<
  HTMLProps<HTMLInputElement>,
  'type' | 'pattern' | 'value' | 'autocapitalize' | 'form' | 'className' | 'onChange' | 'onInput' | 'label'
> & {
  children?: ReactNode;
  form: HTMLFormElement | null;
  type: TextInputType;
  label: string;
  getErrorMsg?: (value: string) => string | null;
  value?: string;
  className?: string;
  onChange?: (value: string, isValid: boolean) => void;
  onInput?: (value: string) => void;
  debounce?: boolean;
};

const Container = ({
  children,
  form,
  type,
  value: injectedValue,
  className = '',
  onChange,
  onInput,
  debounce = false,
  label,
  getErrorMsg,
  ...args
}: TextInputProps) => {
  const { required } = args;

  const [value, setValue] = useState<string>(injectedValue ?? '');

  useEffect(() => {
    if (!!injectedValue) setValue(injectedValue);
  }, [injectedValue]);

  const debouncedValue = useDebounce(value, 500);
  const finalValue = useMemo(() => (debounce ? debouncedValue : value), [debouncedValue, value, debounce]);

  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (!required && finalValue === '') {
      setIsValid(true);
      return;
    }

    const errorMsg = getErrorMsg?.(finalValue);
    if (errorMsg === null) {
      setIsValid(true);
      return;
    }

    if (errorMsg === undefined && form?.checkValidity() !== false) {
      setIsValid(true);
      return;
    }

    setIsValid(false);
  }, [form, getErrorMsg, finalValue]);

  useEffect(() => {
    onChange?.(finalValue, isValid);
  }, [onChange, finalValue, isValid]);

  const pattern = PATTERN_DICT[type];
  const errorBoxId = useMemo(() => `${label}-error-message`, [label]);

  // class names
  const { disabled } = args;

  const heightClassName = 'h-[2.75rem] max-h-[2.75rem]';
  const borderClassName = '';
  const bgClassName = `border border-solid ${
    disabled ? 'border-disabled bg-disabled' : 'bg-on_primary transition-colors Transition_500 border-primary_line_dark'
  }`;
  const iconColorClassName = 'text-caption';
  const colorClassName = `placeholder:text-caption_on_primary text-white ${
    disabled ? '' : 'transition-colors Transition_500 focus-within:text-primary group-hover/text-input:text-white'
  }`;
  const fontClassName =
    type === 'number'
      ? 'placeholder:Font_caption_md_num Font_data_16px_num md:placeholder:Font_caption_sm_num md:Font_data_14px_num'
      : 'placeholder:Font_caption_md Font_data_16px md:placeholder:Font_caption_sm md:Font_data_14px';
  const cursorClassName = disabled ? 'cursor-not-allowed' : 'cursor-text';

  return (
    <div className={`relative w-full ${className}`}>
      <label className="sr-only" htmlFor={label}>
        {label}
      </label>

      <div
        className={`group/text-input relative flex items-center gap-x-card_padding_x px-card_padding_x py-1 rounded-full Elevation_box_1 ${heightClassName} ${bgClassName} ${borderClassName} ${iconColorClassName}`}>
        {getIcon(children)}

        <input
          id={label}
          value={value}
          type={type}
          pattern={pattern}
          autoCapitalize="none"
          autoComplete="none"
          aria-autocomplete="none"
          className={`inline-block w-full h-full bg-transparent Font_data_16px_num ${colorClassName} ${fontClassName} ${cursorClassName}`}
          onChange={(e) => setValue(e.target.value)}
          // @ts-ignore
          onInput={(e) => onInput?.(e.target.value)}
          aria-invalid={!isValid}
          aria-errormessage={errorBoxId}
          {...args}
        />
      </div>

      {!isValid && (
        <div id={errorBoxId} role="alert" hidden={isValid} className="text-semantic_danger Font_caption_sm animate-fade_in pt-2">
          {getErrorMsg?.(debouncedValue)}
        </div>
      )}
    </div>
  );
};

export default Container;
