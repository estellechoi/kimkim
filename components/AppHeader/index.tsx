import Link from 'next/link';
import AppLogo from '@/components/AppLogo';
import useAppHeaderClassName from './useAppHeaderClassName';
import DropDown from '@/components/DropDown';
import { Exchanges, Fiats } from '@/constants/app';
import { useAtom } from 'jotai';
import { selectedCurrencyAtom } from '@/store/states';
import Currency from '@/components/Currency';
import ExchangeRatePolling from '@/components/pollings/ExchangeRatePolling';
import USDTPricePolling from '@/components/pollings/USDTPricePolling';
import Coin from '@/components/Coin';
import useModal from '@/hooks/useModal';
import { Suspense, useCallback } from 'react';
import CoffeeOverlay from '@/components/overlays/CoffeeOverlay';
import USDTBithumbPricePolling from '@/components/pollings/USDTBithumbPricePolling';
import ExchangeLogo from '@/components/ExchangeLogo';
import IconButton from '@/components/IconButton';

type AppHeaderProps = { className?: string };

const AppHeader = ({ className = '' }: AppHeaderProps) => {
  const appHeaderClassName = useAppHeaderClassName();

  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);

  const coffeeModal = useModal();

  const openCoffeeModal = useCallback(async () => {
    await coffeeModal.open((props) => (
      <Suspense>
        <CoffeeOverlay id={coffeeModal.id} {...props} />
      </Suspense>
    ));
  }, [coffeeModal]);

  return (
    <header className={`h-app_header_height flex flex-col items-stretch ${className}`}>
      <div className="grow-0 shrink-0 bg-ground_variant_dark flex flex-wrap items-center gap-x-6 md:gap-x-8 px-app_header_padding_x py-2">
        <ExchangeRatePolling className="hidden md:flex" />

        <div className="flex items-center gap-x-2">
          <Coin size="sm" symbol="USDT" />
          <USDTPricePolling />
        </div>

        <div className="flex items-center gap-x-2">
          <ExchangeLogo exchange={Exchanges.BITHUMB} size="sm" />
          <USDTBithumbPricePolling />
        </div>
      </div>

      <div className={`grow shrink ${appHeaderClassName}`}>
        <Link href="/">
          <AppLogo size="sm" color="light" className="md:hidden" />
          <AppLogo size="md" color="light" className="hidden md:block" />
        </Link>

        <div className="flex items-center gap-x-2 md:gap-x-6">
          <DropDown<Fiats>
            color="ground"
            placeholder="Select currency"
            defaultKey={selectedCurrency}
            disabledKeys={[Fiats.USD, Fiats.AUD]}
            options={Object.values(Fiats).map((fiat) => ({
              label: (
                <div className="flex items-center gap-x-2 Font_label_14px">
                  <Currency currency={fiat} />
                  <span>{fiat}</span>
                </div>
              ),
              key: fiat,
            }))}
            onChange={setSelectedCurrency}
          />

          <div className="flex items-center gap-x-0 md:gap-x-2">
            <IconButton
              iconType="coffee"
              className="text-caption"
              aria-expanded={coffeeModal.isOpen}
              aria-controls={coffeeModal.id}
              onClick={openCoffeeModal}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
