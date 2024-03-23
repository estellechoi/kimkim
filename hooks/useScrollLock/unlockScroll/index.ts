import type { DocumentContext } from '../types';

const unlockScroll = (ctx: DocumentContext) => {
  const { disposables } = ctx;
  disposables.dispose();
};

export default unlockScroll;
