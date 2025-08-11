import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserProfile, fetchUserPlaylists } from '../../core/api/queries/user-details';
import { useAuth } from '../../core/auth';

export const useUserDetails = (userId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!accessToken && !!userId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUserPublicPlaylists = (userId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['userPlaylists', userId],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists(userId, 20, pageParam),
    enabled: !!accessToken && !!userId,
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
