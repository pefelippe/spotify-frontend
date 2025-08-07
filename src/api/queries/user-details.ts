import axios from 'axios';

export const fetchUserProfile = async (userId: string, accessToken: string) => {
  const response = await axios.get(`https://api.spotify.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const fetchUserPlaylists = async (userId: string, accessToken: string, limit = 20, offset = 0) => {
  const response = await axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
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
