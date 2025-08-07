import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserPlaylists } from '../core/api/queries/user-playlists';
import { useAuth } from '../app/providers/auth-provider';

export const useUserPlaylists = () => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['userPlaylists'],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists(accessToken!, 20, pageParam),
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
