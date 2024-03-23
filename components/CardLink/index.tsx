import Link, { type LinkProps } from 'next/link';
import Card, { type CardColor } from '@/components/Card';
import Icon from '@/components/Icon';

const TEXT_COLOR_DICT: Record<CardColor, string> = {
  primary: 'text-ground',
  on_primary: 'text-primary',
  glass: 'text-primary',
  secondary: 'text-white',
  caption: 'text-white',
};

type CardLinkProps = LinkProps & {
  label: string | JSX.Element;
  color?: CardColor;
  className?: string;
};

/**
 *
 * @see https://nextjs.org/docs/pages/api-reference/components/link
 */
const CardLink = ({ label, color = 'primary', className = '', ...props }: CardLinkProps) => {
  const hoverAnimationClassName =
    'relative after:absolute after:inset-0 after:transition-colors after:Transition_500 hover:after:bg-black_o10';
  const cardGridClassName = 'flex justify-between items-center gap-x-2 px-card_padding_x py-card_padding_y';
  const fontClassName = 'Font_button_md';
  const hoverIconAnimationClassName = 'transition-transform Transition_500 group-hover/card-link:translate-x-1.5';
  const colorClassName = TEXT_COLOR_DICT[color];

  return (
    <Link {...props} className={`group/card-link block ${hoverAnimationClassName} ${className}`}>
      <Card color={color} size="sm" className={`${cardGridClassName}`}>
        {typeof label === 'string' ? <span className={`${fontClassName} ${colorClassName}`}>{label}</span> : label}
        <Icon type="arrow_forward" className={`${hoverIconAnimationClassName} ${colorClassName}`} />
      </Card>
    </Link>
  );
};

export default CardLink;
