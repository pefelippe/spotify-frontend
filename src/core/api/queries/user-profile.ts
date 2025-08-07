import axiosInstance from '../client/axios-config';

export const fetchUserProfile = async (accessToken: string) => {
  const response = await axiosInstance.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
