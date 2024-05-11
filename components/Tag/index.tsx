export type TagColor = 'secondary' | 'success' | 'danger' | 'warning';
export type TagSize = 'sm';

export const COLOR_CLASS_DICS: Record<TagColor, string> = {
  secondary: 'bg-secondary text-body',
  success: 'bg-semantic_success text-ground',
  danger: 'bg-semantic_danger text-ground',
  warning: 'bg-semantic_warning text-ground',
};

export const SIZE_CLASS_DICS: Record<TagSize, string> = {
  sm: 'px-2 py-0',
};

export const FONT_CLASS_DICS: Record<TagSize, string> = {
  sm: 'Font_label_12px',
};

export type TagProps = {
  color?: TagColor;
  size: TagSize;
  label: string;
  className?: string;
};

const Tag = ({ color = 'secondary', size, label, className = '' }: TagProps) => {
  const colorClassName = COLOR_CLASS_DICS[color];
  const paddingClassName = SIZE_CLASS_DICS[size];
  const fontClassName = FONT_CLASS_DICS[size];
  const radiusClassName = 'rounded-tag';

  return (
    <span
      className={`inline-flex items-center ${colorClassName} ${paddingClassName} ${fontClassName} ${radiusClassName} ${className}`}>
      {label}
    </span>
  );
};

export default Tag;
