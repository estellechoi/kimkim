import type { ReactNode } from 'react';

const Content = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={`w-full text-body ${className}`}>{children}</div>;
};

export default Content;
