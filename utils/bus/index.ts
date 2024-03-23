import { EventBusKeys } from './constants';

type EventCallback = (arg?: any) => void;

interface EventRegistry {
  unregister: () => void;
}

type Subscriber = {
  [key in EventBusKeys]?: EventCallback;
};

interface IEventBus {
  register(event: EventBusKeys, callback: () => void): EventRegistry | null;
  dispatch<T>(event: EventBusKeys, arg?: T): void;
}

class EventBus implements IEventBus {
  private subscriber: Subscriber;

  constructor() {
    this.subscriber = {};
  }

  public dispatch<T>(event: EventBusKeys, arg?: T) {
    const subscriber = this.subscriber[event];
    if (subscriber) {
      subscriber(arg);
    }
  }

  public register(event: EventBusKeys, callback: EventCallback): EventRegistry {
    this.subscriber[event] = callback;

    return {
      unregister: () => {
        delete this.subscriber[event];
      },
    };
  }
}

export default new EventBus();
