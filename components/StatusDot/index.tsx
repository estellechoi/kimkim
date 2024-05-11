import { NotiStatus } from '@/types/noti';
import { NOTI_COLOR_CLASSNAMES_DICT } from '@/components/styles';

type StatusDotProps = { status?: NotiStatus; label?: string };

const StatusDot = ({ status = 'neutral', label }: StatusDotProps) => {
  const { background: backgroundClassName, text: textClassName } = NOTI_COLOR_CLASSNAMES_DICT[status];

  return (
    <div className="inline-flex items-center gap-x-1">
      <div
        className={`${backgroundClassName} grow-0 shrink-0 relative w-2 h-2 rounded-full`}
        style={{ transition: `background-color ease 250ms` }}></div>
      {label && <div className={`Font_caption_xs ${textClassName}`}>{label}</div>}
    </div>
  );
};

export default StatusDot;
