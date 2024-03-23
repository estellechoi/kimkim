import { useCallback, useMemo, useState } from 'react';

const useMouseEffect = (active = false) => {
  const MOUSE_DEFAULT_X = 0;
  const MOUSE_DEFAULT_Y = 0;

  const [mouseX, setMouseX] = useState<number>(MOUSE_DEFAULT_X);
  const [mouseY, setMouseY] = useState<number>(MOUSE_DEFAULT_Y);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (active) {
        const x =
          ((event.clientX - event.currentTarget.getBoundingClientRect().x) / event.currentTarget.getBoundingClientRect().width) *
          100;
        const y =
          ((event.clientY - event.currentTarget.getBoundingClientRect().y) / event.currentTarget.getBoundingClientRect().height) *
          100;
        setMouseX(x);
        setMouseY(y);
      }
    },
    [active]
  );

  const onMouseLeave = useCallback(() => {
    setMouseX(MOUSE_DEFAULT_X);
    setMouseY(MOUSE_DEFAULT_Y);
  }, []);

  const style = useMemo<React.CSSProperties | undefined>(
    () =>
      mouseX === MOUSE_DEFAULT_X && mouseY === MOUSE_DEFAULT_Y
        ? undefined
        : {
            backgroundSize: '200% 200%',
            backgroundImage:
              // 'linear-gradient(89.94deg, rgba(255, 199, 127, 0) 43.24%, rgba(255, 199, 127, 0.15) 52.09%, rgba(255, 199, 127, 0) 60.93%)',
              'linear-gradient(89.94deg, rgba(255, 255, 255, 0) 43.24%, rgba(255, 255, 255, 0.6) 52.09%, rgba(255, 255, 255, 0) 60.93%)',
            backgroundPosition: `calc((100 - ${mouseX.toFixed(2)}) * 1%) calc((100 - ${mouseY.toFixed(2)}) * 1%)`,
          },
    [mouseX, mouseY]
  );

  return {
    style,
    onMouseMove,
    onMouseLeave,
  };
};

export default useMouseEffect;
