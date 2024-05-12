import Icon from '@/components/Icon';
import Popover from '@/components/Popover';
import { Button } from 'react-aria-components';
import ForexPlayGround from '@/components/kits/ForexPlayGround';
import { useState } from 'react';

type ForexPopoverProps = Readonly<{ id: string }>;

const ForexPopover = ({ id }: ForexPopoverProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover>
      <Popover.Trigger>
        <Button
          type="button"
          className="Transition_500 transition-opacity hover:opacity-80"
          aria-expanded={isOpen}
          aria-controls={id}
          onPress={() => setIsOpen(!isOpen)}>
          <Icon type="currency_exchange" className="text-body" />
        </Button>
      </Popover.Trigger>
      <Popover.Content id={id} isOpen={isOpen} onOpenChange={setIsOpen} className="px-4 py-6">
        <ForexPlayGround />
      </Popover.Content>
    </Popover>
  );
};

export default ForexPopover;
