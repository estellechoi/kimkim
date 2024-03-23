import { useMemo } from 'react';
import useScrollPosition from '@/hooks/useScrollPosition';

const useAppHeaderClassName = () => {
  const { isYScrolled } = useScrollPosition();

  const bgClassName = useMemo<string>(
    () => `transition-[backdrop-filter,background-color] ${isYScrolled ? 'Bg_glass_thin' : ''}`,
    [isYScrolled]
  );
  const gridClassName = 'Component h-app_header_height flex items-center justify-between px-app_header_padding_x';

  return `${gridClassName} ${bgClassName}`;
};

export default useAppHeaderClassName;
