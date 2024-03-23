import { useCallback, type RefObject, useRef, useEffect, TouchEventHandler, useState } from 'react';
import addEventListener from './addEventListener';

type TouchDragOptions<T> = {
  moveThreshold?: number;
  enabled?: boolean;
  scope?: readonly [number, number];
  onDragged?: (ref: RefObject<T>, delta: number) => Promise<void>;
};

type UseTouchDraggableRefOptions<T> = {
  x?: TouchDragOptions<T>;
  y?: TouchDragOptions<T>;
};

const useTouchDraggableRef = <T extends HTMLElement>(options?: UseTouchDraggableRefOptions<T>) => {
  const ref = useRef<T>(null);

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const resetTouchStates = useCallback(() => {
    setTouchStart(null);

    const timer = setTimeout(() => {
      ref?.current?.style.setProperty('transform', null);
      ref?.current?.style.setProperty('transition', null);
      ref?.current?.classList.remove('will-change-transform');
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleTouchStart: TouchEventHandler<T> = useCallback((event) => {
    const { clientX: x, clientY: y } = event.touches[0];
    setTouchStart({ x, y });

    ref?.current?.classList.add('will-change-transform');
    ref?.current?.style.setProperty('transition', 'none', 'important');
  }, []);

  const handleTouchMove: TouchEventHandler<T> = useCallback(
    (event) => {
      if (!touchStart) return;

      const { clientX, clientY } = event.touches[0];
      const delta = { x: clientX - touchStart.x, y: clientY - touchStart.y };

      const enabledDeltaX = options?.x?.enabled ? delta.x : 0;
      const enabledDeltaY = options?.y?.enabled ? delta.y : 0;

      const moveX = options?.x?.scope ? Math.max(options.x.scope[0], Math.min(options.x.scope[1], enabledDeltaX)) : enabledDeltaX;
      const moveY = options?.y?.scope ? Math.max(options.y.scope[0], Math.min(options.y.scope[1], enabledDeltaY)) : enabledDeltaY;

      ref?.current?.style.setProperty('transform', `translate(${moveX}px, ${moveY}px)`, 'important');
    },
    [touchStart, options]
  );

  const handleTouchEnd: TouchEventHandler<T> = useCallback(
    async (event) => {
      if (!touchStart) return;

      const { clientX, clientY } = event.changedTouches[0];
      const delta = { x: clientX - touchStart.x, y: clientY - touchStart.y };

      ref?.current?.style.setProperty('transition', 'transform 0.5s cubic-bezier(.19,1,.22,1)', 'important');

      const isMoved = {
        x: !!options?.x?.moveThreshold && Math.abs(delta.x) > options.x.moveThreshold,
        y: !!options?.y?.moveThreshold && Math.abs(delta.y) > options.y.moveThreshold,
      };

      if (!isMoved.x && !isMoved.y) {
        ref?.current?.style.setProperty('transform', 'translate(0, 0)', 'important');
        resetTouchStates();
      }

      if (isMoved.x) {
        await options?.x?.onDragged?.(ref, delta.x);
        resetTouchStates();
      }

      if (isMoved.y) {
        await options?.y?.onDragged?.(ref, delta.y);
        resetTouchStates();
      }
    },
    [resetTouchStates, touchStart, options]
  );

  useEffect(() => {
    if (!ref.current) return;

    addEventListener(ref.current, 'touchstart', handleTouchStart);
    addEventListener(ref.current, 'touchmove', handleTouchMove);
    addEventListener(ref.current, 'touchend', handleTouchEnd);
  }, [ref, handleTouchMove, handleTouchStart, handleTouchEnd]);

  return ref;
};

export default useTouchDraggableRef;
