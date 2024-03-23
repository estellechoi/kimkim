import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';

export const useCopyClipboard = (timeout = 500): [boolean, (toCopy: string) => void] => {
  const [isCopied, setIsCopied] = useState(false);

  const staticCopy = useCallback((text: string) => {
    const didCopy = copy(text);
    setIsCopied(didCopy);
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isCopied, setIsCopied, timeout]);

  return [isCopied, staticCopy];
};
