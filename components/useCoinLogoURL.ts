import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { coinGeckoCoinMapAtom } from '@/store/states';

const useCoinLogoURL = (symbol?: string) => {

  const [coinGeckoCoinMap] = useAtom(coinGeckoCoinMapAtom);

  return useMemo<string | undefined>(() => {
    return symbol ? coinGeckoCoinMap?.[symbol]?.image : undefined;
  }, [symbol, coinGeckoCoinMap]);
};

export default useCoinLogoURL;
