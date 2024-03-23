import { type ReactNode } from 'react';
import type { OverlayProps } from '@/components/types';
import useBottomSheetClassName from './useBottomSheetClassName';
import OverlayBackdrop from '@/components/OverlayBackdrop';
import Handle from './Handle';
import useBottomSheetTouchDrag from './useBottomSheetTouchDrag';
import getReactElements from '../utils/getReactElements';
import Title from './Title';
import Content from './Content';

const getTitle = (children: ReactNode) => getReactElements(children, Title);
const getContent = (children: ReactNode) => getReactElements(children, Content);

type BottomSheetProps = OverlayProps & { children: ReactNode; className?: string };

const Container = ({ children, id, isOpen, onClose, className = '' }: BottomSheetProps) => {
  const touchDrag = useBottomSheetTouchDrag({ onDragEnd: onClose });
  const refinedClassName = useBottomSheetClassName(isOpen);

  return (
    <>
      <OverlayBackdrop isOpen={isOpen} onClick={onClose} />

      <div ref={touchDrag.ref} role="dialog" id={id} className={`${refinedClassName} ${className}`}>
        <Handle className="absolute top-2 inset-x-0" />
        {getTitle(children)}
        {getContent(children)}
      </div>
    </>
  );
};

const BottomSheet = Object.assign(Container, {
  Title,
  Content,
});

export default BottomSheet;
