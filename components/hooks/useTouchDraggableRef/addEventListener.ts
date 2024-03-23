import type { EventHandler } from 'react';

const addEventListener = (target: HTMLElement, event: string, handler: EventHandler<any>, options?: EventListenerOptions) => {
  target.addEventListener(event, handler, options);
  return () => {
    target.removeEventListener(event, handler, options);
  };
};

export default addEventListener;
