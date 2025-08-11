import axios from 'axios';

export const createPlaylist = async (
  userId: string,
  name: string,
  accessToken: string,
) => {
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name,
        description: 'Adicione uma descrição',
        public: false,
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
    console.error('Error creating playlist:', error);
    throw error;
  }
};
