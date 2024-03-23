import { useMergeRefs } from '@floating-ui/react';
import { ForwardedRef, ReactNode, forwardRef } from 'react';

export type CardColor = 'primary' | 'on_primary' | 'glass' | 'secondary' | 'caption';
export type CardSize = 'sm' | 'md';

const CARD_BG_COLOR_DICT: Record<CardColor, string> = {
  primary: 'bg-primary text-white',
  on_primary: 'bg-ground text-ground',
  glass: 'Bg_glass border border-solid border-primary_line_light',
  secondary: 'bg-secondary text-white',
  caption: 'bg-caption text-white',
};

const CARD_RADIUS_CLASS_DICT: Record<CardSize, string> = {
  sm: 'rounded-card_sm',
  md: 'rounded-card_md',
};

type CardProps = { children: ReactNode; color?: CardColor; size?: CardSize; className?: string };

const CardRefForwarder = (
  { children, color = 'primary', size = 'md', className = '' }: CardProps,
  propRef?: ForwardedRef<HTMLElement>
) => {
  const bgClassName = CARD_BG_COLOR_DICT[color];
  const radiusClassName = CARD_RADIUS_CLASS_DICT[size];

  const ref = useMergeRefs([propRef]);

  return (
    <div ref={ref} className={`h-fit overflow-hidden ${bgClassName} ${radiusClassName} ${className}`}>
      {children}
    </div>
  );
};

const Card = forwardRef(CardRefForwarder);

export default Card;
