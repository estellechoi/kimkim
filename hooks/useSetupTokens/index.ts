import { allTokensDictAtom } from '@/store/states';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

const useSetupTokens = () => {
  const [, setTokensDict] = useAtom(allTokensDictAtom);


  useEffect(() => {
    //
  }, []);
};

export default useSetupTokens;
