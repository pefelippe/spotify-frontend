import { useContext } from 'react';
import { AuthContext } from '../providers/auth-provider';
import { AuthContextData } from '../types/auth';

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve estar dentro de AuthProvider');
  }
  return context;
}; 