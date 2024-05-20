import { Children, type ReactNode, isValidElement, ReactElement } from 'react';

const getReactElements = (children: ReactNode | undefined, element: (props: any) => JSX.Element): readonly ReactElement[] => {
  const childrenArray = Children.toArray(children);
  return childrenArray.filter((child): child is ReactElement => isValidElement(child) && child.type === element);
};

export default getReactElements;
