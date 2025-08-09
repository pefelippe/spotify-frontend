import { useQuery } from '@tanstack/react-query';
import { fetchArtistDetails } from '../../core/api/queries/artist-details';
import { useAuth } from '../../core/auth';

export const useArtistDetails = (artistId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['artistDetails', artistId],
    queryFn: () => fetchArtistDetails(artistId, accessToken!),
    enabled: !!accessToken && !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
