import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTopArtists } from '../queries/top-artists';
import { useAuth } from '../../auth';

export const useTopArtists = () => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['topArtists'],
    queryFn: ({ pageParam = 0 }) => fetchTopArtists(accessToken!, 20, pageParam),
    enabled: !!accessToken,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 20;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
