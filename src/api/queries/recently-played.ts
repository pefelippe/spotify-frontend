import axios from 'axios';

export const fetchRecentlyPlayed = async (accessToken: string, limit = 20) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit,
      },
    });



    return response.data;
  } catch (error: any) {
    throw error;
  }
};
