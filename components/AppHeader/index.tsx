// import dynamic from 'next/dynamic';
import Link from 'next/link';
import AppLogo from '@/components/AppLogo';
import useAppHeaderClassName from './useAppHeaderClassName';
import DropDown from '@/components/DropDown';
import { AllChains, Fiats } from '@/constants/app';
import ChainLabel from '../ChainLabel';
import { useAtom } from 'jotai';
import {  selectedCurrencyAtom } from '@/store/states';
import Currency from '../Currency';
import ExchangeRatePolling from '../pollings/ExchangeRatePolling';

// const AccountButton = dynamic(() => import('@/components/buttons/AccountButton'), {
//   ssr: false,
// });

type AppHeaderProps = { className?: string };

const AppHeader = ({ className = '' }: AppHeaderProps) => {
  const defaultClassName = useAppHeaderClassName();

  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);

  return (
    <header className={`${defaultClassName} ${className}`}>
      <Link href="/">
        <AppLogo size="md" color="dark" />
      </Link>

      <div className="flex items-center gap-x-10">
        <ExchangeRatePolling />

        <DropDown<Fiats>
          placeholder="Select chain"
          defaultKey={selectedCurrency}
          disabledKeys={[Fiats.USD, Fiats.AUD]}
          options={Object.values(Fiats).map(fiat => ({ label: <div className="flex items-center gap-x-2 Font_label_14px"><Currency currency={fiat} /><span>{fiat}</span></div>, key: fiat }))} 
          onChange={setSelectedCurrency}
        />
      </div>
    </header>
  );
};

export default AppHeader;
