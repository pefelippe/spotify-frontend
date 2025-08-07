import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyClient } from '@/core/api/client/spotify-client';
import { AuthContextData } from '../types/auth';
import axios from 'axios';

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem('spotify_token'),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      spotifyClient.setToken(accessToken);
      // Set up unauthorized callback to logout user when token expires
      spotifyClient.setOnUnauthorized(() => {
        console.log('🔄 Token expired, logging out user...');
        logout();
      });

      // Set up global callback for axios 401 errors
      window.spotifyUnauthorizedCallback = () => {
        console.log('🔄 Axios 401 detected, logging out user...');
        logout();
      };
    }
  }, [accessToken]);

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
  }, []);

  const authenticate = async (code: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/callback?code=${code}`,
      );
      const token = response.data.access_token;
      sessionStorage.setItem('spotify_token', token);
      setAccessToken(token);
      spotifyClient.setToken(token);
      navigate('/');
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      logout();
    }
  };

  const logout = () => {
    sessionStorage.removeItem('spotify_token');
    setAccessToken(null);
    spotifyClient.clearToken();
    spotifyClient.clearOnUnauthorized(); // Clear the unauthorized callback
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!accessToken, accessToken, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
