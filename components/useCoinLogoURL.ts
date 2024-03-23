import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { coinMarketCapMetadataAtom } from '@/store/states';

const useCoinLogoURL = (symbol?: string) => {
  const [coinMarketCapMetadata] = useAtom(coinMarketCapMetadataAtom);

  return useMemo<string | undefined>(() => {
    return symbol ? coinMarketCapMetadata[symbol]?.logo : undefined;
  }, [symbol, coinMarketCapMetadata]);
};

export default useCoinLogoURL;
