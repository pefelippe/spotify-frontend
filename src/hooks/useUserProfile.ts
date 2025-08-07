import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../core/api/queries/user-profile';
import { useAuth } from '@/core/auth';

export const useUserProfile = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchUserProfile(accessToken!),
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
