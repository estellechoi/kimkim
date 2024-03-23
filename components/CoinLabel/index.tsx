import Coin from '@/components/Coin';
import { COLOR_CLASS_DICT, CoinLabelColor, CoinLabelSize, SIZE_DICT } from './styles';
import { TokenSymbols } from '@/constants/app';

type CoinLabelProps = {
  symbol?: TokenSymbols;
  description?: string;
  size?: CoinLabelSize;
  color?: CoinLabelColor;
  logoURL?: string;
};

const CoinLabel = ({ symbol, description, size = 'md', color = 'primary', logoURL }: CoinLabelProps) => {
  const { coinSize, fontClassName, descriptionFontClassName } = SIZE_DICT[size];
  const colorClassName = COLOR_CLASS_DICT[color];
  const captionColorClassName = color === 'primary' ? 'text-caption_on_primary' : 'text-caption';

  return (
    <span className="inline-flex items-center gap-x-2">
      <Coin size={coinSize} symbol={symbol} logoURL={logoURL} />
      <span className={`inline-flex flex-col ${colorClassName} ${fontClassName}`}>
        {symbol}
        {description && <span className={`${captionColorClassName} ${descriptionFontClassName}`}>{description}</span>}
      </span>
    </span>
  );
};

export default CoinLabel;
