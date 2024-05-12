import TextInput from '@/components/TextInput';
import { Fiats } from '@/constants/app';
import { TextInputProps } from '@/components/TextInput/Container';
import Currency from '@/components/Currency';

type CurrencyAmountInputProps = Omit<TextInputProps, 'type' | 'label' | 'form'> & {
  fiat: Fiats;
  className?: string;
};

const CurrencyAmountInput = ({ fiat, ...args }: CurrencyAmountInputProps) => {
  return (
    <div className="w-full flex items-center gap-x-4">
      <Currency currency={fiat} />
      <div className="grow-0 shrink-0 w-fit Font_label_14px text-caption">{fiat}</div>
      <TextInput form={null} label={fiat} type="number" className="grow shrink w-full" {...args} />
    </div>
  );
};

export default CurrencyAmountInput;
