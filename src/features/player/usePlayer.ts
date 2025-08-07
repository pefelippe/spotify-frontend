import { useContext } from 'react';
import { PlayerContext } from '@/features/player/player-provider';
import { PlayerContextData } from '@/features/player/player';

export const usePlayer = (): PlayerContextData => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer deve estar dentro de PlayerProvider');
  }
  return context;
};
