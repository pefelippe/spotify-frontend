import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchAlbumDetails, fetchAlbumTracks } from '../../core/api/queries/album-details';
import { useAuth } from '../../core/auth';

export const useAlbumDetails = (albumId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['albumDetails', albumId],
    queryFn: () => fetchAlbumDetails(albumId, accessToken!),
    enabled: !!accessToken && !!albumId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAlbumTracks = (albumId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['albumTracks', albumId],
    queryFn: ({ pageParam = 0 }) => fetchAlbumTracks(albumId, accessToken!, 50, pageParam),
    enabled: !!accessToken && !!albumId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 50;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
