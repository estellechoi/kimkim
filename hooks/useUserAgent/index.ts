import { userAgentAtom } from '@/store/states';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

const useUserAgent = () => {
  const [userAgent] = useAtom(userAgentAtom);

  return useMemo(
    () =>
      userAgent ?? {
        isMobile: false,
        isMobileOrTablet: false,
        isIOS: false,
        isNonIOSMobile: false,
      },
    [userAgent]
  );
};

export default useUserAgent;
