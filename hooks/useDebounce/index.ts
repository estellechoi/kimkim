import { useEffect, useState } from 'react';

/**
 *
 * @description must wrap the non-primitive value in useMemo, or the value will be updated due to referential inequality.
 * modified from https://usehooks.com/useDebounce/
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
