import axios from 'axios';

export const fetchArtistTopTracks = async (artistId: string, accessToken: string, market = 'BR') => {
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      market,
    },
  });
  return response.data;
};
