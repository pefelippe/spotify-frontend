import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-provider';

interface PlayerContextData {
  player: SpotifyPlayer | null;
  isReady: boolean;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  deviceId: string | null;
  isPremiumRequired: boolean;
  resetPremiumWarning: () => void;
  playTrack: (uri: string, contextUri?: string) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seekToPosition: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextData | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const initializePlayer = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify Clone Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error(' Falha ao inicializar player:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error(' Falha na autenticação:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Falha ao validar conta Spotify (precisa ser Premium):', message);
        setIsPremiumRequired(true);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Erro de reprodução:', message);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) {
          return;
        }

        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.track_window.current_track.duration_ms);
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener('not_ready', () => {
        setIsReady(false);
      });

      spotifyPlayer.connect().then(success => {
        if (!success) {
          console.error('Falha ao conectar ao Spotify Web Playback SDK');
        }
      });
      setPlayer(spotifyPlayer);
    };

    // Define the callback function immediately
    window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    
    // If SDK is already loaded, initialize immediately
    if (window.Spotify) {
      initializePlayer();
    }

    return () => {
      if (player) {
        player.disconnect();
      }
      // Clean up the global callback
      if (window.onSpotifyWebPlaybackSDKReady === initializePlayer) {
        window.onSpotifyWebPlaybackSDKReady = () => {};
      }
    };
  }, [accessToken]);

  const playTrack = async (uri: string, contextUri?: string) => {
    if (!deviceId || !accessToken) {
      return;
    }

    let body: any;

    if (contextUri) {
      if (contextUri.startsWith('spotify:artist:')) {
        body = { context_uri: contextUri };
      } else if (!uri || uri.trim() === '') {
        body = { context_uri: contextUri };
      } else {
        body = { context_uri: contextUri, offset: { uri } };
      }
    } else {
      body = { uris: [uri] };
    }



    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.error('❌ Erro 403: Você precisa ter Spotify Premium para usar o Web Playback SDK');
          setIsPremiumRequired(true);
        }
      } else {

      }
    } catch (error) {
      console.error('Erro ao tocar música:', error);
    }
  };

  const resetPremiumWarning = () => {
    setIsPremiumRequired(false);
  };

  const pauseTrack = async () => {
    if (player) {
      await player.pause();
    }
  };

  const resumeTrack = async () => {
    if (player) {
      await player.resume();
    }
  };

  const nextTrack = async () => {
    if (player) {
      await player.nextTrack();
    }
  };

  const previousTrack = async () => {
    if (player) {
      await player.previousTrack();
    }
  };

  const seekToPosition = async (position: number) => {
    if (player) {
      await player.seek(position);
    }
  };

  const setVolume = async (volume: number) => {
    if (player) {
      await player.setVolume(volume);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        isReady,
        currentTrack,
        isPlaying,
        position,
        duration,
        deviceId,
        isPremiumRequired,
        resetPremiumWarning,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        seekToPosition,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextData => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer deve estar dentro de PlayerProvider');
  }
  return context;
};
