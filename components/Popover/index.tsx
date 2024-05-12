import Container from './Container';
import PopoverContent from './PopoverContent';
import PopoverTrigger from './PopoverTrigger';

const Popover = Object.assign(Container, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export default Popover;
