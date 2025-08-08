import axios from 'axios';

export const removeTrackFromPlaylist = async (
  playlistId: string,
  trackUri: string,
  accessToken: string,
) => {
  try {
    console.log('Removing track from playlist:', { playlistId, trackUri });
    
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          tracks: [{ uri: trackUri }],
        },
      },
    );
    
    console.log('Track removed successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error removing track from playlist:', error);
    throw error;
  }
}; 