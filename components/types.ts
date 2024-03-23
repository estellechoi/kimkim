export type OverlayProps = Readonly<{
  id?: string;
  ariaLabel: string;
  isOpen: boolean;
  onClose: () => void;
}>;
