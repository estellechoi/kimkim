import Icon, { IconType } from '@/components/Icon';
import { useMemo } from 'react';
import { Button } from 'react-aria-components';

type IconButtonProps = React.RefAttributes<HTMLButtonElement> &
  Readonly<{
    type?: 'button' | 'popover';
    iconType: IconType;
    onClick?: () => void;
    className?: string;
  }>;

const IconButton = ({ type = 'button', iconType, className = '', onClick, ...props }: IconButtonProps) => {
  const commonProps = useMemo(
    () => ({
      className: `grow-0 shrink-0 w-fit h-fit p-3 bg-transparent rounded-full Transition_500 transition-colors hover:bg-white_o10 ${className}`,
      ...props,
    }),
    [props, className],
  );

  if (type === 'button') {
    return (
      <button type="button" onClick={onClick} {...commonProps}>
        <Icon type={iconType} />
      </button>
    );
  }

  return (
    <Button onPress={onClick} {...commonProps}>
      <Icon type={iconType} />
    </Button>
  );
};

export default IconButton;
