import { BaseExchange, Exchanges } from '@/constants/app';
import useBithumbVolume from '@/hooks/useBithumbVolume';
import useUpbitVolume from '@/hooks/useUpbitVolume';
import { formatKRW } from '@/utils/number';
import { useMemo } from 'react';
import KoreanCoinLabel from '@/components/kits/KoreanCoinLabel';

type VolumeMatchProps = Readonly<{
  exchange: BaseExchange;
  symbol: string;
  className?: string;
}>;

const VolumeMatch = ({ exchange, symbol, className }: VolumeMatchProps) => {
  const upbitVolumes = useUpbitVolume(exchange === Exchanges.UPBIT, symbol);
  const bithumbVolumes = useBithumbVolume(exchange === Exchanges.BITHUMB, symbol);

  const { askVolume, bidVolume } = useMemo(() => {
    switch (exchange) {
      case Exchanges.UPBIT:
        return upbitVolumes;
      case Exchanges.BITHUMB:
        return bithumbVolumes;
    }
  }, [exchange, upbitVolumes, bithumbVolumes]);

  const bidPercentage = useMemo(() => {
    if (askVolume === 0 && bidVolume === 0) return 0;
    if (askVolume === 0) return 100;
    return (bidVolume / (bidVolume + askVolume)) * 100;
  }, [bidVolume, askVolume]);

  const askPercentage = useMemo(() => 100 - bidPercentage, [bidPercentage]);

  const bidAskTrend = useMemo(() => {
    return {
      backgroundClassName: bidPercentage === 50 ? 'bg-caption' : bidPercentage > 50 ? 'bg-semantic_bull' : 'bg-semantic_bear',
      textClassName: bidPercentage === 50 ? 'text-caption' : bidPercentage > 50 ? 'text-semantic_bull' : 'text-semantic_bear',
      text: bidPercentage === 50 ? '-' : bidPercentage > 50 ? '매수' : '매도',
    };
  }, [bidPercentage]);

  return (
    <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-8 md:gap-10 ${className}`}>
      <div className="grow-0 shrink-0 basis-auto flex justify-between md:justify-start items-center gap-x-4">
        <div className="w-[220px]">
          <KoreanCoinLabel symbol={symbol} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${bidAskTrend.backgroundClassName}`}></div>
          <div className={`Font_caption_xs_num ${bidAskTrend.textClassName}`}>{bidAskTrend.text}</div>
        </div>
      </div>

      <div className="grow shrink basis-full w-full flex flex-col items-stretch gap-2">
        <div className="w-full flex items-stretch gap-0 rounded-full overflow-hidden">
          <div
            className="grow shrink basis-auto h-3 flex items-stretch bg-semantic_bear Transition_500 transition-all"
            style={{ width: `${askPercentage}%` }}></div>
          <div
            className="grow shrink basis-auto h-3 flex items-stretch bg-semantic_bull Transition_500 transition-all"
            style={{ width: `${bidPercentage}%` }}></div>
        </div>

        <div className="flex justify-between items-center gap-x-4">
          <div className="flex items-center justify-center text-caption Font_caption_xs_num">
            매도 {formatKRW(askVolume, { compact: true })}
          </div>
          <div className="flex items-center justify-center text-caption Font_caption_xs_num">
            매수 {formatKRW(bidVolume, { compact: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeMatch;
