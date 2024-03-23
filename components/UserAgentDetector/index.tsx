import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAgentAtom } from '@/store/states';
import useUserAgentDetector from './useUserAgentDetector';

const UserAgentDetector = () => {
  const [, setUserAgentAtom] = useAtom(userAgentAtom);

  const userAgent = useUserAgentDetector();

  useEffect(() => {
    setUserAgentAtom(userAgent);
  }, []);

  return null;
};

export default UserAgentDetector;
