import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth';
import { DefaultPage } from '../../layout/DefaultPage';

export const Callback = () => {
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          await authenticate(code);
          navigate('/');
        } else {
          throw new Error('No authorization code found');
        }
      } catch (error: unknown) {
        console.error('Error during callback:', error);
        navigate('/login');
      }
    };

    processCallback();
  }, [authenticate, navigate]);

  return (
    <DefaultPage>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Processando login...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-spotify mx-auto"></div>
        </div>
      </div>
    </DefaultPage>
  );
};
