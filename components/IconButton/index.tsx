import Icon, { IconType } from '@/components/Icon';
import { useMemo } from 'react';
import { Button } from 'react-aria-components';

type IconButtonProps = React.RefAttributes<HTMLButtonElement> &
  Readonly<{
    type?: 'button' | 'popover';
    iconType: IconType;
    label?: string;
    onClick?: () => void;
    className?: string;
  }>;

const IconButton = ({ type = 'button', iconType, label, className = '', onClick, ...props }: IconButtonProps) => {
  const commonProps = useMemo(
    () => ({
      className: `grow-0 shrink-0 w-fit h-fit flex items-center gap-x-2 p-3 bg-transparent rounded-full Transition_500 transition-colors hover:bg-white_o10 ${className}`,
      ...props,
    }),
    [props, className],
  );

  if (type === 'button') {
    return (
      <button type="button" onClick={onClick} {...commonProps}>
        <Icon type={iconType} />
        {label && <span className="Font_button_xs pr-1">{label}</span>}
      </button>
    );
  }

  return (
    <Button onPress={onClick} {...commonProps}>
      <Icon type={iconType} />
      {label && <span className="Font_button_xs pr-1">{label}</span>}
    </Button>
  );
};

export default IconButton;
