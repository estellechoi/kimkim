import { HTMLProps, ReactNode } from 'react';

const A = ({ children, ...props }: { children: ReactNode } & HTMLProps<HTMLAnchorElement>) => {
  const opacityClassName = 'transition-opacity hover:opacity-80';

  return (
    <a target="_blank" rel="noopener noreferrer" {...{ ...props, className: `${opacityClassName} ${props.className ?? ''}` }}>
      {children}
    </a>
  );
};

export default A;
