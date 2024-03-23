import { type NumberTextSize } from '@/components/NumberText';

const TEXT_SIZE_MAPPING_DICT: Record<NumberTextSize, { amount: string; unit: string }> = {
  sm: {
    amount: 'Font_caption_xs_num',
    unit: 'Font_caption_xs',
  },
  md: {
    amount: 'Font_caption_sm_num',
    unit: 'Font_caption_sm',
  },
  lg: {
    amount: 'Font_caption_md_num',
    unit: 'Font_caption_md',
  },
  xl: {
    amount: 'Font_caption_lg_num',
    unit: 'Font_caption_lg',
  },
};

export type CaptionAmountProps = {
  size: NumberTextSize;
  formattedAmount?: string;
  amountUnit?: string;
};

const CaptionAmount = ({ formattedAmount, size, amountUnit }: CaptionAmountProps) => {
  const fontSizeClassNames = TEXT_SIZE_MAPPING_DICT[size];

  return (
    <span className="inline-flex items-baseline gap-x-1 text-caption">
      <span className={`${fontSizeClassNames.amount}`}>{formattedAmount}</span>
      <span className={`${fontSizeClassNames.unit}`}>{amountUnit}</span>
    </span>
  );
};

export default CaptionAmount;
