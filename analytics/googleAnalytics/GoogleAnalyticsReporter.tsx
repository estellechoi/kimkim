'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isDevMode } from '../constants';
import GoogleAnalytics from '@/analytics/googleAnalytics/GoogleAnalytics';
import { AnalyticsInitializerProps } from '../types';

const LOCAL_STORAGE_KEYS = {
  GOOGLE_ANALYTICS_CLIENT_ID: 'ga_client_id',
};

const GOOGLE_ANALYTICS_MEASUREMENT_ID: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEAUSUREMENT_ID;

const GoogleAnalyticsReporter = ({ analytics: googleAnalytics }: AnalyticsInitializerProps<GoogleAnalytics>) => {
  // initialize
  useEffect(() => {
    if (!GOOGLE_ANALYTICS_MEASUREMENT_ID) {
      googleAnalytics.initialize('test', {
        testMode: true,
        gtagOptions: { debug_mode: true },
      });
      return;
    }

    const storedClientId = window.localStorage.getItem(LOCAL_STORAGE_KEYS.GOOGLE_ANALYTICS_CLIENT_ID) ?? undefined;

    googleAnalytics.initialize(GOOGLE_ANALYTICS_MEASUREMENT_ID, {
      testMode: isDevMode,
      gaOptions: {
        storage: 'none',
        storeGac: false,
        clientId: storedClientId,
      },
      gtagOptions: { debug_mode: isDevMode },
    });

    googleAnalytics.set({
      anonymizeIp: true,
    });
  }, []);

  // set client id
  useEffect(() => {
    googleAnalytics.track((tracker: any) => {
      if (!tracker) return;

      const clientId = tracker.get('clientId');
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.GOOGLE_ANALYTICS_CLIENT_ID, clientId);
    });
  }, []);

  // report pageview
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // console.log('searchParams', searchParams);
    if (pathname) googleAnalytics.pageview(`${pathname}`);
  }, [pathname, searchParams]);

  return null;
};

export default GoogleAnalyticsReporter;
