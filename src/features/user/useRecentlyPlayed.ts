import { useQuery } from '@tanstack/react-query';
import { fetchRecentlyPlayed } from '@/core/api/queries/recently-played';
import { useAuth } from '@/core/auth';

export const useRecentlyPlayed = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['recentlyPlayed'],
    queryFn: () => fetchRecentlyPlayed(accessToken!, 20),
    enabled: !!accessToken,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
