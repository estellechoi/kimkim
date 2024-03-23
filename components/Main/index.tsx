import { ReactNode } from 'react';

const Main = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <main role="main" className={className}>
      {children}
    </main>
  );
};

export default Main;
