import { Button, Key, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import Icon from '@/components/Icon';

type DropDownProps<T extends Key> = {
    options: readonly { label: string | JSX.Element; key: T; }[];
    disabledKeys?: readonly T[];
    defaultKey?: T;
    placeholder: string;
    onChange?: (key: T) => void;
    className?: string;
}

const DropDown = <T extends Key>({ options, disabledKeys, defaultKey, placeholder, onChange, className = '' }: DropDownProps<T>) => {
    return (
        <Select disabledKeys={disabledKeys} defaultSelectedKey={defaultKey} placeholder={placeholder} className={`Component flex flex-col items-end ${className}`} onSelectionChange={(key) => onChange?.(key as T)}>
            {({ isOpen }) => (
                <>
                    <Button className="group/select-button w-32 flex items-center justify-between gap-x-4 Font_button_sm bg-body text-ground rounded-card_sm px-card_padding_x py-card_padding_y">
                        <SelectValue title={placeholder} defaultValue={defaultKey} className="transition-transform Transition_500 group-enabled/select-button:group-hover/select-button:translate-x-0.5" />
                        <Icon type={isOpen ? 'expand_less' : 'expand_more'} />
                    </Button>

                    <Popover 
                        placement="bottom right"
                        className="w-32 Font_label_14px bg-body text-ground rounded-card_sm px-card_padding_x py-2.5"
                    >
                        <ListBox className="space-y-0">
                            {options.map(option => (
                                <ListBoxItem 
                                    key={option.key}
                                    id={option.key}
                                    className={`w-full truncate py-2.5 ${disabledKeys?.includes(option.key) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer Transition_500 transition-transform hover:translate-x-0.5'}`}
                                >
                                    {option.label}
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
  