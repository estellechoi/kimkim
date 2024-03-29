import type { WaitingSymbolColor } from './types';

const COLOR_CLASS_DICT: Record<WaitingSymbolColor, string> = {
  caption: 'bg-caption',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  body: 'bg-body',
};

const WaitingSymbolUnit = ({ color, className }: { color: WaitingSymbolColor; className?: string }) => {
  const colorClassName = COLOR_CLASS_DICT[color];
  return <div className={`w-2 h-2 rounded-full ${colorClassName} ${className}`}></div>;
};

export default WaitingSymbolUnit;
