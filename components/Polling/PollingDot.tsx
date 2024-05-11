import { NotiStatus } from '@/types/noti';
import { ReactNode } from 'react';
import { NOTI_COLOR_CLASSNAMES_DICT } from '@/components/styles';

type PollingDotProps = { children: ReactNode; status?: NotiStatus };

const PollingDot = ({ children, status = 'neutral' }: PollingDotProps) => {
  const { background: backgroundClassName } = NOTI_COLOR_CLASSNAMES_DICT[status];

  return (
    <div
      className={`${backgroundClassName} relative w-2 h-2 min-w-[0.5rem] min-h-[0.5rem] rounded-full`}
      style={{ transition: `background-color ease 250ms` }}>
      {children}
    </div>
  );
};

export default PollingDot;
