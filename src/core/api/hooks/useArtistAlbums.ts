import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchArtistAlbums } from '../queries/artist-albums';
import { useAuth } from '../../auth';

export const useArtistDiscography = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistDiscography', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 50, pageParam, 'album,single'),
    enabled: !!accessToken && !!artistId,
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

export const useArtistAlbums = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistAlbums', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 20, pageParam, 'album'),
    enabled: !!accessToken && !!artistId,
    staleTime: 30 * 60 * 1000, // 30 minutes
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

export const useArtistSingles = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistSingles', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 20, pageParam, 'single'),
    enabled: !!accessToken && !!artistId,
    staleTime: 30 * 60 * 1000,
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

export const useArtistCollaborations = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistCollaborations', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 20, pageParam, 'appears_on'),
    enabled: !!accessToken && !!artistId,
    staleTime: 30 * 60 * 1000,
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
