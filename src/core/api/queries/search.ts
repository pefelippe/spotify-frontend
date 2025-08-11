import axios from 'axios';
import type { SpotifySearchResponse } from '../../api/types/spotify';

export const fetchSearch = async (
  q: string,
  accessToken: string,
  types: Array<'track' | 'album'> = ['track', 'album'],
  limit = 20,
  offset = 0,
): Promise<SpotifySearchResponse> => {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q,
      type: types.join(','),
      limit,
      offset,
      market: 'from_token',
    },
  });
  return response.data as SpotifySearchResponse;
};

