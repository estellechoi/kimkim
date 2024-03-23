import { useContext } from 'react';
import { AnalyticsContext } from './AnalyticsProvider';

const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (context === null) throw new Error('useAnalytics must be used within a AnalyticsProvider');

  const { sendEvent, identify, resetUser } = context;

  return { sendEvent, identify, resetUser };
};

export default useAnalytics;
