import Image from 'next/image';
import LOGO_LIGHT_URL from '@/resources/logos/logo_kimkim_white.svg';
import LOGO_DARK_URL from '@/resources/logos/logo_kimkim_black.svg';

type AppLogoColor = 'light' | 'dark';
type AppLogoSize = 'sm' | 'md' | 'lg';

const LOGO_IMG_URL_DICT: Record<AppLogoColor, string> = {
  dark: LOGO_DARK_URL.src,
  light: LOGO_LIGHT_URL.src,
};

const LOGO_SIZE_CLASS_DICT: Record<AppLogoSize, { className: string; px: number }> = {
  sm: { className: 'w-12', px: 48 },
  md: { className: 'w-16', px: 64 },
  lg: { className: 'w-[5.75rem]', px: 92 },
};

type AppLogoProps = {
  color?: AppLogoColor;
  size?: AppLogoSize;
  className?: string;
};

const AppLogo = ({ color = 'light', size = 'md', className = '' }: AppLogoProps) => {
  const src = LOGO_IMG_URL_DICT[color];
  const imgSize = LOGO_SIZE_CLASS_DICT[size];

  // return <AppLogoSVG className={`${imgSize.className} text-primary`} />

  return (
    <Image
      priority
      width={0}
      height={0}
      sizes="100%"
      style={{ height: 'auto' }}
      src={src}
      alt="App logo"
      className={`object-cover ${imgSize.className} ${className}`}
    />
  );
};

export default AppLogo;
