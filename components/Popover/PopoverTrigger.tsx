import { ReactNode } from 'react';

const PopoverTrigger = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`w-fit ${className}`}>{children}</div>;
};

export default PopoverTrigger;
