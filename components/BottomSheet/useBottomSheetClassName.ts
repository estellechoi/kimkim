import { useEffect, useMemo, useState } from 'react';
import { BOTTOM_SHEET_CLASSES } from './styles';

const useBottomSheetClassName = (isOpen: boolean) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const staticClassName = useMemo<string>(() => Object.values(BOTTOM_SHEET_CLASSES).join(' '), []);
  const animateClassName = useMemo<string>(
    () => `transition-transform Transition_momentum ${isInitialized && isOpen ? 'translate-y-0' : 'translate-y-[140%]'}`,
    [isInitialized, isOpen]
  );

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return useMemo<string>(() => `Component ${staticClassName} ${animateClassName}`, [staticClassName, animateClassName]);
};

export default useBottomSheetClassName;
