import { useCallback, useEffect, useState } from 'react';

const useScrollPosition = () => {
  const [isYScrolled, setIsYScrolled] = useState(false);

  const onScroll = useCallback(() => {
    const { scrollY } = window;
    setIsYScrolled(scrollY > 0);
  }, []);

  useEffect(() => {
    window?.addEventListener('scroll', onScroll);

    return () => {
      window?.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    isYScrolled,
  };
};

export default useScrollPosition;
