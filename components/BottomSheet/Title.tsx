import { ReactNode } from 'react';

const Title = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <h3 className={`text-body Font_title_sm ${className}`}>{children}</h3>;
};

export default Title;
