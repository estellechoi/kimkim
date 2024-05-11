import Image from 'next/image';
import useCoinLogoURL from '@/components/useCoinLogoURL';
import { useCallback, useState } from 'react';
import { AllChains, TokenSymbols } from '@/constants/app';
import ChainLabel from '../ChainLabel';
import APP_LOGO_SVG from '@/resources/svgs/crafted_sparkle.svg';

export type CoinSize = 'sm' | 'md' | 'lg' | 'xl';

const COIN_SIZE_DICT: Record<CoinSize, { px: number; className: string }> = {
  sm: { px: 16, className: 'w-4 h-4' },
  md: { px: 20, className: 'w-5 h-5' },
  lg: { px: 24, className: 'w-6 h-6' },
  xl: { px: 32, className: 'w-8 h-8' },
};

type CoinProps = {
  symbol?: string;
  chain?: AllChains;
  size?: CoinSize;
  logoURL?: string;
};

const Coin = ({ symbol, chain, size = 'md', logoURL: injectedLogoURL }: CoinProps) => {
  const logoURL = useCoinLogoURL(symbol);
  const renderingLogoURL = injectedLogoURL ?? logoURL;
  const refinedLogoURL: string =
    renderingLogoURL?.startsWith('https://') || renderingLogoURL?.startsWith('/') ? renderingLogoURL : APP_LOGO_SVG;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const onLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const [isError, setIsError] = useState<boolean>(false);
  const onError = useCallback(() => {
    console.log('Coin image load error');
    setIsError(true);
  }, []);

  const pxSizes = { width: COIN_SIZE_DICT[size].px, height: COIN_SIZE_DICT[size].px };
  const sizeClassName = COIN_SIZE_DICT[size].className;
  const opacityClassName = `transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`;

  return !isError ? (
    <div className="relative">
      <Image
        alt={`${symbol} logo`}
        src={refinedLogoURL}
        {...pxSizes}
        className={`rounded-full ${sizeClassName} ${opacityClassName}`}
        onLoad={onLoaded}
        onError={onError}
      />

      {chain && (
        <div className="absolute -right-0.5 bottom-0 rounded-full bg-ground border border-solid border-primary_line_light">
          <ChainLabel size="xs" logoOnly chain={chain} />
        </div>
      )}
    </div>
  ) : (
    <div aria-hidden className={`${sizeClassName} rounded-full animate-pulse`}></div>
  );
};

export default Coin;
