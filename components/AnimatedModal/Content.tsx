import type { ReactNode } from 'react';

const Content = ({ isOpen, className = '', children }: { isOpen: boolean; className?: string; children: ReactNode }) => {
  const contentOpacityClassName = isOpen ? 'animate-fade_in_x delay-400' : 'animate-fade_out delay-400';

  return (
    <div
      className={`w-full h-full pb-modal_padding_y overflow-auto scroll-smooth text-body ${contentOpacityClassName} ${className}`}>
      {children}
    </div>
  );
};

export default Content;
