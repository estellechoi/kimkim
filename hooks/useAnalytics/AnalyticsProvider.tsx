import { ElementType, PropsWithChildren, createContext, useCallback, useMemo } from 'react';
import type { Analytics } from '@/analytics/types';

export const AnalyticsContext = createContext<{
  sendEvent: Analytics['sendEvent'];
  identify: Analytics['identify'];
  resetUser: Analytics['resetUser'];
} | null>(null);

type AnalyticsProviderProps = PropsWithChildren<{
  items: readonly {
    analytics: Analytics;
    initializer: ElementType;
  }[];
}>;

const AnalyticsProvider = ({ children, items }: AnalyticsProviderProps) => {
  const Initializers = useMemo(() => {
    return items.map((item) => {
      const Initializer = item.initializer;
      return <Initializer key={item.analytics.name} analytics={item.analytics} />;
    });
  }, [items]);

  const sendEvent: Analytics['sendEvent'] = useCallback(
    (...args) => {
      items.forEach((item) => {
        item.analytics.sendEvent(...args);
      });
    },
    [items]
  );

  const identify: Analytics['identify'] = useCallback(
    (...args) => {
      items.forEach((item) => {
        item.analytics.identify(...args);
      });
    },
    [items]
  );

  const resetUser: Analytics['resetUser'] = useCallback(
    (...args) => {
      items.forEach((item) => {
        item.analytics.resetUser(...args);
      });
    },
    [items]
  );

  const context = useMemo(() => ({ sendEvent, identify, resetUser }), [sendEvent, identify, resetUser]);

  return (
    <AnalyticsContext.Provider value={context}>
      {Initializers}
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
