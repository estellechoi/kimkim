import type { ReactNode } from 'react';

const BottomBar = ({ className = '', children }: { className?: string; children: ReactNode }) => {
  return <div className={`fixed bottom-0 inset-x-0 w-full bg-primary_bottom_to_top ${className}`}>{children}</div>;
};

export default BottomBar;
