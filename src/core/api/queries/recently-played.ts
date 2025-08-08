import axiosInstance from '../client/axios-config';

export const fetchRecentlyPlayed = async (accessToken: string, limit = 10) => {
  try {
    const response = await axiosInstance.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit,
      },
    });

    console.log('Recently played data fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recently played:', error);
    if (error?.response?.status === 401) {
      console.error('Unauthorized - token might be expired');
    }
    throw error;
  }
};
