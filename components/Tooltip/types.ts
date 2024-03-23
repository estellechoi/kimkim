import type { Placement } from '@floating-ui/react';

export type TooltipOptions = {
  initialOpen?: boolean;
  placement?: Placement;
  followCursor?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
