import type { ScrollLockStep } from '../types';

const adjustScrollbarPadding = (): ScrollLockStep => {
  let scrollbarWidthBefore: number;

  return {
    before({ document }) {
      let documentElement = document.documentElement;
      let ownerWindow = document.defaultView ?? window;

      scrollbarWidthBefore = ownerWindow.innerWidth - documentElement.clientWidth;
    },

    after({ document, disposables }) {
      let documentElement = document.documentElement;

      // Account for the change in scrollbar width
      // NOTE: This is a bit of a hack, but it's the only way to do this
      let scrollbarWidthAfter = documentElement.clientWidth - documentElement.offsetWidth;
      let scrollbarWidth = scrollbarWidthBefore - scrollbarWidthAfter;

      disposables.style(documentElement, 'paddingRight', `${scrollbarWidth}px`);
    },
  };
};

export default adjustScrollbarPadding;
