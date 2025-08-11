export interface PlayerContextData {
  player: SpotifyPlayer | null;
  isReady: boolean;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  deviceId: string | null;
  activeDeviceId: string | null;
  activeDeviceName: string | null;
  isRemotePlayback: boolean;
  availableDevices: SpotifyDevice[];
  isPremiumRequired: boolean;
  userInteracted: boolean;
  resetPremiumWarning: () => void;
  playTrack: (uri: string, contextUri?: string) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seekToPosition: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  refreshDevices: () => Promise<void>;
  transferPlayback: (deviceId: string, play?: boolean) => Promise<void>;
  refreshPlayback: () => Promise<void>;
  hasTrack: boolean;
  // Add new methods for shuffle and repeat
  setShuffle: (shuffleState: boolean) => Promise<void>;
  setRepeat: (repeatMode: 'track' | 'context' | 'off') => Promise<void>;
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_restricted: boolean;
  name: string;
  type: 'Computer' | 'Tablet' | 'Smartphone' | 'Speaker' | 'TV' | 'AVR' | 'STB' | 'AudioDongle' | string;
  volume_percent: number | null;
}
