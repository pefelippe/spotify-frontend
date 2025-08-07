import axios from 'axios';

export const addTrackToPlaylist = async (
  playlistId: string,
  trackUri: string,
  accessToken: string,
) => {
  const response = await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      uris: [trackUri],
    },
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const removeTrackFromPlaylist = async (
  playlistId: string,
  trackUri: string,
  accessToken: string,
) => {
  const response = await axios.delete(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      data: {
        tracks: [{ uri: trackUri }],
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};
