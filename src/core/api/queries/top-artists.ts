import axiosInstance from '../client/axios-config';

export const fetchTopArtists = async (accessToken: string, limit = 20, offset = 0) => {
  try {
    const response = await axiosInstance.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit,
        offset,
      },
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
