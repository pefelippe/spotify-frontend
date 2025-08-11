import { useQuery } from '@tanstack/react-query';
import { fetchArtistTopTracks } from '../../core/api/queries/artist-top-tracks';
import { useAuth } from '../../core/auth';

export const useArtistTopTracks = (artistId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['artistTopTracks', artistId],
    queryFn: () => fetchArtistTopTracks(artistId, accessToken!),
    enabled: !!accessToken && !!artistId,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
