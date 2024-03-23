import { type RefObject, useCallback, useState } from 'react';
import useTouchDraggableRef from '@/components/hooks/useTouchDraggableRef';

const useBottomSheetTouchDrag = ({ onDragEnd }: { onDragEnd: () => void }) => {
  const [dismissingDragY] = useState<number | undefined>(() => (window?.innerHeight ? window.innerHeight * 0.36 : undefined));

  const [isDragged, setIsDragged] = useState<boolean>(false);
  const onDragged = useCallback(
    async (ref: RefObject<HTMLDivElement>) => {
      return new Promise<void>((resolve) => {
        setIsDragged(true);
        ref.current?.style.setProperty('transform', `translate(0, 140%)`);
        onDragEnd();
        resolve();
      });
    },
    [onDragEnd]
  );

  const ref = useTouchDraggableRef<HTMLDivElement>({
    y: {
      enabled: true,
      scope: [0, Infinity],
      moveThreshold: dismissingDragY,
      onDragged,
    },
  });

  return {
    ref,
    isDragged,
  };
};

export default useBottomSheetTouchDrag;
