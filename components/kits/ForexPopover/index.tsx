import Popover from '@/components/Popover';
import ForexPlayGround from '@/components/kits/ForexPlayGround';
import { useState } from 'react';
import IconButton from '@/components/IconButton';

type ForexPopoverProps = Readonly<{ id: string; className?: string }>;

const ForexPopover = ({ id, className = '' }: ForexPopoverProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover className={className}>
      <Popover.Trigger>
        <IconButton
          type="popover"
          iconType="currency_exchange"
          className="text-caption"
          aria-expanded={isOpen}
          aria-controls={id}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Popover.Trigger>
      <Popover.Content id={id} isOpen={isOpen} onOpenChange={setIsOpen} className="px-4 py-9 md:py-8">
        <ForexPlayGround />
      </Popover.Content>
    </Popover>
  );
};

export default ForexPopover;
