import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLikedSongs, useAddToLikedSongs, useRemoveFromLikedSongs } from './useLikedSongs';

interface LikedTracksContextData {
  likedTracks: Set<string>;
  isTrackLiked: (trackId: string) => boolean;
  toggleLikeTrack: (trackId: string) => void;
  addLikedTrack: (trackId: string) => void;
  removeLikedTrack: (trackId: string) => void;
}

const LikedTracksContext = createContext<LikedTracksContextData | undefined>(undefined);

export const LikedTracksProvider = ({ children }: { children: ReactNode }) => {
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const { data: likedSongsData } = useLikedSongs();
  const addToLikedSongsMutation = useAddToLikedSongs();
  const removeFromLikedSongsMutation = useRemoveFromLikedSongs();

  useEffect(() => {
    if (likedSongsData) {
      const trackIds = new Set<string>();
      likedSongsData.pages.forEach(page => {
        page.items.forEach((item: any) => {
          if (item.track?.id) {
            trackIds.add(item.track.id);
          }
        });
      });
      setLikedTracks(trackIds);
    }
  }, [likedSongsData]);

  const isTrackLiked = (trackId: string): boolean => {
    return likedTracks.has(trackId);
  };

  const toggleLikeTrack = (trackId: string) => {
    if (likedTracks.has(trackId)) {
      removeFromLikedSongsMutation.mutate([trackId]);
      setLikedTracks(prev => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
    } else {
      // Add to  songs
      addToLikedSongsMutation.mutate([trackId]);
      setLikedTracks(prev => {
        const newSet = new Set(prev);
        newSet.add(trackId);
        return newSet;
      });
    }
  };

  const addLikedTrack = (trackId: string) => {
    addToLikedSongsMutation.mutate([trackId]);
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      newSet.add(trackId);
      return newSet;
    });
  };

  const removeLikedTrack = (trackId: string) => {
    removeFromLikedSongsMutation.mutate([trackId]);
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      newSet.delete(trackId);
      return newSet;
    });
  };

  return (
    <LikedTracksContext.Provider
      value={{
        likedTracks,
        isTrackLiked,
        toggleLikeTrack,
        addLikedTrack,
        removeLikedTrack,
      }}
    >
      {children}
    </LikedTracksContext.Provider>
  );
};

export const useLikedTracks = (): LikedTracksContextData => {
  const context = useContext(LikedTracksContext);
  if (!context) {
    throw new Error('useLikedTracks deve estar dentro de LikedTracksProvider');
  }
  return context;
};

