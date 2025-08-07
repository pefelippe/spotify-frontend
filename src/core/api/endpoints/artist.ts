export const artistEndpoints = {
  // Get artist by ID
  artist: (artistId: string) => `/artists/${artistId}`,
  
  // Get artist's albums
  artistAlbums: (artistId: string) => `/artists/${artistId}/albums`,
  
  // Get artist's top tracks
  artistTopTracks: (artistId: string) => `/artists/${artistId}/top-tracks`,
  
  // Get artist's related artists
  relatedArtists: (artistId: string) => `/artists/${artistId}/related-artists`,
  
  // Search for artists
  search: () => '/search',
} as const; 