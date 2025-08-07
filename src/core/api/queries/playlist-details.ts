import axios from 'axios';

export const fetchPlaylistDetails = async (playlistId: string, accessToken: string) => {
  const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const fetchPlaylistTracks = async (playlistId: string, accessToken: string, limit = 50, offset = 0) => {
  const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
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
