import { useMemo } from 'react';
import { Placement } from '@floating-ui/react';
import TooltipContent from './TooltipContent';
import TooltipProvider from './TooltipProvider';
import TooltipTrigger from './TooltipTrigger';
import useTooltipClassName from './useTooltipClassName';
import type { TooltipLayer, TooltipType } from './styles';

type TooltipProps = {
  children: React.ReactNode;
  layer: TooltipLayer;
  type?: TooltipType;
  content?: React.ReactNode;
  placement?: Placement;
  followCursor?: boolean;
};

/**
 *
 * @see https://floating-ui.com/docs/react
 */
const Tooltip = ({ children, layer, type = 'text', content, placement, followCursor = false }: TooltipProps) => {
  const tooltipTriggerClassName = useMemo(() => {
    const cursorClassName = !!content ? 'cursor-help' : 'cursor-default';

    return cursorClassName;
  }, [content]);

  const className = useTooltipClassName(type, layer);

  const options = { placement, followCursor };

  return content ? (
    <TooltipProvider {...options}>
      <TooltipTrigger className={tooltipTriggerClassName}>{children}</TooltipTrigger>
      <TooltipContent className={className}>{content}</TooltipContent>
    </TooltipProvider>
  ) : (
    <>{children}</>
  );
};

export default Tooltip;
