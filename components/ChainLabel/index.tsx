import Image from 'next/image';
import { useCallback, useState } from 'react';
import { AllChains, CHAIN_METADATA_DICT } from '@/constants/app';
import { TextColor, TEXT_COLOR_CLASS_DICT } from '@/components/styles';

export type ChainLabelColor = TextColor;

export type ChainLabelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const COLOR_CLASS_DICT = TEXT_COLOR_CLASS_DICT;

const CHAIN_LABEL_SIZE_DICT: Record<ChainLabelSize, { px: number; className: string }> = {
  xs: { px: 8, className: 'w-2 h-2' },
  sm: { px: 16, className: 'w-4 h-4' },
  md: { px: 20, className: 'w-5 h-5' },
  lg: { px: 24, className: 'w-6 h-6' },
  xl: { px: 32, className: 'w-8 h-8' },
};

const CHAIN_LABEL_FONT_DICT: Record<ChainLabelSize, string> = {
  xs: 'Font_label_12px',
  sm: 'Font_label_12px',
  md: 'Font_label_14px',
  lg: 'Font_label_14px',
  xl: 'Font_label_14px',
}

type ChainLabelProps = {
  chain: AllChains;
  color?: ChainLabelColor;
  size?: ChainLabelSize;
  logoURL?: string;
  logoOnly?: boolean;
  className?: string;
};

const ChainLabel = ({ chain, color = 'body', size = 'md', logoURL: injectedLogoURL, logoOnly = false, className = '' }: ChainLabelProps) => {
  const logoURL = CHAIN_METADATA_DICT[chain].logoURL;
  const renderingLogoURL = injectedLogoURL ?? logoURL;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const onLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const [isError, setIsError] = useState<boolean>(false);
  const onError = useCallback(() => {
    console.log('error');
    setIsError(true);
  }, []);

  const colorClassName = COLOR_CLASS_DICT[color];
  const fontClassName = CHAIN_LABEL_FONT_DICT[size];
  const pxSizes = { width: CHAIN_LABEL_SIZE_DICT[size].px, height: CHAIN_LABEL_SIZE_DICT[size].px };
  const sizeClassName = CHAIN_LABEL_SIZE_DICT[size].className;
  const opacityClassName = `transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`;

  const Logo =
    !isError && renderingLogoURL ? (
      <Image
        alt={`${chain} logo`}
        src={renderingLogoURL}
        {...pxSizes}
        className={`rounded-full ${sizeClassName} ${opacityClassName}`}
        onLoad={onLoaded}
        onError={onError}
      />
    ) : (
      <div aria-hidden className={`${sizeClassName} rounded-full animate-pulse`}></div>
    );

  return logoOnly ? (
    <div className={className}>{Logo}</div>
  ) : (
    <div className={`${className} flex items-center gap-x-2`}>
      {Logo}
      <div className={`${fontClassName} ${colorClassName}`}>{chain}</div>
    </div>
  );
};

export default ChainLabel;
