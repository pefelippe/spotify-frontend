export const playlistEndpoints = {
  // Get playlist by ID
  playlist: (playlistId: string) => `/playlists/${playlistId}`,

  // Get playlist tracks
  playlistTracks: (playlistId: string) => `/playlists/${playlistId}/tracks`,

  // Create playlist
  createPlaylist: (userId: string) => `/users/${userId}/playlists`,

  // Add tracks to playlist
  addTracksToPlaylist: (playlistId: string) => `/playlists/${playlistId}/tracks`,

  // Remove tracks from playlist
  removeTracksFromPlaylist: (playlistId: string) => `/playlists/${playlistId}/tracks`,

  // Update playlist details
  updatePlaylist: (playlistId: string) => `/playlists/${playlistId}`,

  // Get featured playlists
  featuredPlaylists: () => '/browse/featured-playlists',

  // Get category playlists
  categoryPlaylists: (categoryId: string) => `/browse/categories/${categoryId}/playlists`,
} as const;
