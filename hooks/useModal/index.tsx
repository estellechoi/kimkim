import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ModalElement, ModalRef } from './types';
import { ModalController } from './ModalController';
import { ModalContext } from './ModalProvider';

const useModal = () => {
  const context = useContext(ModalContext);

  if (context === null) throw new Error('useModal must be used within a ModalProvider');

  const { prevId, setPrevId, open, close, entries, getIsOpen } = context;

  const [id] = useState(() => String(prevId + 1));

  useEffect(() => {
    setPrevId(Number(id));
  }, []);

  const modalRef = useRef<ModalRef | null>(null);

  const handlers = useMemo(() => {
    return {
      open: (modalElement: ModalElement) => {
        open(id, <ModalController modalElement={modalElement} onClosed={() => close(id)} ref={modalRef} />);
      },
      close: () => {
        modalRef.current?.onClose();
      },
    };
  }, [id, open, close]);

  const openModal = useCallback(
    (ModalElement: ModalElement): Promise<void> => {
      return new Promise<void>((resolve) => {
        handlers.open(({ isOpen, onClose }) => (
          <ModalElement
            isOpen={isOpen}
            onClose={() => {
              onClose();
              resolve();
            }}
          />
        ));
      });
    },
    [handlers]
  );

  const modal = useMemo(() => {
    return {
      id: `modal-${id}`,
      isOpen: getIsOpen(id),
      open: openModal,
      close: handlers.close,
    };
  }, [id, openModal, handlers.close, getIsOpen]);

  return modal;
};

export default useModal;
