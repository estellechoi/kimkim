import Image from 'next/image';
import Tag, { TagProps } from '@/components/Tag';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

type CheckItemProps = {
  imgURL?: string;
  label: string;
  checked?: boolean;
  onChange: (isChecked: boolean) => void;
  disabled?: boolean;
  trailingTag?: TagProps;
};

const CheckItem = ({ imgURL, label, checked = false, onChange, disabled, trailingTag }: CheckItemProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      // setIsChecked(newIsChecked);
      onChange?.(event.target.checked);
    },
    [onChange]
  );

  const opacityClassName = useMemo<string>(() => (disabled ? 'opacity-40' : ''), [disabled]);
  const hoverClassName = useMemo<string>(() => (disabled ? '' : 'hover:opacity-80'), [disabled]);
  const contentPointerEvents = useMemo<string>(() => (disabled ? 'pointer-events-none' : ''), [disabled]);

  const Content = (
    <span className={`flex items-center gap-x-1.5 px-1 py-1.5 ${contentPointerEvents}`}>
      {imgURL && <Image src={imgURL} alt={label} width={20} height={20} quality={100} className="overflow-hidden rounded-full" />}

      <span className="inline-flex items-center gap-x-1.5 Font_button_sm text-primary">
        {label}
        {trailingTag && <Tag {...trailingTag} />}
      </span>
    </span>
  );

  return (
    <div
      className={`group/check-item Component relative rounded-md bg-ground box-content px-1 Transition_500 transition-colors border-2 border-solid ${
        isChecked ? 'border-primary_variant_dark' : 'border-primary'
      } ${opacityClassName} ${hoverClassName}`}
    >
      {Content}
      <input
        type="checkbox"
        className="absolute inset-0 z-overlay opacity-0 cursor-pointer"
        disabled={disabled}
        checked={isChecked}
        onChange={handleChange}
      />
    </div>
  );
};

export default CheckItem;
