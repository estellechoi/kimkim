import Image from 'next/image';
import WaitingSymbol from '@/components/WaitingSymbol';
import Tag, { TagProps } from '@/components/Tag';
import { useMemo } from 'react';

type OptionItemProps = {
  imgURL: string;
  label: string;
  onClick: () => void;
  isProcessing?: boolean;
  disabled?: boolean;
  trailingTag?: TagProps;
};

const OptionItem = ({ imgURL, label, onClick, isProcessing = false, disabled, trailingTag }: OptionItemProps) => {
  const cursorClassName = useMemo<string>(() => (disabled ? 'cursor-not-allowed' : 'cursor-pointer'), [disabled]);
  const opacityClassName = useMemo<string>(() => (disabled ? 'opacity-40' : ''), [disabled]);
  const contentPointerEvents = useMemo<string>(() => (disabled ? 'pointer-events-none' : ''), [disabled]);

  const Content = (
    <span className={`group/option-item flex items-center gap-x-1.5 px-1 py-1.5 ${contentPointerEvents}`}>
      <Image src={imgURL} alt={label} width={28} height={28} quality={100} />

      {isProcessing ? (
        <WaitingSymbol />
      ) : (
        <span className="inline-flex items-center gap-x-1.5 Transition_500 transition-transform group-hover/option-item:translate-x-0.5 Font_button_lg text-white">
          {label}
          {trailingTag && <Tag {...trailingTag} />}
        </span>
      )}
    </span>
  );

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`Component ${cursorClassName} ${opacityClassName}`}>
      {Content}
    </button>
  );
};

export default OptionItem;
