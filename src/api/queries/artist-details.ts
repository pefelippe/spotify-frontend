import axios from 'axios';

export const fetchArtistDetails = async (artistId: string, accessToken: string) => {
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
