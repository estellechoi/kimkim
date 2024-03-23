import Layout from '@/components/Main';
import type { FallbackProps } from '@/components/ErrorBoundary/types';

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Layout>
      <div className="text-white">ErrorFallback</div>
      <div>
        <button type="button" onClick={() => resetErrorBoundary()}>
          Retry
        </button>
      </div>
    </Layout>
  );
};

export default Fallback;
