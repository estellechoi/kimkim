import adjustScrollbarPadding from './adjustScrollbarPadding';
import handleIOSScrollLock from './handleIOSScrollLock';
import preventScroll from './preventScroll';
import type { DocumentContext, ScrollLockStep } from '../types';

const lockScroll = (ctx: DocumentContext, isIOS: boolean) => {
  const IOSStep = isIOS ? [handleIOSScrollLock()] : [];
  const steps: ScrollLockStep<any>[] = [...IOSStep, adjustScrollbarPadding(), preventScroll()];

  steps.forEach(({ before }) => before?.(ctx));
  steps.forEach(({ after }) => after?.(ctx));
};

export default lockScroll;
