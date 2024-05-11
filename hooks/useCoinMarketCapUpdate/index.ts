import { useFetchCoinMarketCapCoinMetadata } from '@/data/hooks';
import { CoinMarketCapMetadataApiData } from '@/pages/api/cmc/metadata';
import { coinMarketCapMetadataAtom } from '@/store/states';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

const useCoinMarketCapUpdate = (symbols: readonly string[]) => {
  const [coinMarketCapMetadata, setCoinMarketCapMetadataAtom] = useAtom(coinMarketCapMetadataAtom);

  const { data: coinMarketCapCoinMetadata } = useFetchCoinMarketCapCoinMetadata(0, symbols);

  useEffect(() => {
    if (!coinMarketCapCoinMetadata?.data?.data) return;

    const data = coinMarketCapCoinMetadata.data.data;
    const reducedData = Object.keys(data).reduce<Record<string, CoinMarketCapMetadataApiData>>((acc, key) => {
      return { ...acc, [key]: data[key][0] };
    }, {});

    setCoinMarketCapMetadataAtom({ ...coinMarketCapMetadata, ...reducedData });
  }, [coinMarketCapMetadata, coinMarketCapCoinMetadata?.data?.data]);
};

export default useCoinMarketCapUpdate;
