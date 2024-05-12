import { Button, Key, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import Icon from '@/components/Icon';

type DropDownSize = 'sm' | 'md';

const DROP_DOWN_SIZE_CLASSNAMES_DICT: Record<DropDownSize, { px: string; py: string; font: string }> = {
  sm: { px: 'px-2', py: 'py-1.5', font: 'Font_label_12px' },
  md: { px: 'px-card_padding_x', py: 'py-2.5', font: 'Font_label_14px' },
};

type DropDownProps<T extends Key> = {
  options: readonly { label: string | JSX.Element; key: T }[];
  disabledKeys?: readonly T[];
  defaultKey?: T;
  placeholder: string;
  onChange?: (key: T) => void;
  size?: DropDownSize;
  className?: string;
};

const DropDown = <T extends Key>({
  options,
  disabledKeys,
  defaultKey,
  placeholder,
  onChange,
  size = 'md',
  className = '',
}: DropDownProps<T>) => {
  const { px: pxClassName, py: pyClassName, font: fontClassName } = DROP_DOWN_SIZE_CLASSNAMES_DICT[size];

  return (
    <Select
      aria-label={placeholder}
      disabledKeys={disabledKeys}
      defaultSelectedKey={defaultKey}
      placeholder={placeholder}
      className={`Component flex flex-col ${className}`}
      onSelectionChange={(key) => onChange?.(key as T)}>
      {({ isOpen }) => (
        <>
          <Button
            className={`group/select-button min-w-36 flex items-center justify-between gap-x-4 ${fontClassName} bg-body text-ground rounded-button ${pxClassName} ${pyClassName}`}>
            <SelectValue
              title={placeholder}
              defaultValue={defaultKey}
              className="transition-transform Transition_500 group-enabled/select-button:group-hover/select-button:translate-x-0.5"
            />
            <Icon type={isOpen ? 'expand_less' : 'expand_more'} />
          </Button>

          <Popover
            placement="bottom right"
            className={`min-w-36 ${fontClassName} bg-body text-ground rounded-card_sm ${pxClassName} ${pyClassName}`}>
            <ListBox className="w-full space-y-0">
              {options.map((option) => (
                <ListBoxItem
                  key={option.key}
                  id={option.key}
                  className={`flex items-center justify-between gap-x-4 w-full truncate ${pyClassName} ${disabledKeys?.includes(option.key) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer Transition_500 transition-transform hover:translate-x-0.5'}`}>
                  {option.label}
                  <div aria-hidden className="w-4 opacity-0"></div>
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </>
      )}
    </Select>
  );
};

export default DropDown;
