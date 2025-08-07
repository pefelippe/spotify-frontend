export const albumEndpoints = {
  // Get album by ID
  album: (albumId: string) => `/albums/${albumId}`,

  // Get album tracks
  albumTracks: (albumId: string) => `/albums/${albumId}/tracks`,

  // Get several albums
  albums: () => '/albums',

  // Search for albums
  search: () => '/search',
} as const;
