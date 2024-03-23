export type TooltipType = 'text' | 'any';
export type TooltipLayer = 'base' | 'overlay' | 'navigation' | 'top_context';

// export const TOOLTIP_Z_INDEX_CLASS_DICT: Record<TooltipLayer, { on: string; off: string }> = {
//   base: { on: 'z-tooltip_on_base', off: 'z-tooltip_hidden_on_base' },
//   overlay: { on: 'z-tooltip_on_overlay', off: 'z-tooltip_hidden_on_overlay' },
//   navigation: { on: 'z-tooltip_on_navigation', off: 'z-tooltip_hidden_on_navigation' },
//   top_context: { on: 'z-tooltip_on_top_context', off: 'z-tooltip_hidden_on_top_context' },
// };

export const TOOLTIP_Z_INDEX_CLASS_DICT: Record<TooltipLayer, string> = {
  base: 'z-tooltip_on_base',
  overlay: 'z-tooltip_on_overlay',
  navigation: 'z-tooltip_on_navigation',
  top_context: 'z-tooltip_on_top_context',
};
