export type LoaderStyle = 'span' | 'grid' | 'coin_label';

export type LoadingRowsColor = 'primary' | 'on_primary';

export const BG_CLASS_DICT: Record<LoadingRowsColor, string> = {
  primary: 'Bg_skeleton_primary',
  on_primary: 'Bg_skeleton_on_primary',
};
