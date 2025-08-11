import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { fetchFollowingArtists } from '../queries/user-following';

export const useUserFollowingArtists = (enabled = true, pageSize = 20) => {
  const { accessToken } = useAuth();
  return useInfiniteQuery({
    queryKey: ['followingArtists', pageSize],
    queryFn: async ({ pageParam }: { pageParam?: string }) => fetchFollowingArtists(accessToken!, pageSize, pageParam),
    enabled: !!accessToken && enabled,
    getNextPageParam: (lastPage) => lastPage?.artists?.cursors?.after,
    initialPageParam: undefined as string | undefined,
    staleTime: 60 * 1000,
  });
};

