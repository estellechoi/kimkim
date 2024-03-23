import { TEXT_COLOR_CLASS_DICT, type TextColor } from '@/components/styles';

type CaptionTextColor = TextColor;
type CaptionTextSize = 'xs';

const COLOR_CLASS_DICT = TEXT_COLOR_CLASS_DICT;
const FONT_CLASS_DICT: Record<CaptionTextSize, string> = {
  xs: 'Font_caption_xs',
};

type CaptionTextProps = {
  text: string;
  shadowText?: string;
  color?: CaptionTextColor;
  size: CaptionTextSize;
  className?: string;
};
const CaptionText = ({ text, shadowText, color = 'primary', size, className }: CaptionTextProps) => {
  const colorClassName = COLOR_CLASS_DICT[color];
  const fontClassName = FONT_CLASS_DICT[size];

  return (
    <span className={`inline-flex items-baseline gap-x-1 truncate ${colorClassName} ${fontClassName} ${className}`}>
      {text}
      {shadowText && <span className="opacity-50">{shadowText}</span>}
    </span>
  );
};

export default CaptionText;
