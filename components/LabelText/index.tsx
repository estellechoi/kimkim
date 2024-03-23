type LabelTextSize = 'sm';

const FONT_CLASS_DICT: Record<LabelTextSize, string> = {
  sm: 'Font_body_sm',
};

type LabelTextProps = {
  text: string;
  size: LabelTextSize;
  className?: string;
};

const LabelText = ({ text, size, className = '' }: LabelTextProps) => {
  const fontClassName = FONT_CLASS_DICT[size];
  return <span className={`inline-block text-caption ${fontClassName} ${className}`}>{text}</span>;
};

export default LabelText;
