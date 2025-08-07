import axios from 'axios';

export const fetchAlbumDetails = async (albumId: string, accessToken: string) => {
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const fetchAlbumTracks = async (albumId: string, accessToken: string, limit = 50, offset = 0) => {
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
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
