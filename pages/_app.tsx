'use client';

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { Suspense, useRef } from 'react';
import queryClient from '@/data/queryClient';
import Fallback from '@/components/Fallback';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { SEO } from '../next-seo.config';
import SentryErrorBoundary from '@/components/ErrorBoundary/SentryErrorBoundary';
import AppHeader from '@/components/AppHeader';
import { ModalProvider } from '@/hooks/useModal/ModalProvider';
import AppFooter from '@/components/AppFooter';
import AnalyticsProvider from '@/hooks/useAnalytics/AnalyticsProvider';
import { googleAnalytics, mixpanel } from '@/constants/app';
import GoogleAnalyticsReporter from '@/analytics/googleAnalytics/GoogleAnalyticsReporter';
import MixPanelReporter from '@/analytics/mixpanel/MixPanelReporter';
import GlowBackground from '@/components/GlowBackground';
import useUsdBasedExchangeRateUpdate from '@/hooks/useUsdBasedExchangeRateUpdate';
import useUserAgent from '@/hooks/useUserAgent';
import MobileBlocker from '@/components/home/MobileBlocker';
import dynamic from 'next/dynamic';

const UserAgentDetector = dynamic(() => import('@/components/UserAgentDetector'), { ssr: false });

const MetaDataUpdater = () => {
  useUsdBasedExchangeRateUpdate();
  return null;
};

function MyApp({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) {
  const { reset } = useQueryErrorResetBoundary();

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

  const { isMobile } = useUserAgent();

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
        <link rel="icon" href="/favicon.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="KimKim" />
        <meta name="apple-mobile-web-app-title" content="KimKim" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="mask-icon" href="" color="#FFF" /> */}

        <meta name="description" content="실시간 김치 프리미엄" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kimkim.space" />
        <meta property="og:title" content="KimKim" />
        <meta property="og:description" content="실시간 김치 프리미엄" />
        <meta property="og:image" content="/images/open_graph_thumbnail.png" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://kimkim.space" />
        <meta property="twitter:title" content="KimKim" />
        <meta property="twitter:description" content="실시간 김치 프리미엄" />
        <meta property="twitter:image" content="https://app.nomos.ms//images/open_graph_thumbnail.png" />
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
            ]}>
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
                  <MobileBlocker />
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
