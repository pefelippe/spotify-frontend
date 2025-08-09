import axiosInstance from '../client/axios-config';

export const fetchLikedSongs = async (accessToken: string, limit = 20, offset = 0) => {
  try {
    const response = await axiosInstance.get('https://api.spotify.com/v1/me/tracks', {
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
    if (error.response?.status === 403) {
      console.error('Forbidden: Token may not have the required scopes for liked songs');
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

export const addToLikedSongs = async (accessToken: string, trackIds: string[]) => {
  try {
    const response = await axiosInstance.put('https://api.spotify.com/v1/me/tracks', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        ids: trackIds.join(','),
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.error('Forbidden: Token may not have the required scopes for adding liked songs');
      throw new Error('Insufficient permissions to add liked songs');
    }
    throw error;
  }
};

export const removeFromLikedSongs = async (accessToken: string, trackIds: string[]) => {
  try {
    const response = await axiosInstance.delete('https://api.spotify.com/v1/me/tracks', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        ids: trackIds.join(','),
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      console.error('Forbidden: Token may not have the required scopes for removing liked songs');
      throw new Error('Insufficient permissions to remove liked songs');
    }
    throw error;
  }
};
