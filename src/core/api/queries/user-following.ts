import axiosInstance from '../client/axios-config';

export interface FollowedArtistsResponse {
  artists: {
    items: Array<any>;
    next: string | null;
    cursors?: { after?: string };
    total?: number;
  };
}

export const fetchFollowingArtists = async (
  accessToken: string,
  limit = 20,
  after?: string,
): Promise<FollowedArtistsResponse> => {
  const res = await axiosInstance.get('https://api.spotify.com/v1/me/following', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { type: 'artist', limit, ...(after ? { after } : {}) },
  });
  return res.data as FollowedArtistsResponse;
};

