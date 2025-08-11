import { createContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useAuth } from '../../core/auth';
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
  const [activeDeviceName, setActiveDeviceName] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<SpotifyDevice[]>([]);
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'context' | 'track'>('off');
  const repeatModeRef = useRef<'off' | 'context' | 'track'>('off');
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  // Store a minimal snapshot of the track needed to render the player UI on refresh
  const minifyTrack = (track: any) => {
    try {
      return {
        id: track?.id,
        name: track?.name,
        duration_ms: track?.duration_ms,
        album: track?.album
          ? {
              id: track.album.id,
              name: track.album.name,
              images: Array.isArray(track.album.images) ? track.album.images : [],
            }
          : undefined,
        artists: Array.isArray(track?.artists)
          ? track.artists.map((a: any) => ({ id: a.id, name: a.name }))
          : [],
      };
    } catch {
      return track;
    }
  };

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

        // Persist snapshot to localStorage to restore player UI on refresh
        try {
          localStorage.setItem('last_played_track', JSON.stringify(minifyTrack(state.track_window.current_track)));
        } catch {}


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

      // Try to hydrate from localStorage snapshot
      try {
        const raw = localStorage.getItem('last_played_track');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            setCurrentTrack(parsed as any);
            setDuration(parsed.duration_ms || 0);
            setPosition(0);
            setIsPlaying(false);
            return;
          }
        }
      } catch {}

      // Fallback: fetch user's recently played track (no autoplay)
      try {
        const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          const item = data?.items?.[0]?.track;
          if (item && item.id) {
            setCurrentTrack(item as any);
            setDuration(item.duration_ms || 0);
            setPosition(0);
            setIsPlaying(false);
            try {
              localStorage.setItem('last_played_track', JSON.stringify(minifyTrack(item)));
            } catch {}
          }
        }
      } catch {}
    };

    prefillLastPlayed();
  }, [accessToken, currentTrack, deviceId, isReady]);

  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<Set<string>>(new Set());

  // Helper to hydrate state from /me/player
  const fetchCurrentPlayback = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        return;
      }
      const playback = await res.json();
      if (playback) {
        setIsPlaying(!!playback.is_playing);
        if (playback.item) {
          setCurrentTrack(playback.item);
          setDuration(playback.item.duration_ms || 0);
          try {
            localStorage.setItem('last_played_track', JSON.stringify(minifyTrack(playback.item)));
          } catch {}
        }
        setPosition(playback.progress_ms || 0);
        if (playback.device) {
          setActiveDeviceId(playback.device.id || null);
          setActiveDeviceName(playback.device.name || null);
        }
      }
    } catch (e) {
      // silent
    }
  };

  const refreshPlayback = async () => {
    await fetchCurrentPlayback();
    await refreshDevices();
  };

  // Smart polling: refresh devices and playback when remote playback or inactive local
  useEffect(() => {
    if (!accessToken || !isReady) {
      return;
    }

    let intervalId: number | null = null;

    const start = () => {
      const isHidden = typeof document !== 'undefined' && (document as any).hidden;
      if (isHidden) {
        return;
      }
      const isRemote = !!activeDeviceId && activeDeviceId !== deviceId;
      const period = isRemote ? 10000 : 30000; // 10s when remote, 30s otherwise
      intervalId = window.setInterval(async () => {
        await fetchCurrentPlayback();
        await refreshDevices();
      }, period);
    };

    // kick a first refresh when starting
    (async () => {
      await fetchCurrentPlayback();
      await refreshDevices();
      start();
    })();

    const handleVisibility = async () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      if (!document.hidden) {
        await fetchCurrentPlayback();
        await refreshDevices();
        start();
      }
    };
    const handleFocus = handleVisibility;

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [accessToken, isReady, deviceId, activeDeviceId]);

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
        // Spotify API does not support offset for ARTIST context. If a specific track URI is provided,
        // play just that track. Otherwise, play the artist context.
        body = uri && uri.trim() !== ''
          ? { uris: [uri] }
          : { context_uri: contextUri };
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
          try {
            localStorage.setItem('last_played_track', JSON.stringify(minifyTrack(trackData.item)));
          } catch {}
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
      setActiveDeviceName(active ? active.name : null);
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
    if (!accessToken) {
      return;
    }

    try {
      const target = activeDeviceId || deviceId;
      const response = await fetch(`https://api.spotify.com/v1/me/player/pause${target ? `?device_id=${target}` : ''}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
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

      // For local device, also pause SDK to keep state in sync
      if (player && deviceId && (!activeDeviceId || activeDeviceId === deviceId)) {
        await player.pause();
      }
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  };

  const resumeTrack = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const target = activeDeviceId || deviceId;
      const res = await fetch(`https://api.spotify.com/v1/me/player/play${target ? `?device_id=${target}` : ''}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to resume track:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        return;
      }
      setUserInteracted(true);
      setIsPlaying(true);
      // For local device, also resume SDK
      if (player && deviceId && (!activeDeviceId || activeDeviceId === deviceId)) {
        await player.resume();
      }
    } catch (e) {
      console.error('Error resuming track:', e);
    }
  };

  const nextTrack = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const target = activeDeviceId || deviceId;
      const res = await fetch(`https://api.spotify.com/v1/me/player/next${target ? `?device_id=${target}` : ''}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to skip to next track:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        return;
      }
      setUserInteracted(true);
    } catch (e) {
      console.error('Error going to next track:', e);
    }
  };

  const previousTrack = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const target = activeDeviceId || deviceId;
      const res = await fetch(`https://api.spotify.com/v1/me/player/previous${target ? `?device_id=${target}` : ''}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to go to previous track:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        return;
      }
      setUserInteracted(true);
    } catch (e) {
      console.error('Error going to previous track:', e);
    }
  };

  const seekToPosition = async (position: number) => {
    if (!accessToken) {
      return;
    }
    try {
      const target = activeDeviceId || deviceId;
      const res = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}${target ? `&device_id=${target}` : ''}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to seek position:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        return;
      }
      setUserInteracted(true);
      // For local device, also update SDK position
      if (player && deviceId && (!activeDeviceId || activeDeviceId === deviceId)) {
        await player.seek(position);
      }
    } catch (e) {
      console.error('Error seeking:', e);
    }
  };

  const setVolume = async (volume: number) => {
    setUserInteracted(true);
    const target = activeDeviceId || deviceId;
    // Use API for remote devices; SDK for local
    if (activeDeviceId && activeDeviceId !== deviceId) {
      if (!accessToken) {
        return;
      }
      try {
        await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(volume * 100)}${target ? `&device_id=${target}` : ''}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
      } catch {}
      return;
    }
    if (player) {
      await player.setVolume(volume);
    }
  };

  // Add shuffle method
  const setShuffle = async (shuffleState: boolean) => {
    if (!accessToken) {
      return;
    }

    try {
      const target = activeDeviceId || deviceId;
      const url = `https://api.spotify.com/v1/me/player/shuffle?state=${shuffleState}${target ? `&device_id=${target}` : ''}`;
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
      const target = activeDeviceId || deviceId;
      const url = `https://api.spotify.com/v1/me/player/repeat?state=${mode}${target ? `&device_id=${target}` : ''}`;
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
        activeDeviceName,
        isRemotePlayback: !!activeDeviceId && activeDeviceId !== deviceId,
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
        refreshPlayback,
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
