import { useContext } from 'react';
import { PlayerContext } from '../../features/player/player-provider';
import { PlayerContextData } from '../../features/player/player';

export const usePlayer = (): PlayerContextData => {
  const context = useContext(PlayerContext);
  if (!context) {
    console.error('PlayerContext is undefined', {
      PlayerContext,
      contextValue: useContext(PlayerContext),
    });
    throw new Error('usePlayer deve estar dentro de PlayerProvider');
  }
  return context;
};
