import { useEffect, useRef } from 'react';

import { useAuth } from '@/core/auth';
import { DefaultPage } from '@/app/layout/DefaultPage';

export const Callback = () => {
  const { authenticate } = useAuth();
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    if (hasAuthenticated.current) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      authenticate(code);
      hasAuthenticated.current = true;
    }
  }, [authenticate]);

  return <DefaultPage>
    <p className="text-white text-center mt-20">Autenticando com o Spotify...</p>;
  </DefaultPage>
};
