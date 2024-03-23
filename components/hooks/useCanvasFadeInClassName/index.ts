import { useCallback, useMemo, useState } from 'react';

const useCanvasFadeInClassName = () => {
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const onCreated = useCallback(() => {
    setIsCreated(true);
  }, []);

  const className = useMemo<string>(() => (isCreated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'), [isCreated]);

  return { className, isCreated, onCreated };
};

export default useCanvasFadeInClassName;
