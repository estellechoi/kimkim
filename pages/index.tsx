import type { NextPage } from 'next';
import Main from '@/components/Main';
import { Fiats } from '@/constants/app';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { currencyExchangeRateAtom } from '@/store/states';

const KimchiPremiumSection = dynamic(() => import('@/components/home/KimchiPremiumSection'), { ssr: false });

const Home: NextPage = () => {
  const [currencyExchangeRate] = useAtom(currencyExchangeRateAtom);
  const krwByUsd = currencyExchangeRate.rates[Fiats.KRW];
  const audByUsd = currencyExchangeRate.rates[Fiats.AUD];

  return (
    <Main className="flex flex-col items-center gap-y-20 min-h-screen pt-app_header_height pb-page_bottom">
      <KimchiPremiumSection krwByUsd={krwByUsd} audByUsd={audByUsd} className="mt-10" />
    </Main>
  );
};

export default Home;
