/**
 * @see https://nextjs.org/docs/basic-features/data-fetching/overview
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 * @see https://reactjs.org/docs/error-boundaries.html
 */
import { NextPage } from 'next';
import { ErrorProps } from 'next/error';
import NextErrorComponent from 'next/error';
import { captureUnderscoreErrorException } from '@sentry/nextjs';

const CustomErrorComponent: NextPage<ErrorProps> = (props) => {
  // If you're using a Nextjs version prior to 12.2.1, uncomment this to
  // compensate for https://github.com/vercel/next.js/issues/8592
  // Sentry.captureUnderscoreErrorException(props);

  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (context) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await captureUnderscoreErrorException(context);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(context);
};

export default CustomErrorComponent;
