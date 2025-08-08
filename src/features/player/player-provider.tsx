import { createContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/core/auth';
import { fetchRecentlyPlayed } from '@/core/api/queries/recently-played';
import { PlayerContextData, SpotifyDevice } from './player';

export const PlayerContext = createContext<PlayerContextData | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<SpotifyDevice[]>([]);
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

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

        // Sempre atualizar as informações da música
        setCurrentTrack(state.track_window.current_track);
        setPosition(state.position);
        setDuration(state.track_window.current_track.duration_ms);

        // Sempre espelhar o estado de reprodução do Spotify
        // Se a música está tocando externamente, também tocar no clone
        setIsPlaying(!state.paused);

        // Se há uma nova música tocando, resetar a interação
        if (!currentTrack || currentTrack.id !== state.track_window.current_track.id) {
          setUserInteracted(false);
        }
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

  // Prefill last played track on first load (without auto-playing)
  useEffect(() => {
    const prefillLastPlayed = async () => {
      if (!accessToken) {
        return;
      }
      if (currentTrack) {
        return;
      }
      try {
        const data = await fetchRecentlyPlayed(accessToken, 1);
        const last = data?.items?.[0]?.track;
        if (last) {
          setCurrentTrack(last as unknown as SpotifyTrack);
          setPosition(0);
          setDuration((last as any).duration_ms || 0);
          setIsPlaying(false);
        }
      } catch (e) {
        // silently ignore
      }
    };

    prefillLastPlayed();
  }, [accessToken, currentTrack]);

  const playTrack = async (uri: string, contextUri?: string) => {
    if (!deviceId || !accessToken) {
      return;
    }

    setUserInteracted(true);

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
        if (response.status === 401) {
          console.error('❌ Erro 401: Token expirado ou inválido');
          // The auth provider will handle the logout automatically
          return;
        } else if (response.status === 403) {
          console.error('❌ Erro 403: Você precisa ter Spotify Premium para usar o Web Playback SDK');
          setIsPremiumRequired(true);
        }
      } else {

      }
    } catch (error) {
      console.error('Erro ao tocar música:', error);
    }
  };

  const refreshDevices = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const devices: SpotifyDevice[] = data.devices || [];
      setAvailableDevices(devices);
      const active = devices.find(d => d.is_active);
      setActiveDeviceId(active ? active.id : null);
    } catch (e) {
      console.error('Erro ao buscar dispositivos:', e);
    }
  };

  const transferPlayback = async (targetDeviceId: string, play: boolean = true) => {
    if (!accessToken) {
      return;
    }
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ device_ids: [targetDeviceId], play }),
      });
      if (res.ok) {
        setActiveDeviceId(targetDeviceId);
        await refreshDevices();
      } else if (res.status === 403) {
        console.error('❌ Transfer playback requires Premium');
        setIsPremiumRequired(true);
      }
    } catch (e) {
      console.error('Erro ao transferir reprodução:', e);
    }
  };

  const resetPremiumWarning = () => {
    setIsPremiumRequired(false);
  };

  const pauseTrack = async () => {
    if (player) {
      setUserInteracted(true);
      await player.pause();
    }
  };

  const resumeTrack = async () => {
    if (player) {
      setUserInteracted(true);
      await player.resume();
    }
  };

  const nextTrack = async () => {
    if (player) {
      setUserInteracted(true);
      await player.nextTrack();
    }
  };

  const previousTrack = async () => {
    if (player) {
      setUserInteracted(true);
      await player.previousTrack();
    }
  };

  const seekToPosition = async (position: number) => {
    if (player) {
      setUserInteracted(true);
      await player.seek(position);
    }
  };

  const setVolume = async (volume: number) => {
    if (player) {
      setUserInteracted(true);
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
        activeDeviceId,
        availableDevices,
        isPremiumRequired,
        userInteracted,
        resetPremiumWarning,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        seekToPosition,
        setVolume,
        refreshDevices,
        transferPlayback,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
