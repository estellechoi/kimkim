import type { EventCategory } from './constants';

export abstract class Analytics {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public abstract initialize(id: string, options?: any): void | Promise<void>;
  public abstract sendEvent(category: EventCategory, action: string, ...args: any[]): void;
  public abstract identify(userId: string): void;
  public abstract resetUser(): void;
  public abstract setChainId(chainId: number): void;
}

export type AnalyticsInitializerProps<T extends Analytics> = { analytics: T };
