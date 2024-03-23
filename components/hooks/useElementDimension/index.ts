import { useCallback, useEffect, useState } from 'react';

export type ElementDimension = {
  width: number;
  height: number;
  aspect: number;
};

const useElementDimension = (element: HTMLElement | null | undefined, injectedSize?: { width: number; height: number }) => {
  const [dimension, setDimension] = useState<ElementDimension>();

  const updateDimension = useCallback(() => {
    if (!element) return;

    const aspect = injectedSize ? injectedSize.width / injectedSize.height : element.clientWidth / element.clientHeight;
    const width = element.clientWidth;
    const height = width / aspect;

    setDimension({ width, height, aspect });
    setDimension({ width, height, aspect });
  }, [element, injectedSize]);

  useEffect(() => {
    updateDimension();

    window.addEventListener('resize', updateDimension);
    return () => window.removeEventListener('resize', updateDimension);
  }, [updateDimension]);

  return dimension;
};

export default useElementDimension;
