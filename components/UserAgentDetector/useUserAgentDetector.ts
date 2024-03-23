import { useMemo, useState } from 'react';
import UAParser from 'ua-parser-js';

const useUserAgentDetector = () => {
  const [parser] = useState<UAParser.UAParserInstance>(() => new UAParser(window.navigator.userAgent));

  const { os, device } = useMemo(() => {
    return {
      device: parser.getDevice(),
      os: parser.getOS(),
    };
  }, [parser]);

  const isMobile = useMemo<boolean>(() => device.type === 'mobile', [device.type]);
  const isMobileOrTablet = useMemo<boolean>(() => device.type === 'mobile' || device.type === 'tablet', [device.type]);
  const isIOS = useMemo<boolean>(() => os.name === 'iOS', [os.name]);
  const isNonIOSMobile = useMemo<boolean>(() => !isIOS && device.type === 'mobile', [isIOS, device.type]);

  return {
    isMobile,
    isMobileOrTablet,
    isIOS,
    isNonIOSMobile,
  };
};

export default useUserAgentDetector;
