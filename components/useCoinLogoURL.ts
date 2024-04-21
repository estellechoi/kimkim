import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { coinMarketCapMetadataAtom } from '@/store/states';
import USDT_LOGO_SVG from '@/resources/coin_logos/usdt.svg';

const COIN_LOGO_FALLBACK_MAP: Record<string, string> = {
  USDT: USDT_LOGO_SVG.src,
};

const useCoinLogoURL = (symbol?: string) => {
  const [coinMarketCapMetadata] = useAtom(coinMarketCapMetadataAtom);

  return useMemo<string | undefined>(() => {
    if (!symbol) return undefined;
    return coinMarketCapMetadata?.[symbol]?.logo ?? COIN_LOGO_FALLBACK_MAP[symbol];
  }, [symbol, coinMarketCapMetadata]);
};

export default useCoinLogoURL;
