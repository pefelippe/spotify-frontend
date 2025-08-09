import { spotifyClient } from '../client/spotify-client';
import { userEndpoints } from '../endpoints/user';
import type { SpotifyUser, SpotifyPagedResponse, SpotifyPlaylist } from '../types/spotify';

export const fetchUserProfile = async (userId: string): Promise<SpotifyUser> => {
  return spotifyClient.get<SpotifyUser>(userEndpoints.userProfile(userId));
};

export const fetchUserPlaylists = async (
  userId: string,
  limit = 20,
  offset = 0,
): Promise<SpotifyPagedResponse<SpotifyPlaylist>> => {
  return spotifyClient.get<SpotifyPagedResponse<SpotifyPlaylist>>(
    userEndpoints.userPlaylists(userId),
    {
      params: {
        limit,
        offset,
      },
    },
  );
};

export const fetchCurrentUserProfile = async (): Promise<SpotifyUser> => {
  return spotifyClient.get<SpotifyUser>(userEndpoints.profile());
};

export const fetchCurrentUserPlaylists = async (
  limit = 20,
  offset = 0,
): Promise<SpotifyPagedResponse<SpotifyPlaylist>> => {
  return spotifyClient.get<SpotifyPagedResponse<SpotifyPlaylist>>(
    userEndpoints.myPlaylists(),
    {
      params: {
        limit,
        offset,
      },
    },
  );
};
