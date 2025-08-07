// Base types
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

// User types
export interface SpotifyUser {
  id: string;
  display_name: string;
  email?: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  country?: string;
  product?: string;
  type: string;
  uri: string;
}

// Artist types
export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  genres: string[];
  popularity: number;
  type: string;
  uri: string;
}

// Album types
export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  release_date: string;
  total_tracks: number;
  type: string;
  uri: string;
  album_type: string;
}

// Track types
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_playable?: boolean;
  is_local?: boolean;
}

// Playlist types
export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  owner: SpotifyUser;
  tracks: {
    href: string;
    total: number;
    items: SpotifyPlaylistTrack[];
  };
  public: boolean;
  collaborative: boolean;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
}

// API Response types
export interface SpotifyPagedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  href: string;
}

export interface SpotifyRecentlyPlayedResponse {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
    context: {
      uri: string;
      href: string;
      external_urls: SpotifyExternalUrls;
      type: string;
    } | null;
  }>;
  next: string | null;
  cursors: {
    after: string | null;
    before: string | null;
  };
}

// Search types
export interface SpotifySearchResponse {
  tracks?: SpotifyPagedResponse<SpotifyTrack>;
  artists?: SpotifyPagedResponse<SpotifyArtist>;
  albums?: SpotifyPagedResponse<SpotifyAlbum>;
  playlists?: SpotifyPagedResponse<SpotifyPlaylist>;
}

// Error types
export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}
