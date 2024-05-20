import { ButtonHTMLAttributes, useCallback } from 'react';
import Icon from '@/components/Icon';
import { useCopyClipboard } from './hook';

interface BaseProps {
  toCopy: string;
  iconPosition?: 'left' | 'right';
  onCopy?: (text: string) => void;
}

type CopyHelperProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const CopyHelper = ({ children, toCopy, iconPosition = 'right', onCopy, className = '' }: CopyHelperProps) => {
  const [isCopied, copy] = useCopyClipboard();

  const CopiedIcon = <Icon type="success" />;
  // Transition_500 transition-opacity opacity-0 group-hover/copy:opacity-80
  const CopyIcon = <Icon type="copy" className="" />;

  return (
    <button
      type="button"
      aria-label="Copy"
      className={`group/copy relative shrink-0 w-fit flex justify-start items-center gap-x-2 Transition_500 transition-opacity hover:opacity-80 ${className}`}
      onClick={() => {
        copy(toCopy);
        onCopy?.(toCopy);
      }}>
      {iconPosition === 'left' && (isCopied ? CopiedIcon : CopyIcon)}
      {children}
      {iconPosition === 'right' && (isCopied ? CopiedIcon : CopyIcon)}
    </button>
  );
};

export default CopyHelper;
