import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserProfile, fetchUserPlaylists } from '../core/api/queries/user-details';
import { useAuth } from '../app/providers/auth-provider';

export const useUserDetails = (userId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId, accessToken!),
    enabled: !!accessToken && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUserPublicPlaylists = (userId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['userPlaylists', userId],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists(userId, accessToken!, 20, pageParam),
    enabled: !!accessToken && !!userId,
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
