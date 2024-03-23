const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withPWA = require('next-pwa')({
  dest: 'public',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
      },
      {
        protocol: 'https',
        hostname: 'images.talis.art',
      },
      {
        protocol: 'https',
        hostname: 'talis-protocol.mo.cloudinary.net',
      },
      {
        protocol: 'https',
        hostname: 'talis-app-injective-staging.s3.eu-west-2.amazonaws.com',
      },
      /**
       *
       * @todo remove this
       */
      {
        protocol: 'https',
        hostname: 'i.seadn.io',
      },
    ],
  },
  // distDir: 'build',
};

/**
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-your-nextjs-configuration
 */
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

  org: 'example-org',
  project: 'example-project',

  // An auth token is required for uploading source maps.
  // You can get an auth token from https://sentry.io/settings/account/api/auth-tokens/
  // The token must have `project:releases` and `org:read` scopes for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: true, // Suppresses all logs

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const sentryOptions = {
  hideSourceMaps: true,
};

const withBundleAnalyzerOptions = { enabled: process.env.ANALYZE === 'true' };

const config = withBundleAnalyzer(withBundleAnalyzerOptions)(
  nextConfig
);
// const sentryConfig = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions);

module.exports = withPWA(config);
