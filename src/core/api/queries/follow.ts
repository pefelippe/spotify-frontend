import axiosInstance from '../client/axios-config';

export const checkIsFollowingArtists = async (
  accessToken: string,
  artistIds: string[],
): Promise<boolean[]> => {
  const res = await axiosInstance.get('https://api.spotify.com/v1/me/following/contains', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { type: 'artist', ids: artistIds.join(',') },
  });
  return res.data as boolean[];
};

export const followArtists = async (
  accessToken: string,
  artistIds: string[],
): Promise<void> => {
  await axiosInstance.put(
    'https://api.spotify.com/v1/me/following',
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: { type: 'artist', ids: artistIds.join(',') },
    },
  );
};

export const unfollowArtists = async (
  accessToken: string,
  artistIds: string[],
): Promise<void> => {
  await axiosInstance.delete('https://api.spotify.com/v1/me/following', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    params: { type: 'artist', ids: artistIds.join(',') },
  });
};

