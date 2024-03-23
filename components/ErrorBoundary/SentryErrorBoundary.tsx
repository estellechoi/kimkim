/** @memo wip */
import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from '@sentry/nextjs';
import { EventCategory } from '@/analytics/constants';
import { googleAnalytics, mixpanel } from '@/constants/app';
import type { ErrorBoundaryProps } from './types';

const SentryErrorBoundary = ({ children, fallbackComponent, onReset }: { children: ReactNode } & ErrorBoundaryProps) => {
  useEffect(() => {
    [googleAnalytics, mixpanel].forEach((analytics) => {
      analytics.sendEvent(EventCategory.ERROR_BOUNDARY, 'Error Boundary Mounted');
    });
  }, []);

  /**
   *
   * @description this is to follow typescript rule for react component to be in upper case
   */
  const FallbackComponent = fallbackComponent;

  return (
    <ErrorBoundary
      beforeCapture={(scope) => {
        scope.setLevel('fatal');
      }}
      fallback={({ eventId }) => {
        return (
          <FallbackComponent
            error={eventId}
            resetErrorBoundary={() => {
              onReset?.();
            }}
          />
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SentryErrorBoundary;
