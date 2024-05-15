import { ReactNode, useMemo, useState } from 'react';
import Icon, { IconType } from '@/components/Icon';
import { Button } from 'react-aria-components';
import { NotiStatus } from '@/types/noti';
import { NOTI_COLOR_CLASSNAMES_DICT } from '@/components/styles';

type AlertBoxProps = Readonly<{
  status: NotiStatus;
  text: string;
  className?: string;
  detail?: ReactNode;
}>;

const STATUS_ICON_DICT: Record<NotiStatus, IconType> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
  neutral: 'info',
};

const AlertBox = ({ status, text, className = '', detail }: AlertBoxProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const { iconType, textClassName, backgroundClassName } = useMemo(
    () => ({
      iconType: STATUS_ICON_DICT[status],
      textClassName: NOTI_COLOR_CLASSNAMES_DICT[status].text,
      backgroundClassName: NOTI_COLOR_CLASSNAMES_DICT[status].groundBackground,
    }),
    [status],
  );

  return (
    <Button isDisabled={!detail} onPress={() => setIsDetailOpen(!isDetailOpen)}>
      <div
        className={`flex flex-col items-stretch gap-y-3 p-3 rounded-card_sm ${backgroundClassName} ${textClassName} ${className}`}>
        <div className="flex items-start justify-between gap-x-3 px-2">
          <div className="flex items-start gap-x-3 pr-3">
            <div className="w-min h-[1.175rem] flex items-center">
              <Icon type={iconType} size="md" className="mr-2" />
            </div>

            <div className="text-left Font_caption_xs">{text}</div>
          </div>

          {detail && <Icon type={isDetailOpen ? 'expand_less' : 'expand_more'} />}
        </div>

        {detail && isDetailOpen && (
          <div className="text-left Font_caption_xs text-caption bg-ground p-4 rounded-card_xs break-all">{detail}</div>
        )}
      </div>
    </Button>
  );
};

export default AlertBox;
