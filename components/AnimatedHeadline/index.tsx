import { useCallback, useEffect, useMemo, useState } from 'react';
import TextMask from './TextMask';

type HeadingTagName = 'h2' | 'h3' | 'h4' | 'h5';

const HEADLINE_FONT_SIZE_CLASS_DICT: Record<HeadingTagName, string> = {
  h2: 'Font_display_sm md:Font_display_md',
  h3: 'Font_title_md',
  h4: 'Font_title_sm',
  h5: 'Font_title_xs',
};

export type AnimatedHeadlineProps = {
  tagName: HeadingTagName;
  texts: readonly string[];
  className?: string;
  onAnimationEnd?: () => void;
};

const AnimatedHeadline = ({ tagName, texts, className = '', onAnimationEnd }: AnimatedHeadlineProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const scaleClassName = isVisible ? 'scale-x-100' : 'scale-x-0';

  const onItemAnimationEnd = useCallback(
    (index: number) => {
      if (index === texts.length - 1) onAnimationEnd?.();
    },
    [texts.length, onAnimationEnd]
  );

  const Texts = useMemo<readonly JSX.Element[]>(
    () =>
      texts.map((text, index) => {
        const scaleDelayMs = (index + 1) * 1000;
        const maskTranslateDelayMs = scaleDelayMs + 1000;

        return (
          <span
            key={text}
            className={`relative w-fit overflow-hidden Transition_1000 transition-transform origin-left ${scaleClassName}`}
            style={{ transitionDelay: `${scaleDelayMs}ms` }}
          >
            {text}

            <TextMask
              isOff={isVisible}
              translateDelayMs={maskTranslateDelayMs}
              onAnimationEnd={() => onItemAnimationEnd(index)}
            />
          </span>
        );
      }),
    [texts, isVisible, scaleClassName, onItemAnimationEnd]
  );

  const HeadingElement = tagName;
  const fontClassName = HEADLINE_FONT_SIZE_CLASS_DICT[tagName];

  return (
    <HeadingElement className={`Component flex flex-col items-start whitespace-pre text-black ${fontClassName} ${className}`}>
      {Texts}
    </HeadingElement>
  );
};

export default AnimatedHeadline;
