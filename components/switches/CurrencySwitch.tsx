import Switch, { SwitchProps } from '@/components/Switch';

type CurrencySwitchProps = Omit<SwitchProps<string>, 'labels' | 'size'>;

const BALANCE_CURRENCIES: readonly [string, string] = ['$', 'T'];

const CurrencySwitch = (props: CurrencySwitchProps) => {
  return <Switch<string> size="sm" labels={BALANCE_CURRENCIES} className="min-w-[4rem]" {...props} />;
};

export default CurrencySwitch;
