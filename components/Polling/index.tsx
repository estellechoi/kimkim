import { NotiStatus } from '@/types/noti'
import { useEffect, useState } from 'react'
import PollingDot from './PollingDot'
import PollingSpinner from './PollingSpinner'
import { NOTI_COLOR_CLASSNAMES_DICT } from '@/components/styles';

type PollingProps = {
  formattedNumber?: string
  caption?: string
  status?: NotiStatus
  className?: string
  isLoading?: boolean;
};

const Polling = ({
  formattedNumber,
  caption,
  status = 'neutral',
  className,
  isLoading,
}: PollingProps) => {
  const [isMounting, setIsMounting] = useState<boolean>(false);

  useEffect(() => {
    if (!formattedNumber) return

    setIsMounting(true)
    const mountingTimer = setTimeout(() => setIsMounting(false), 1000)

    return () => clearTimeout(mountingTimer)
  }, [formattedNumber])

  const { text: textColorClassName } = NOTI_COLOR_CLASSNAMES_DICT[status];

  return (
    <div
      className={`${className} flex items-center gap-x-2.5 ${textColorClassName}`}
    >
      {caption && <div className="Font_label_12px">{caption}</div>}
      
      <div className={`Font_data_12px_num ${isMounting || isLoading ? 'opacity-50' : ''}`}>{formattedNumber}</div>
      
      <PollingDot status={status}>
        <PollingSpinner status={status} isMounting={isMounting || isLoading} />
      </PollingDot>
    </div>
  )
}

export default Polling;






