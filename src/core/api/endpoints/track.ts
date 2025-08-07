export const trackEndpoints = {
  // Get track by ID
  track: (trackId: string) => `/tracks/${trackId}`,
  
  // Get several tracks
  tracks: () => '/tracks',
  
  // Get track audio features
  audioFeatures: (trackId: string) => `/audio-features/${trackId}`,
  
  // Get audio analysis
  audioAnalysis: (trackId: string) => `/audio-analysis/${trackId}`,
  
  // Search for tracks
  search: () => '/search',
} as const; 