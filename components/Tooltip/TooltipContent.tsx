import { type ForwardRefRenderFunction, type HTMLProps, forwardRef } from 'react';
import { FloatingPortal, useMergeRefs } from '@floating-ui/react';
import { useTooltipContext } from './TooltipProvider';

const TooltipContentForwarder: ForwardRefRenderFunction<HTMLDivElement, HTMLProps<HTMLDivElement>> = (
  { style, ...props },
  propRef
) => {
  const context = useTooltipContext();

  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  );
};

const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(TooltipContentForwarder);

export default TooltipContent;
