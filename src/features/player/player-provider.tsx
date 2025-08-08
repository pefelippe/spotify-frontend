import { createContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useAuth } from '@/core/auth';
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
  const [repeatMode, setRepeatMode] = useState<'off' | 'context' | 'track'>('off');
  const repeatModeRef = useRef<'off' | 'context' | 'track'>('off');
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const initializePlayer = () => {
      if (player) {
        player.disconnect();
      }

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

      spotifyPlayer.addListener('player_state_changed', async (state) => {
        if (!state) {
          return;
        }

        const wasPaused = state.paused;
        const trackId = state.track_window.current_track?.id;

        setCurrentTrack(state.track_window.current_track);
        setPosition(state.position);
        setDuration(state.track_window.current_track.duration_ms);


        setIsPlaying(!state.paused);

        if (!currentTrack || currentTrack.id !== state.track_window.current_track.id) {
          setUserInteracted(false);
        }

        // Auto-repeat on track end when repeatMode is 'track'
        try {
          const currentDuration = state.track_window.current_track.duration_ms || 0;
          const nearEnd = currentDuration > 0 && state.position >= currentDuration - 500;
          const sameTrack = trackId && currentTrack && currentTrack.id === trackId;
          if (repeatModeRef.current === 'track' && wasPaused && nearEnd && sameTrack) {
            await spotifyPlayer.seek(0);
            await spotifyPlayer.resume();
          }
        } catch {}
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

    window.onSpotifyWebPlaybackSDKReady = initializePlayer;

    if (window.Spotify) {
      initializePlayer();
    }

    return () => {
      if (player) {
        player.disconnect();
      }
      if (window.onSpotifyWebPlaybackSDKReady === initializePlayer) {
        window.onSpotifyWebPlaybackSDKReady = () => {};
      }
    };
  }, [accessToken]);

  useEffect(() => {
    const prefillLastPlayed = async () => {
      if (!accessToken || !deviceId || !isReady) {
        return;
      }
      if (currentTrack) {
        return;
      }
    };

    prefillLastPlayed();
  }, [accessToken, currentTrack, deviceId, isReady]);

  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<Set<string>>(new Set());

  const playTrack = async (uri: string, contextUri?: string) => {
    const trackId = uri.split(':').pop();

    if (trackId && recentlyPlayedTracks.has(trackId)) {
      return;
    }

    if (!deviceId || !accessToken) {
      return;
    }

    setUserInteracted(true);

    let body: any;

    if (contextUri) {
      if (contextUri.startsWith('spotify:artist:')) {
        body = { context_uri: contextUri };
      } else if (contextUri === 'spotify:user:collection:tracks') {
        try {
          const likedTracksResponse = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!likedTracksResponse.ok) {
            console.error('Failed to fetch liked tracks');
            return;
          }

          const likedTracksData = await likedTracksResponse.json();
          const trackUris = likedTracksData.items.map((item: any) => item.track.uri);

          // If a specific track URI is provided, find its index
          if (uri) {
            const trackIndex = trackUris.findIndex((trackUri: string) => trackUri === uri);

            if (trackIndex !== -1) {
              // Play the specific track with the list of track URIs
              body = {
                uris: trackUris,
                offset: { position: trackIndex },
              };
            } else {
              // If the track is not found, play from the beginning
              body = { uris: trackUris };
            }
          } else {
            body = { uris: trackUris };
          }
        } catch (error) {
          console.error('Error fetching liked tracks:', error);
          return;
        }
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
        const errorBody = await response.text();
        console.error('❌ Playback Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
          requestBody: body,
          deviceId,
          uri,
          contextUri,
        });

        if (response.status === 401) {
          console.error('❌ Erro 401: Token expirado ou inválido');
          // The auth provider will handle the logout automatically
          return;
        } else if (response.status === 403) {
          console.error('❌ Erro 403: Você precisa ter Spotify Premium para usar o Web Playback SDK');
          setIsPremiumRequired(true);
        }
        return;
      }

      // Fetch the current track details after successful play
      const trackDetailsResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (trackDetailsResponse.ok) {
        const trackData = await trackDetailsResponse.json();
        if (trackData && trackData.item) {
          // Set the current track details
          setCurrentTrack(trackData.item);
          setPosition(trackData.progress_ms || 0);
          setDuration(trackData.item.duration_ms || 0);
          setIsPlaying(true);
        }
      }

      // Update recently played tracks
      setRecentlyPlayedTracks(prev => {
        const newSet = new Set(prev);
        // Add current track
        if (trackId) {
          newSet.add(trackId);
        }

        // Limit to last 10 tracks to prevent memory growth
        if (newSet.size > 10) {
          const oldestTrack = Array.from(newSet)[0];
          newSet.delete(oldestTrack);
        }

        return newSet;
      });
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
    if (!deviceId || !accessToken) {
      return;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to pause track:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        return;
      }

      setUserInteracted(true);
      setIsPlaying(false);

      // Fallback to SDK pause if API call fails
      if (player) {
        await player.pause();
      }
    } catch (error) {
      console.error('Error pausing track:', error);
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

  // Add shuffle method
  const setShuffle = async (shuffleState: boolean) => {
    if (!accessToken) {
      return;
    }

    try {
      const url = `https://api.spotify.com/v1/me/player/shuffle?state=${shuffleState}${deviceId ? `&device_id=${deviceId}` : ''}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to set shuffle state', response.statusText);
        return;
      }

      // Update local state to reflect shuffle status
      setUserInteracted(true);
    } catch (error) {
      console.error('Error setting shuffle:', error);
    }
  };

  // Add repeat method
  const setRepeat = async (mode: 'track' | 'context' | 'off') => {
    if (!accessToken) {
      return;
    }

    try {
      const url = `https://api.spotify.com/v1/me/player/repeat?state=${mode}${deviceId ? `&device_id=${deviceId}` : ''}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to set repeat state', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        return;
      }

      // Update local state to reflect repeat status
      setUserInteracted(true);
      setRepeatMode(mode);

      // Fetch current playback state to confirm repeat mode
      const stateResponse = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (stateResponse.ok) {
        const stateData = await stateResponse.json();
        console.log('Current playback state:', stateData);
      }
    } catch (error) {
      console.error('Error setting repeat:', error);
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
        // Add a new method to check if a track is available
        hasTrack: !!currentTrack,
        // Add new shuffle and repeat methods
        setShuffle,
        setRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
