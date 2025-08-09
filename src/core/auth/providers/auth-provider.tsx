import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyClient } from '../../../core/api/client/spotify-client';
import { AuthContextData } from '../types/auth';
import { env } from '../../../config/env';
import axios from 'axios';

const REQUIRED_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-follow-read',
  'user-follow-modify',
  'user-top-read',
  'streaming',
  'app-remote-control'
];

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem('spotify_token'),
  );
  const [tokenScopes, setTokenScopes] = useState<string | null>(
    sessionStorage.getItem('spotify_token_scopes'),
  );
  const navigate = useNavigate();

  // Função utilitária para construir URLs sem duplas barras
  const buildApiUrl = (endpoint: string) => {
    const baseUrl = env.API_URL.replace(/\/$/, '');
    return `${baseUrl}/${endpoint.replace(/^\//, '')}`;
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem('spotify_token');
    sessionStorage.removeItem('spotify_token_scopes');
    setAccessToken(null);
    setTokenScopes(null);
    spotifyClient.clearToken();
    spotifyClient.clearOnUnauthorized(); 
    navigate('/login');
  }, [navigate]);

  const hasRequiredScopes = useCallback((scopes: string | null): boolean => {
    if (!scopes) return false;
    const userScopes = scopes.split(' ');
    return REQUIRED_SCOPES.every(requiredScope => userScopes.includes(requiredScope));
  }, []);

  // Check if the user is properly authenticated (has token and required scopes)
  const isProperlyAuthenticated = !!accessToken && hasRequiredScopes(tokenScopes);

  useEffect(() => {
    if (accessToken) {
      spotifyClient.setToken(accessToken);
      spotifyClient.setOnUnauthorized(() => {
        console.log('🔄 Token expired, logging out user...');
        logout();
      });

      window.spotifyUnauthorizedCallback = () => {
        console.log('🔄 Axios 401 detected, logging out user...');
        logout();
      };
    }
  }, [accessToken, logout]);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('🔄 Unauthorized event received, logging out user...');
      logout();
    };

    window.addEventListener('spotify-unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('spotify-unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const authenticate = async (code: string) => {
    try {
      const callbackUrl = buildApiUrl(`auth/callback?code=${code}`);
    
      const response = await axios.get(callbackUrl);
      const token = response.data.data.access_token;
      const scopes = response.data.data.scope;
      
      sessionStorage.setItem('spotify_token', token);
      sessionStorage.setItem('spotify_token_scopes', scopes);
      setAccessToken(token);
      setTokenScopes(scopes);
      spotifyClient.setToken(token);
      navigate('/');
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated: isProperlyAuthenticated, 
        accessToken, 
        authenticate, 
        logout,
        tokenScopes 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
