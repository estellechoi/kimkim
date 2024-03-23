import { useMemo } from 'react';
import type { MeshProps, Size, Viewport } from '@react-three/fiber';

const usePlaneMeshScale = (size: Size, viewport: Viewport) => {
  return useMemo<MeshProps['scale']>(() => {
    const width = size.width / viewport.factor;
    const height = size.height / viewport.factor;
    return [width, height, 1];
  }, [size.width, size.height, viewport.factor]);
};

export default usePlaneMeshScale;
