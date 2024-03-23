import { useMemo } from 'react';
import { type OverlayBackdropColor, SCREEN_BACKDROP_BG_CLASS_DICT } from './styles';

const useOverlayBackdropClassNames = (color: OverlayBackdropColor, isOpen?: boolean) => {
  const bgClassName = useMemo<string>(() => SCREEN_BACKDROP_BG_CLASS_DICT[color], [color]);
  const visibilityClassName = useMemo<string>(
    () => `${isOpen ? 'animate-fade_in z-top_context' : 'animate-fade_out hidden_on_top_context'}`,
    [isOpen]
  );

  return useMemo<string>(
    () => `Component fixed inset-0 ${bgClassName} ${visibilityClassName}`,
    [bgClassName, visibilityClassName]
  );
};

export default useOverlayBackdropClassNames;
