import Image from 'next/image';
// import LOGO_LIGHT_URL from '@/resources/logos/app_logo_white.svg';
// import LOGO_DARK_URL from '@/resources/logos/app_logo_primary.svg';
import LOGO_LIGHT_URL from '@/resources/logos/logo_kimchi_compact.svg';
import LOGO_DARK_URL from '@/resources/logos/logo_kimchi_compact.svg';

type AppLogoColor = 'light' | 'dark';
type AppLogoSize = 'md' | 'lg';

const LOGO_IMG_URL_DICT: Record<AppLogoColor, string> = {
  dark: LOGO_DARK_URL,
  light: LOGO_LIGHT_URL,
};

const LOGO_SIZE_CLASS_DICT: Record<AppLogoSize, { className: string; px: number }> = {
  md: { className: 'w-16', px: 64 },
  lg: { className: 'w-[5.75rem]', px: 92 },
};

type AppLogoProps = {
  color?: AppLogoColor;
  size?: AppLogoSize;
};

const AppLogo = ({ color = 'light', size = 'md' }: AppLogoProps) => {
  const src = LOGO_IMG_URL_DICT[color];
  const imgSize = LOGO_SIZE_CLASS_DICT[size];

  return <Image priority src={src} alt="App logo" width={imgSize.px} className={imgSize.className} />;
};

export default AppLogo;
