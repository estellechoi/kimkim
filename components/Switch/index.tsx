import { useCallback } from 'react';

export type SwitchSize = 'sm';

const SWITCH_ITEM_SIZE_CLASS_DICT: Record<SwitchSize, { padding: string }> = {
  sm: { padding: 'px-2 py-0' },
};

export type SwitchProps<T> = {
  size: SwitchSize;
  labels: readonly [T, T];
  selectedValue?: 0 | 1;
  onSwitch: (value: 0 | 1) => void;
  className?: string;
};

const Switch = <T extends string | JSX.Element>({
  size,
  labels,
  selectedValue = 0,
  onSwitch,
  className = '',
}: SwitchProps<T>) => {
  const gradientTransformClassName = `transition-transform Transition_500 ${
    selectedValue === 0 ? 'translate-x-0' : 'translate-x-full'
  }`;

  const itemSizeClassNames = SWITCH_ITEM_SIZE_CLASS_DICT[size];

  const getItemColorClassName = useCallback(
    (index: 0 | 1) => {
      const isSelected = selectedValue === index;
      return isSelected ? 'text-white' : 'text-caption hover:text-white';
    },
    [selectedValue]
  );

  return (
    <div
      className={`relative w-max inline-flex items-center justify-between border border-solid border-caption rounded-button ${className}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0.5 left-0.5 w-[calc(50%_-_0.125rem)] bg-primary_inverted_gradient_1 rounded-button ${gradientTransformClassName}`}
      ></span>

      {labels.map((label, index) => (
        <button
          type="button"
          key={index}
          className={`relative grow shrink basis-1/2 Font_caption_xs truncate ${getItemColorClassName(index as 0 | 1)} ${
            itemSizeClassNames.padding
          }`}
          onClick={() => onSwitch(index as 0 | 1)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Switch;
