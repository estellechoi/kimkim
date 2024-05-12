import getReactElements from '@/components/utils/getReactElements';
import { ReactNode } from 'react';
import { DialogTrigger } from 'react-aria-components';
import PopoverTrigger from './PopoverTrigger';
import PopoverContent from './PopoverContent';

const getPopoverTrigger = (children: ReactNode | undefined) => getReactElements(children, PopoverTrigger);
const getPopoverContent = (children: ReactNode | undefined) => getReactElements(children, PopoverContent);

export interface PopoverProps {
  children: ReactNode;
  className?: string;
}

const Popover = ({ children, className = '' }: PopoverProps) => {
  return (
    <div className={className}>
      <DialogTrigger>
        {getPopoverTrigger(children)}
        {getPopoverContent(children)}
      </DialogTrigger>
    </div>
  );
};

export default Popover;
