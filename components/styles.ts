import { NotiStatus } from "@/types/noti"

export type TextColor = 'primary' | 'on_primary' | 'body' | 'caption';

export const TEXT_COLOR_CLASS_DICT: Record<TextColor, string> = {
  primary: 'text-primary',
  on_primary: 'text-white',
  body: 'text-body',
  caption: 'text-caption',
};

export const NOTI_COLOR_CLASSNAMES_DICT: Record<NotiStatus, { text: string; background: string; border: string }> = {
    info: { text: 'text-semantic_info', background: 'bg-semantic_info', border: 'border-semantic_info' },
    error: { text: 'text-semantic_danger', background: 'bg-semantic_danger', border: 'border-semantic_danger' },
    warning: { text: 'text-semantic_warning', background: 'bg-semantic_warning', border: 'border-semantic_warning' },
    success: { text: 'text-semantic_success', background: 'bg-semantic_success', border: 'border-semantic_success' },
    neutral: { text: 'text-caption', background: 'bg-caption', border: 'border-caption' },
}