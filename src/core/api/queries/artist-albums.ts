import axios from 'axios';

export const fetchArtistAlbums = async (artistId: string, accessToken: string, limit = 20, offset = 0, includeGroups = 'album,single,appears_on,compilation') => {
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit,
      offset,
      include_groups: includeGroups,
    },
  });
  return response.data;
};
