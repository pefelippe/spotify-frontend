import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { setSpotifyToken } from '../api/spotify';
import api from '../api/spotify';
import axios from 'axios';

interface AuthContextData {
  isAuthenticated: boolean
  accessToken: string | null
  authenticate: (code: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem('spotify_token'),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      setSpotifyToken(accessToken);
    }
  }, [accessToken]);

  const authenticate = async (code: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/callback?code=${code}`,
      );
      const token = response.data.access_token;
      sessionStorage.setItem('spotify_token', token);
      setAccessToken(token);
      setSpotifyToken(token);
      navigate('/');
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      logout();
    }
  };

  const logout = () => {
    sessionStorage.removeItem('spotify_token');
    setAccessToken(null);
    delete api.defaults.headers.common['Authorization'];
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

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve estar dentro de AuthProvider');
  }
  return context;
};
