import { ReactNode } from 'react';

type OptionProps = { children: ReactNode };

const Option = ({ children }: OptionProps) => {
  return <li>{children}</li>;
};

export default Option;
