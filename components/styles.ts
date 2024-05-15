import { NotiStatus } from '@/types/noti';

export type TextColor = 'primary' | 'on_primary' | 'body' | 'caption';

export const TEXT_COLOR_CLASS_DICT: Record<TextColor, string> = {
  primary: 'text-primary',
  on_primary: 'text-white',
  body: 'text-body',
  caption: 'text-caption',
};

export const NOTI_COLOR_CLASSNAMES_DICT: Record<
  NotiStatus,
  { text: string; background: string; groundBackground: string; border: string }
> = {
  info: {
    text: 'text-semantic_info',
    background: 'bg-semantic_info',
    groundBackground: 'bg-semantic_info_ground',
    border: 'border-semantic_info',
  },
  error: {
    text: 'text-semantic_danger',
    background: 'bg-semantic_danger',
    groundBackground: 'bg-semantic_danger_ground',
    border: 'border-semantic_danger',
  },
  warning: {
    text: 'text-semantic_warning',
    background: 'bg-semantic_warning',
    groundBackground: 'bg-semantic_warning_ground',
    border: 'border-semantic_warning',
  },
  success: {
    text: 'text-semantic_success',
    background: 'bg-semantic_success',
    groundBackground: 'bg-semantic_success_ground',
    border: 'border-semantic_success',
  },
  neutral: { text: 'text-white', background: 'bg-white', groundBackground: 'bg-white_o10', border: 'border-white' },
};
