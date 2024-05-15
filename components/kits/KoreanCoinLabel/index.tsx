import Coin from '@/components/Coin';
import { tokenKoreanNameMapAtom } from '@/store/states';
import { useAtom } from 'jotai';

type KoreanCoinLabelProps = Readonly<{ symbol: string }>;

const KoreanCoinLabel = ({ symbol }: KoreanCoinLabelProps) => {
  const [tokenKoreanNameMap] = useAtom(tokenKoreanNameMapAtom);

  const koreanName = tokenKoreanNameMap?.[symbol] ?? symbol;

  return (
    <div className="flex items-center gap-x-2">
      <Coin symbol={symbol} size="sm" />
      <div className="inline-flex items-center gap-x-2 Font_label_14px">
        {koreanName}
        <span className="Font_caption_xs text-caption">{symbol}</span>
      </div>
    </div>
  );
};

export default KoreanCoinLabel;
