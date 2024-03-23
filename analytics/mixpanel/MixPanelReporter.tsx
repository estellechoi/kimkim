'use client';

import { useCallback, useEffect } from 'react';
import Mixpanel from '@/analytics/mixpanel/Mixpanel';
import { isDevMode } from '../constants';
import type { AnalyticsInitializerProps } from '../types';

const MIXPANEL_TOKEN: string | undefined = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

const MixPanelReporter = ({ analytics: mixpanel }: AnalyticsInitializerProps<Mixpanel>) => {
  const initialize = useCallback(async () => {
    if (!MIXPANEL_TOKEN) return;

    await mixpanel.initialize(MIXPANEL_TOKEN, { debug: isDevMode, track_pageview: true, persistence: 'localStorage' });
  }, [mixpanel]);

  useEffect(() => {
    initialize();
  }, []);

  return null;
};

export default MixPanelReporter;
