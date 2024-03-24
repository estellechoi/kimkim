import Image from 'next/image';
import { useCallback, useState } from 'react';
import { EXCHANGES_METADATA_DICT, Exchanges, FIATS_METADATA_DICT, Fiats } from '@/constants/app';

export type ExchangeLogoSize = 'sm' | 'md' | 'lg' | 'xl';

const ExchangeLogo_SIZE_DICT: Record<ExchangeLogoSize, { px: number; className: string }> = {
  sm: { px: 16, className: 'w-4 h-4' },
  md: { px: 20, className: 'w-5 h-5' },
  lg: { px: 24, className: 'w-6 h-6' },
  xl: { px: 32, className: 'w-8 h-8' },
};

type ExchangeLogoProps = {
  exchange: Exchanges;
  size?: ExchangeLogoSize;
  logoURL?: string;
};

const ExchangeLogo = ({ exchange, size = 'md', logoURL: injectedLogoURL }: ExchangeLogoProps) => {
  const logoURL = EXCHANGES_METADATA_DICT[exchange].logoURL;
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

  const pxSizes = { width: ExchangeLogo_SIZE_DICT[size].px, height: ExchangeLogo_SIZE_DICT[size].px };
  const sizeClassName = ExchangeLogo_SIZE_DICT[size].className;
  const opacityClassName = `transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`;

  return !isError && renderingLogoURL ? (
    <div className="relative">
      <Image
        alt={`${ExchangeLogo} logo`}
        src={renderingLogoURL}
        {...pxSizes}
        className={`rounded-full ${sizeClassName} ${opacityClassName}`}
        onLoadingComplete={onLoaded}
        onError={onError}
      />
    </div>
  ) : (
    <div aria-hidden className={`${sizeClassName} rounded-full animate-pulse`}></div>
  );
};

export default ExchangeLogo;
