import axios from 'axios';

export const deletePlaylist = async (
  playlistId: string,
  accessToken: string,
) => {
  try {
    console.log('Deleting playlist:', playlistId);
    
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    
    console.log('Playlist deleted successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
}; 