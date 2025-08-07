import axios from 'axios';

export const createPlaylist = async (
  userId: string,
  name: string,
  accessToken: string,
) => {
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
  return response.data;
};
