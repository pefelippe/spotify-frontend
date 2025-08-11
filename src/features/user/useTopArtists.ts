import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTopArtists } from '../../core/api/queries/top-artists';
import { useAuth } from '../../core/auth';

export const useTopArtists = () => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['topArtists'],
    queryFn: ({ pageParam = 0 }) => fetchTopArtists(accessToken!, 20, pageParam),
    enabled: !!accessToken,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 20; // offset for next page
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
