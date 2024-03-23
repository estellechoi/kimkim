import { Children, type ReactNode, isValidElement } from 'react';

const getReactElements = (children: ReactNode | undefined, element: (props: any) => JSX.Element) => {
  const childrenArray = Children.toArray(children);
  return childrenArray.filter((child) => isValidElement(child) && child.type === element);
};

export default getReactElements;
