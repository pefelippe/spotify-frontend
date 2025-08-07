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
    throw error;
  }
};
