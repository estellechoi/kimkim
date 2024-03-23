import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import type { ModalElement, ModalRef } from './types';

type ModalControllerProps = {
  modalElement: ModalElement;
  onClosed: () => void;
};

const ModalControllerRefForwarder = ({ modalElement: ModalElement, onClosed }: ModalControllerProps, ref: Ref<ModalRef>) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  /**
   *
   * @description timer is required for closing animation duration
   */
  const onClose = useCallback(() => {
    setIsOpen(false);

    const timer = setTimeout(() => {
      onClosed();
    }, 800);

    return () => clearTimeout(timer);
  }, [onClosed]);

  useImperativeHandle(
    ref,
    () => {
      return { onClose };
    },
    [onClose]
  );

  /**
   *
   * @description to make sure setting isOpen to true before browser's re-painting.
   */
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  }, []);

  return <ModalElement isOpen={isOpen} onClose={onClose} />;
};

export const ModalController = forwardRef(ModalControllerRefForwarder);
