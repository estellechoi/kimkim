import { useMergeRefs } from '@floating-ui/react';
import { ForwardedRef, ReactNode, forwardRef } from 'react';

export type CardColor = 'primary' | 'on_primary' | 'glass' | 'caption' | 'body';
export type CardSize = 'sm' | 'md';

const CARD_BG_COLOR_DICT: Record<CardColor, string> = {
  primary: 'bg-primary text-white',
  on_primary: 'bg-ground text-ground',
  glass: 'Bg_glass border border-solid border-transparent md:border-primary_line_dark',
  caption: 'bg-caption text-white',
  body: 'bg-body text-ground',
};

const CARD_RADIUS_CLASS_DICT: Record<CardSize, string> = {
  sm: 'md:rounded-card_sm',
  md: 'md:rounded-card_md',
};

type CardProps = { children: ReactNode; color?: CardColor; size?: CardSize; className?: string };

const CardRefForwarder = (
  { children, color = 'primary', size = 'md', className = '' }: CardProps,
  propRef?: ForwardedRef<HTMLElement>,
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
