import { ReactNode, createContext, useContext } from 'react';
import useTooltip from './useTooltip';
import type { TooltipOptions } from './types';

export type TooltipContextType = ReturnType<typeof useTooltip> | null;

export const TooltipContext = createContext<TooltipContextType>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be used within each TooltipProvider');
  }

  return context;
};

/**
 *
 * @description can accept any props as options, e.g. `placement`,
 * or other positioning options.
 */
const TooltipProvider = ({ children, ...options }: { children: ReactNode } & TooltipOptions) => {
  const tooltip = useTooltip(options);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
};

export default TooltipProvider;
