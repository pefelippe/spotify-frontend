export interface PlayerContextData {
  player: SpotifyPlayer | null;
  isReady: boolean;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  deviceId: string | null;
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
}
