import axios from 'axios';

export const fetchUserProfile = async (accessToken: string) => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
