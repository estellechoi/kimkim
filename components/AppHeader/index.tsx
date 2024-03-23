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

      <DropDown<Fiats>
        placeholder="Select chain"
        defaultKey={selectedCurrency}
        disabledKeys={[Fiats.USD]}
        options={[
          { label: <div className="flex items-center gap-x-2 Font_label_14px"><Currency currency={Fiats.KRW} /><span>{Fiats.KRW}</span></div>, key: Fiats.KRW }, 
          { label: <div className="flex items-center gap-x-2 Font_label_14px"><Currency currency={Fiats.USD} /><span>{Fiats.USD}</span></div>, key: Fiats.USD },
        ]} 
        onChange={setSelectedCurrency}
      />
    </header>
  );
};

export default AppHeader;
