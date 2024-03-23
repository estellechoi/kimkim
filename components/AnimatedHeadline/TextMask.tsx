import { CSSProperties, useMemo } from 'react';

type TextMaskProps = { translateDelayMs: number; isOff: boolean; onAnimationEnd?: () => void };

const TextMask = ({ translateDelayMs, isOff, onAnimationEnd }: TextMaskProps) => {
  const style = useMemo<CSSProperties>(() => ({ transitionDelay: `${translateDelayMs}ms` }), [translateDelayMs]);
  const maskTranslateClassName = isOff ? 'translate-x-full' : '0';

  return (
    <span
      aria-hidden
      className={`absolute inset-0 bg-black Transition_1000 transition-transform ${maskTranslateClassName}`}
      style={style}
      onTransitionEnd={onAnimationEnd}
    ></span>
  );
};

export default TextMask;
