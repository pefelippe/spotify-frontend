import { useQuery } from '@tanstack/react-query';
import { fetchRecentlyPlayed } from '@/core/api/queries/recently-played';
import { useAuth } from '@/core/auth';

export const useRecentlyPlayed = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['recentlyPlayed'],
    queryFn: () => fetchRecentlyPlayed(accessToken!, 20),
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
