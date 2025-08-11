import axios from 'axios';

export const updatePlaylistDetails = async (
  playlistId: string,
  accessToken: string,
  payload: { name?: string; description?: string; public?: boolean },
) => {
  try {
    const response = await axios.put(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

