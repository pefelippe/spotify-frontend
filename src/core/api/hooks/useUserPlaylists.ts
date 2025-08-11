import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserPlaylists } from '../queries/user-playlists';
import { useAuth } from '../../auth';

export const useUserPlaylists = () => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['userPlaylists'],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists(accessToken!, 20, pageParam),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
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
