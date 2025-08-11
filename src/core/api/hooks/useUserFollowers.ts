import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { fetchUserFollowers } from '../queries/user-followers';

export const useUserFollowers = (userId: string) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['userFollowers', userId],
    queryFn: async () => fetchUserFollowers(accessToken!, userId),
    enabled: !!accessToken && !!userId,
    staleTime: 60 * 1000,
    retry: false,
  });
};

