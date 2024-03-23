import AppSymbolSVG from '@/components/svgs/AppSymbolSVG';
import type { WaitingSymbolColor } from './types';

const COLOR_CLASS_DICT: Record<WaitingSymbolColor, string> = {
  white: 'text-white',
  primary: 'text-primary',
  secondary: 'text-secondary',
};

const WaitingSymbolUnit = ({ color, className }: { color: WaitingSymbolColor; className?: string }) => {
  const colorClassName = COLOR_CLASS_DICT[color];
  return <AppSymbolSVG className={`w-3 h-3 ${colorClassName} ${className}`} />;
};

export default WaitingSymbolUnit;
