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
    if (error?.response?.status === 403) {
      console.error('Forbidden: Token may not have the required scopes for top artists');
      // Return empty data structure instead of throwing
      return {
        items: [],
        total: 0,
        limit,
        offset,
        href: null,
        next: null,
        previous: null,
      };
    }
    throw error;
  }
};
