import ReactGA from 'react-ga4';
import type { GaOptions, UaEventOptions } from 'react-ga4/types/ga4';
import { EventCategory } from '@/analytics/constants';
import { Analytics } from '../types';

export default class GoogleAnalytics extends Analytics {
  public track(callback: (tracker?: any) => void) {
    ReactGA.ga(callback);
  }

  public initialize(
    measurementId: string,
    options?: {
      legacyDimensionMetric?: boolean;
      nonce?: string;
      testMode?: boolean;
      gaOptions?: GaOptions | any;
      gtagOptions?: any;
    }
  ): void {
    ReactGA.initialize(measurementId, options);
  }

  public set(fieldsObject: any) {
    if (!ReactGA.isInitialized) return;
    ReactGA.set(fieldsObject);
  }

  public sendEvent(
    category: EventCategory,
    action: string,
    event?: Omit<UaEventOptions, 'category' | 'action'>,
    params?: any
  ): void {
    if (!ReactGA.isInitialized) return;

    ReactGA.event({ category, action, ...event }, params);
  }

  public pageview(path: string, title?: string): void {
    if (!ReactGA.isInitialized) return;

    ReactGA.send({ hitType: 'pageview', page: path, title });
    this.sendEvent(EventCategory.PAGE_VIEW, path);
  }

  /**
   *
   * @see https://developers.google.com/analytics/devguides/collection/ga4/user-id?hl=ko&client_type=gtag
   * each user ID must be fewer than 256 characters long. (SHA256)
   */
  public identify(userId: string): void {
    if (!ReactGA.isInitialized) return;

    ReactGA.gtag('config', ReactGA._currentMeasurementId, { user_id: userId });
  }

  public resetUser(): void {
    if (!ReactGA.isInitialized) return;

    ReactGA.gtag('config', ReactGA._currentMeasurementId, { user_id: undefined });
  }

  /**
   *
   * @description cd1 stands for custom dimension 1, which is chainId here
   */
  public setChainId(chainId: number): void {
    this.set({ cd1: chainId });
  }
}
