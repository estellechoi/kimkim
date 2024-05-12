import { ReactNode } from 'react';
import { Popover } from 'react-aria-components';

export interface PopoverContentProps {
  children: ReactNode;
  id: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  className?: string;
}

const PopoverContent = ({ children, id, isOpen, onOpenChange, className = '' }: PopoverContentProps) => {
  return (
    <Popover
      aria-id={id}
      placement="bottom right"
      offset={16}
      className={`w-fit max-w-[94vw] min-w-36 text-body bg-black rounded-card_sm Elevation_3 ${className}`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}>
      {children}
    </Popover>
  );
};

export default PopoverContent;
