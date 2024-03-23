import { useCallback, type ReactNode, useMemo, useState } from 'react';
import Item from './Item';
import Button from '@/components/Button';
import getReactElements from '@/components/utils/getReactElements';

const getItems = (children: ReactNode) => getReactElements(children, Item);

type ContainerProps = { children: ReactNode; xUnitPx: number; isExpandable?: boolean; className?: string };

const Container = ({ children, xUnitPx, isExpandable = false, className = '' }: ContainerProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const onToggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const items = useMemo(() => getItems(children), [children]);
  const getItemStyle = useCallback(
    (index: number) => {
      const left = isExpanded ? 'auto' : `${xUnitPx * index}px`;
      const right = isExpanded ? `${xUnitPx * (items.length - 1 - index)}px` : 'auto';
      const zIndex = isExpanded ? index : items.length - 1 - index;

      return {
        left,
        right,
        zIndex,
      };
    },
    [items.length, xUnitPx, isExpanded]
  );

  const hoverTranslateClassName = `Transition_500 transition-transform ${
    isExpanded ? 'hover:-translate-x-1' : 'hover:translate-x-1'
  }`;

  const leftShadowOpacityClassName = `Transition_500 transition-all ${isExpanded ? 'opacity-100' : 'opacity-0'}`;

  return (
    <ul className={`Component relative w-full ${className}`}>
      {items.map((child, index) => (
        <li
          key={index}
          className={`${index > 0 ? 'absolute top-0' : 'relative'} w-fit ${hoverTranslateClassName}`}
          style={getItemStyle(index)}
        >
          {child}
        </li>
      ))}

      {isExpandable && (
        <span
          aria-hidden
          className={`absolute -inset-y-0.5 -left-1 z-[11] w-24 bg-primary_left_to_right ${leftShadowOpacityClassName}`}
        ></span>
      )}

      {isExpandable && (
        <span aria-hidden className={`absolute -inset-y-0.5 -right-1 z-[11] w-24 bg-primary_right_to_left`}></span>
      )}

      {isExpandable && (
        <Button
          label="View more"
          color="on_primary"
          type="outline"
          size="sm"
          iconType={isExpanded ? 'chevron_left' : 'chevron_right'}
          labelHidden
          className="absolute inset-y-0 right-0 z-[11]"
          onClick={onToggleExpand}
          aria-hidden
        />
      )}
    </ul>
  );
};

export default Container;
