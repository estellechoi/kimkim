import type { ScrollLockStep } from '../types';

const preventScroll = (): ScrollLockStep => {
  return {
    before({ document, disposables }) {
      disposables.style(document.documentElement, 'overflow', 'hidden');
    },
  };
};

export default preventScroll;
