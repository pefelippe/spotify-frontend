import axios from 'axios';

export const deletePlaylist = async (
  playlistId: string,
  accessToken: string,
) => {
  try {
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};
