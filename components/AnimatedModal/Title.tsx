import { ReactNode } from 'react';
import IconButton from '../IconButton';

const Title = ({ children, className = '', onClose }: { children: ReactNode; className?: string; onClose?: () => void }) => {
  return (
    <div className="relative flex justify-center md:justify-start items-center gap-x-10">
      <div className="absolute inset-y-0 left-4 w-fit flex items-center md:hidden">
        <IconButton iconType="arrow_back" onClick={onClose} />
      </div>
      <h3 className={`text-body Font_title_sm truncate ${className}`}>{children}</h3>
    </div>
  );
};

export default Title;
