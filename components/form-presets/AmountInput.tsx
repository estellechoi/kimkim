import { useRef } from 'react';
import TextInput from '@/components/TextInput';
import { TextInputProps } from '@/components/TextInput/Container';

type AmountInputProps = Omit<TextInputProps, 'type' | 'min' | 'initialValue' | 'errorMsg' | 'onChange'> & {
  initialValue?: number;
  getErrorMsg?: (value: string) => string | null;
  onChange?: (debouncedValue: string, isValid: boolean) => void;
};

const AmountInput = ({ initialValue, getErrorMsg, onChange, ...args }: AmountInputProps) => {
  const { form, placeholder, max, label } = args;

  const formRef = useRef<HTMLFormElement>(form);

  return (
    <TextInput
      form={formRef.current}
      label={label}
      type="number"
      min="0"
      max={max}
      placeholder={placeholder ?? '0.0'}
      initialValue={initialValue?.toString()}
      getErrorMsg={getErrorMsg}
      onChange={onChange}
    >
      {/* <TextInput.Icon type="search" /> */}
    </TextInput>
  );
};

export default AmountInput;
