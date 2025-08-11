import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../queries/user-profile';
import { useAuth } from '../../auth';

export const useUserProfile = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchUserProfile(accessToken!),
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
