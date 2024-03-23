import { useMemo } from 'react';
import { TOOLTIP_Z_INDEX_CLASS_DICT, type TooltipLayer, type TooltipType } from './styles';

const ANIMATION_CLASS = 'animate-fade_in';
const WIDTH_CLASS = 'max-w-[100vw] md:max-w-[30vw]';
const COLOR_CLASS = 'bg-secondary text-ground';
const SHADOW_CLASS = 'Elevation_box_3';
const FONT_CLASS = 'Font_body_sm';
const RADIUS_CLASS = 'rounded-card_sm';

const PADDING_CLASS_DICT: Record<TooltipType, string> = {
  text: 'px-card_padding_x py-card_padding_y',
  any: '',
};

const useTooltipClassName = (type: TooltipType, layer: TooltipLayer) => {
  return useMemo(() => {
    const classNames: { [key: string]: string } = {
      animationClassName: ANIMATION_CLASS,
      gridClassName: WIDTH_CLASS,
      paddingClassName: PADDING_CLASS_DICT[type],
      colorClassName: COLOR_CLASS,
      shadowClassName: SHADOW_CLASS,
      fontClassName: FONT_CLASS,
      radiusClassName: RADIUS_CLASS,
      zIndexClassName: TOOLTIP_Z_INDEX_CLASS_DICT[layer],
    };

    return `Component ${Object.values(classNames).join(' ')}`;
  }, [type, layer]);
};

export default useTooltipClassName;
