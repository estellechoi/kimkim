import { NotiStatus } from "@/types/noti"

export const NOTI_COLOR_CLASSNAMES_DICT: Record<NotiStatus, { text: string; background: string; border: string }> = {
    info: { text: 'text-semantic_info', background: 'bg-semantic_info', border: 'border-semantic_info' },
    error: { text: 'text-semantic_danger', background: 'bg-semantic_danger', border: 'border-semantic_danger' },
    warning: { text: 'text-semantic_warning', background: 'bg-semantic_warning', border: 'border-semantic_warning' },
    success: { text: 'text-semantic_success', background: 'bg-semantic_success', border: 'border-semantic_success' },
    neutral: { text: 'text-body', background: 'bg-body', border: 'border-body' },
}