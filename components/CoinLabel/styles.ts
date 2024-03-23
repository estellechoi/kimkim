import type { CoinSize } from '@/components/Coin';
import { type TextColor, TEXT_COLOR_CLASS_DICT } from '@/components/styles';

export type CoinLabelSize = 'sm' | 'md' | 'lg';

export const SIZE_DICT: Record<CoinLabelSize, { coinSize: CoinSize; fontClassName: string; descriptionFontClassName: string }> = {
  sm: { coinSize: 'sm', fontClassName: 'Font_body_xs', descriptionFontClassName: 'Font_caption_xs' },
  md: { coinSize: 'md', fontClassName: 'Font_body_sm', descriptionFontClassName: 'Font_caption_xs' },
  lg: { coinSize: 'lg', fontClassName: 'Font_body_md', descriptionFontClassName: 'Font_caption_xs' },
};

export type CoinLabelColor = TextColor;
export const COLOR_CLASS_DICT: Record<CoinLabelColor, string> = TEXT_COLOR_CLASS_DICT;
