import { type ReactNode } from 'react';
import Option from './Option';
import getReactElements from '@/components/utils/getReactElements';

const getOptions = (children: ReactNode) => getReactElements(children, Option);

const Container = ({ children, className = '' }: { className?: string; children: ReactNode }) => {
  return <ul className={`flex flex-col items-start gap-1 ${className}`}>{getOptions(children)}</ul>;
};

export default Container;
