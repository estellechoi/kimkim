import { useFetchCoinMarketCapMetadata } from "@/data/hooks";
import { coinMarketCapMetadataAtom } from "@/store/states";
import { useAtom } from "jotai";
import { useEffect } from "react";

const useCoinMarketCapMetadataUpdate = (coinMarketCapIds: readonly number[]) => {
    const [, setCoinMarketCapMetadata] = useAtom(coinMarketCapMetadataAtom);

    const { data: coinMarketCapMetaData } = useFetchCoinMarketCapMetadata(0, coinMarketCapIds);

    useEffect(() => {
      const metadataMap = coinMarketCapIds.reduce((acc, item) => {
        const metadata = coinMarketCapMetaData?.data.data?.[item.toString()];
        return metadata ? { ...acc, [metadata.symbol]: metadata } : acc;
      }, {});
  
      setCoinMarketCapMetadata(metadataMap);
    }, [coinMarketCapIds, coinMarketCapMetaData]);
}

export default useCoinMarketCapMetadataUpdate;