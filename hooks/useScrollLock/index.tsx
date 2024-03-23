import { useLayoutEffect } from 'react';
import useUserAgent from '../useUserAgent';
import { getDisposables } from './getDisposables';
import lockScroll from './lockScroll';
import unlockScroll from './unlockScroll';

const useScrollLock = (enabled: boolean, escapedElement?: HTMLElement | null): boolean => {
  const isLocked = !!document;

  const { isIOS } = useUserAgent();

  useLayoutEffect(() => {
    if (!enabled) return;

    const targetDocument = escapedElement?.ownerDocument ?? document;

    if (!targetDocument) return;

    const options = { escapedElement };
    const disposables = getDisposables();

    lockScroll({ document: targetDocument, disposables, options }, isIOS);

    return () => {
      unlockScroll({ document: targetDocument, disposables, options });
    };
  }, [enabled, escapedElement, isIOS]);

  return isLocked;
};

export default useScrollLock;
