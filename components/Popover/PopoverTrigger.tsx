import { ReactNode } from 'react';

const PopoverTrigger = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

export default PopoverTrigger;
