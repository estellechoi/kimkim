import type { ReactNode } from 'react';

export type ModalElement = (props: { isOpen: boolean; onClose: () => void }) => JSX.Element;
export type ModalRef = { onClose: () => void };
export type OpenFunction = (id: string, element: ReactNode) => void;
export type CloseFunction = (id: string) => void;
export type IsOpenGetter = (id: string) => boolean;
