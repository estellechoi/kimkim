import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Collection, Key, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';

type TabSelectorType = 'fill' | 'text';

const TAB_SELECTOR_BACKGROUND_CLASSNAMES_DICT: Record<TabSelectorType, string> = {
  fill: 'bg-ground',
  text: 'bg-transparent',
};

type TabSelectorProps<T extends Key> = Readonly<{
  type?: TabSelectorType;
  label: string;
  tabs: readonly { key: T; title: ReactNode; content?: ReactNode }[];
  selectedKey: T;
  disabledKeys?: readonly T[];
  isAllDisabled?: boolean;
  className?: string;
  onChange?: (key: T) => void;
}>;

const TabSelector = <T extends Key>({
  type = 'fill',
  label,
  tabs,
  selectedKey,
  disabledKeys,
  isAllDisabled = false,
  className = '',
  onChange,
}: TabSelectorProps<T>) => {
  const [activeKey, setActiveKey] = useState<T>(selectedKey);

  const onSelectionChange = useCallback(
    (key: Key) => {
      setActiveKey(key as T);
      onChange?.(key as T);
    },
    [onChange],
  );

  const backgroundClassName = useMemo(() => TAB_SELECTOR_BACKGROUND_CLASSNAMES_DICT[type], [type]);

  const getColorClassName = useCallback(
    (isSelected: boolean, isDisabled: boolean): string => {
      if (isDisabled) {
        return isSelected ? 'bg-disabled text-caption' : 'bg-transparent text-disabled';
      }

      if (isSelected) {
        return type === 'fill' ? 'bg-body text-ground' : 'text-body';
      }

      return 'bg-transparent text-caption';
    },
    [type],
  );

  const getCursorClassName = useCallback((isDisabled: boolean): string => {
    return isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
  }, []);

  const getHoverClassName = useCallback((isDisabled: boolean): string => {
    return isDisabled ? '' : 'Transition_500 transition-opacity hover:opacity-60';
  }, []);

  return (
    <Tabs
      isDisabled={isAllDisabled}
      disabledKeys={disabledKeys}
      selectedKey={activeKey}
      defaultSelectedKey={activeKey}
      onSelectionChange={onSelectionChange}
      className={`flex flex-col gap-y-2 Elevation_3 ${className}`}>
      <TabList
        aria-label={label}
        className={`flex items-stretch justify-stretch gap-x-2 p-1 rounded-full overflow-auto ${backgroundClassName}`}
        items={tabs}>
        {({ key, title }) => (
          <Tab
            key={key}
            className={({ isSelected, isDisabled }) =>
              `grow shrink basis-full flex items-center justify-center px-2 py-1.5 rounded-full Font_button_xs ${getColorClassName(isSelected, isDisabled)} ${getHoverClassName(isDisabled)} ${getCursorClassName(isDisabled)}`
            }>
            {title}
          </Tab>
        )}
      </TabList>
      <Collection items={tabs}>{(item) => <TabPanel>{item.content}</TabPanel>}</Collection>
    </Tabs>
  );
};

export default TabSelector;
