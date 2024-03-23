export type FallbackProps = {
  error: Error | string;
  resetErrorBoundary: (...args: unknown[]) => void;
};

export type ErrorBoundaryProps = {
  fallbackComponent: React.ComponentType<FallbackProps>;
  onReset?: (...args: unknown[]) => void;
};
