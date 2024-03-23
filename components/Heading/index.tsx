import type { ReactNode } from 'react';

type HeadingTagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
type HeadingColor = 'body' | 'on_primary';

const FONT_CLASS_DICT: Record<HeadingTagName, string> = {
  h1: 'Font_display_xs md:Font_display_sm',
  h2: 'Font_display_xs',
  h3: 'Font_title_md',
  h4: 'Font_title_xs',
  h5: 'Font_title_xs',
};

const TEXT_COLOR_DICT: Record<HeadingColor, string> = {
  body: 'text-body',
  on_primary: 'text-ground',
};

type HeadingProps = {
  children: ReactNode;
  tagName: HeadingTagName;
  color?: HeadingColor;
  className?: string;
};

const Heading = ({ children, tagName, color = 'body', className = '' }: HeadingProps) => {
  const HeadingElement = tagName;
  const fontClassName = FONT_CLASS_DICT[tagName];
  const colorClassName = TEXT_COLOR_DICT[color];

  return (
    <HeadingElement className={`Component inline-flex ${colorClassName} ${fontClassName} ${className}`}>
      {children}
    </HeadingElement>
  );
};

export default Heading;
