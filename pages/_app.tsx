'use client';

import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider, useQueryErrorResetBoundary} from '@tanstack/react-query';
import {Suspense, useMemo, useRef} from 'react';
import queryClient from '@/data/queryClient';
import Fallback from '@/components/Fallback';
import Head from 'next/head';
import {NextSeo} from 'next-seo';
import {SEO} from '../next-seo.config';
import SentryErrorBoundary from '@/components/ErrorBoundary/SentryErrorBoundary';
import AppHeader from '@/components/AppHeader';
import {ModalProvider} from '@/hooks/useModal/ModalProvider';
import useSetupTokens from '@/hooks/useSetupTokens';
import dynamic from 'next/dynamic';
import AppFooter from '@/components/AppFooter';
import AnalyticsProvider from '@/hooks/useAnalytics/AnalyticsProvider';
import {googleAnalytics, mixpanel} from '@/constants/app';
import GoogleAnalyticsReporter from '@/analytics/googleAnalytics/GoogleAnalyticsReporter';
import MixPanelReporter from '@/analytics/mixpanel/MixPanelReporter';
import GlowBackground from '@/components/GlowBackground';
import useUpbitMarketUpdate from '@/hooks/useUpbitMarketUpdate';
import useCoinMarketCapUpdate from '@/hooks/useCoinMarketCapUpdate';
import useUsdBasedExchangeRateUpdate from '@/hooks/useUsdBasedExchangeRateUpdate';
import useBinanceMarketUpdate from '@/hooks/useBinanceMarketUpdate';

const UserAgentDetector = dynamic(() => import('@/components/UserAgentDetector'), {ssr: false});

const MetaDataUpdater = () => {
  useUsdBasedExchangeRateUpdate();

  useCoinMarketCapUpdate();
  useUpbitMarketUpdate();
  useBinanceMarketUpdate();

  useSetupTokens();
  return null;
};

function MyApp({Component, pageProps}: AppProps<{dehydratedState: DehydratedState}>) {
  const {reset} = useQueryErrorResetBoundary();

  /**
   *
   * @description ensure that it persists across multiple renders
   */
  const queryClientRef = useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = queryClient;
    queryClientRef.current.setDefaultOptions({
      queries: {
        initialData: pageProps.dehydratedState,
      },
    });
  }



  return (
    <>
      <Head>
        <title>Dashboard KimKim</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f5f5f5" />
        <link rel="icon" href="/icons/app_favicon.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="KimKim" />
        <meta name="apple-mobile-web-app-title" content="KimKim" />
        <link rel="apple-touch-icon" href="/icons/app_icon_192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/app_icon_192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/app_icon_192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/app_icon_192.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/app_favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/app_favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="mask-icon" href="" color="#F5F5F5" /> */}

        <meta name="description" content="실시간 김치 프리미엄" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F5F5F5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F5F5F5" />
      </Head>

      <NextSeo {...SEO} />

      <SentryErrorBoundary fallbackComponent={Fallback} onReset={reset}>
        <Suspense>
          <AnalyticsProvider
            items={[
              {
                analytics: googleAnalytics,
                initializer: GoogleAnalyticsReporter,
              },
              {
                analytics: mixpanel,
                initializer: MixPanelReporter,
              },
            ]}
          >
            <QueryClientProvider client={queryClientRef.current}>
              <HydrationBoundary state={pageProps.dehydratedState}>
                <MetaDataUpdater />
                <UserAgentDetector />
                <ModalProvider>
                  <GlowBackground
                    color="primary"
                    style={{
                      transform: 'translateY(-120vh)',
                    }}
                  />
                  <AppHeader className="fixed top-0 left-0 right-0 z-navigation" />
                  <Component {...pageProps} />
                  <AppFooter />
                </ModalProvider>
              </HydrationBoundary>
            </QueryClientProvider>
          </AnalyticsProvider>
        </Suspense>
      </SentryErrorBoundary>
    </>
  );
}

export default MyApp;
