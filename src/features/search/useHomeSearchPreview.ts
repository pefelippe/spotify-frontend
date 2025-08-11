import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../core/auth';
import { fetchSearch } from '../../core/api/queries/search';

export function useHomeSearchPreview() {
  const { accessToken } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewTracks, setPreviewTracks] = useState<any[]>([]);
  const [previewAlbums, setPreviewAlbums] = useState<any[]>([]);
  const [previewArtists, setPreviewArtists] = useState<any[]>([]);
  const [previewUsers, setPreviewUsers] = useState<Array<{ id: string; display_name: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recent_searches');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setRecentSearches(arr.filter((s) => typeof s === 'string'));
        }
      }
    } catch {}
  }, []);

  const addRecentSearch = (q: string) => {
    const value = (q || '').trim();
    if (!value) return;
    setRecentSearches((prev) => {
      const next = [value, ...prev.filter((x) => x.toLowerCase() !== value.toLowerCase())].slice(0, 10);
      try {
        localStorage.setItem('recent_searches', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    const q = searchText.trim();
    if (!q) {
      setPreviewTracks([]);
      setPreviewAlbums([]);
      return;
    }
    searchTimeoutRef.current = window.setTimeout(async () => {
      if (!accessToken) return;
      setIsSearching(true);
      try {
        const res = await fetchSearch(q, accessToken, ['track', 'album', 'artist', 'playlist'], 5, 0);
        setPreviewTracks(res.tracks?.items || []);
        setPreviewAlbums(res.albums?.items || []);
        setPreviewArtists(res.artists?.items || []);
        // Derive users from playlist owners
        const owners: Record<string, string> = {};
        const playlists = res.playlists?.items || [];
        for (const p of playlists) {
          const ownerId = p?.owner?.id;
          const ownerName = p?.owner?.display_name;
          if (ownerId && ownerName && !owners[ownerId]) {
            owners[ownerId] = ownerName;
          }
        }
        setPreviewUsers(Object.entries(owners).slice(0, 6).map(([id, display_name]) => ({ id, display_name })));
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchText, accessToken]);

  return {
    searchText,
    setSearchText,
    showPreview,
    setShowPreview,
    previewTracks,
    previewAlbums,
    previewArtists,
    previewUsers,
    isSearching,
    recentSearches,
    addRecentSearch,
  } as const;
}

