import { type HTMLProps, type ReactNode, useEffect, useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import getReactElements from '@/components/utils/getReactElements';
import Icon from '@/components/Icon';
import { TextInputType } from './types';
import { PATTERN_DICT } from './constants';

const getIcon = (children: ReactNode | undefined) => getReactElements(children, Icon)[0];

export type TextInputProps = Omit<
  HTMLProps<HTMLInputElement>,
  'type' | 'pattern' | 'value' | 'autocapitalize' | 'form' | 'className' | 'onChange' | 'label'
> & {
  children?: ReactNode;
  form: HTMLFormElement | null;
  type: TextInputType;
  label: string;
  getErrorMsg?: (value: string) => string | null;
  initialValue?: string;
  className?: string;
  onChange?: (value: string, isValid: boolean) => void;
};

const Container = ({
  children,
  form,
  type,
  initialValue,
  className = '',
  onChange,
  label,
  getErrorMsg,
  ...args
}: TextInputProps) => {
  const { required } = args;

  const [value, setValue] = useState<string>(initialValue ?? '');
  const debouncedValue = useDebounce(value, 500);

  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    if (!required && debouncedValue === '') {
      setIsValid(true);
      return;
    }

    const errorMsg = getErrorMsg?.(debouncedValue);
    if (errorMsg === null) {
      setIsValid(true);
      return;
    }

    if (errorMsg === undefined && form?.checkValidity() !== false) {
      setIsValid(true);
      return;
    }

    setIsValid(false);
  }, [form, getErrorMsg, debouncedValue]);

  useEffect(() => {
    onChange?.(debouncedValue, isValid);
  }, [onChange, debouncedValue, isValid]);

  const pattern = PATTERN_DICT[type];
  const errorBoxId = useMemo(() => `${label}-error-message`, [label]);

  // class names
  const { disabled } = args;

  const heightClassName = 'h-[3.125rem] max-h-[3.125rem]';
  const borderClassName = '';
  const bgClassName = `border border-solid ${
    disabled
      ? 'border-disabled bg-disabled'
      : 'bg-ground transition-colors Transition_500 border-primary_line_light bg-glass focus-within:bg-white hover:bg-white'
  }`;
  const iconColorClassName = 'text-caption_on_primary';
  const colorClassName = `placeholder:text-caption_on_primary text-black ${
    disabled ? '' : 'transition-colors Transition_500 focus-within:text-black group-hover/text-input:text-black'
  }`;
  const fontClassName = 'placeholder:Font_caption_md Font_body_md';
  const cursorClassName = disabled ? 'cursor-not-allowed' : 'cursor-text';

  return (
    <div className={`relative w-full ${className}`}>
      <label className="sr-only" htmlFor={label}>
        {label}
      </label>

      <div
        className={`group/text-input relative flex items-center gap-x-card_padding_x px-card_padding_x py-card_padding_y rounded-card_sm Elevation_box_1 ${heightClassName} ${bgClassName} ${borderClassName} ${iconColorClassName}`}
      >
        {getIcon(children)}

        <input
          id={label}
          value={value}
          type={type}
          pattern={pattern}
          autoCapitalize="none"
          autoComplete="none"
          aria-autocomplete="none"
          className={`inline-block w-full h-full bg-transparent ${colorClassName} ${fontClassName} ${cursorClassName}`}
          onChange={(e) => setValue(e.target.value)}
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
