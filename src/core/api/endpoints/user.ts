export const userEndpoints = {
  // Get current user's profile
  profile: () => '/me',
  
  // Get user profile by ID
  userProfile: (userId: string) => `/users/${userId}`,
  
  // Get user's playlists
  userPlaylists: (userId: string) => `/users/${userId}/playlists`,
  
  // Get current user's playlists
  myPlaylists: () => '/me/playlists',
  
  // Get user's top artists
  topArtists: () => '/me/top/artists',
  
  // Get user's top tracks
  topTracks: () => '/me/top/tracks',
  
  // Get user's recently played tracks
  recentlyPlayed: () => '/me/player/recently-played',
  
  // Get user's liked songs
  likedSongs: () => '/me/tracks',
  
  // Check if tracks are saved
  checkSavedTracks: () => '/me/tracks/contains',
  
  // Save tracks to user's library
  saveTracks: () => '/me/tracks',
  
  // Remove tracks from user's library
  removeTracks: () => '/me/tracks',
  
  // Get user's saved albums
  savedAlbums: () => '/me/albums',
  
  // Check if albums are saved
  checkSavedAlbums: () => '/me/albums/contains',
  
  // Save albums to user's library
  saveAlbums: () => '/me/albums',
  
  // Remove albums from user's library
  removeAlbums: () => '/me/albums',
  
  // Get user's followed artists
  followedArtists: () => '/me/following',
  
  // Follow artists or users
  follow: () => '/me/following',
  
  // Unfollow artists or users
  unfollow: () => '/me/following',
} as const; 