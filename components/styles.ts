export type TextColor = 'primary' | 'on_primary' | 'body' | 'caption';

export const TEXT_COLOR_CLASS_DICT: Record<TextColor, string> = {
  primary: 'text-primary',
  on_primary: 'text-white',
  body: 'text-body',
  caption: 'text-caption',
};
