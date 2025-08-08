import axios from 'axios';

export const createPlaylist = async (
  userId: string,
  name: string,
  accessToken: string,
) => {
  try {
    console.log('Creating playlist with:', { userId, name });
    
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name,
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    
    console.log('Playlist created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating playlist:', error);
    console.error('Error details:', {
      status: error?.response?.status,
      message: error?.response?.data,
      userId,
      name,
    });
    throw error;
  }
};
