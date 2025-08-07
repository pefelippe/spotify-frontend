import axiosInstance from '../client/axios-config';

export const fetchUserPlaylists = async (accessToken: string, limit = 20, offset = 0) => {
  const response = await axiosInstance.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit,
      offset,
    },
  });
  return response.data;
};
