import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTopArtists } from '../api/queries/top-artists';
import { useAuth } from '../providers/auth-provider';

export const useTopArtists = () => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['topArtists'],
    queryFn: ({ pageParam = 0 }) => fetchTopArtists(accessToken!, 20, pageParam),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
