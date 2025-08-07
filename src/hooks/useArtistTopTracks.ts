import { useQuery } from '@tanstack/react-query';
import { fetchArtistTopTracks } from '../api/queries/artist-top-tracks';
import { useAuth } from '../providers/auth-provider';

export const useArtistTopTracks = (artistId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['artistTopTracks', artistId],
    queryFn: () => fetchArtistTopTracks(artistId, accessToken!),
    enabled: !!accessToken && !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
