import NumberText, { type NumberTextSize } from '@/components/NumberText';
import { TextColor } from '@/components/styles';
import { AllChains, TokenSymbols } from '@/constants/app';
import Coin, { type CoinSize } from '@/components/Coin';

export type CoinAmountColor = TextColor;

const COIN_SIZE_MAPPING_DICT: Record<NumberTextSize, CoinSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
};

export type CoinAmountProps = {
  color?: CoinAmountColor;
  size: NumberTextSize;
  symbol?: TokenSymbols;
  chain?: AllChains;
  formattedAmount?: string;
};

const CoinAmount = ({ formattedAmount, color = 'body', size, symbol, chain }: CoinAmountProps) => {
  const coinSize = COIN_SIZE_MAPPING_DICT[size];

  return (
    <span className="w-fit flex items-center gap-x-2.5">
      {/* <CoinLabel color={color} size={coinLabelSize} symbol={symbol} /> */}
      <Coin size={coinSize} symbol={symbol} chain={chain} />
      <NumberText color={color} size={size} formattedNumber={formattedAmount} unit={symbol} />
    </span>
  );
};

export default CoinAmount;
