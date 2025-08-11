import axios from 'axios';

export const addTrackToPlaylist = async (
  playlistId: string,
  trackUri: string,
  accessToken: string,
) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: [trackUri],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding track to playlist:', error);
    throw error;
  }
};
