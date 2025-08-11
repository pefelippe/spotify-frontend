import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomeSearchPreview } from './useHomeSearchPreview';
import { usePlayer } from '../../features/player';

export const SearchInput: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchText,
    setSearchText,
    showPreview,
    setShowPreview,
    previewTracks,
    previewAlbums,
    previewArtists,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useHomeSearchPreview();
  // Keep player available if later we want inline play on preview
  // const { playTrack, isReady, deviceId } = usePlayer();

  const { playTrack, isReady, deviceId } = usePlayer();

  return (
    <div className="w-full ">
      <div className="relative max-w-xl mx-auto">
        <div className="absolute z-999 left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</div>
        <input
          type="search"
          placeholder="O que você deseja ouvir hoje?"
          className="w-full bg-[rgb(30,30,30)]/60 border-2 border-gray-700 focus:border-white transition-colors rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 outline-none"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.currentTarget.value);
            setShowPreview(true);
          }}
          onFocus={() => setShowPreview(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = searchText.trim();
              if (value) {
                navigate(`/search?q=${encodeURIComponent(value)}`);
                addRecentSearch(value);
                setShowPreview(false);
              }
            }
            if (e.key === 'Escape') {
              setShowPreview(false);
            }
          }}
          onBlur={(e) => {
            // Do not close when clicking inside the preview dropdown
            const next = e.relatedTarget as HTMLElement | null;
            if (next && next.closest && next.closest('[data-search-preview]')) {
              return;
            }
            setTimeout(() => setShowPreview(false), 120);
          }}
        />

        {showPreview && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-800 bg-black/90 backdrop-blur-sm shadow-xl overflow-hidden" data-search-preview>
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-800">
              {(!searchText.trim() && recentSearches.length > 0) && (
                <div className="py-2">
                  <div className="px-3 flex items-center justify-between mb-2">
                    <div className="text-xs uppercase tracking-wide text-gray-400">Buscas recentes</div>
                    <button
                      className="text-xs text-gray-400 hover:text-white cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => clearRecentSearches()}
                    >
                      Limpar tudo
                    </button>
                  </div>
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 text-left"
                    >
                      <button
                        className="flex-1 flex items-center gap-3 cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchText(term);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                          addRecentSearch(term);
                          // keep preview open on selection
                        }}
                      >
                        <span className="text-gray-400">🔍</span>
                        <span className="text-white">{term}</span>
                      </button>
                      <button
                        className="text-gray-400 hover:text-white text-sm px-2"
                        aria-label={`Remover ${term} das buscas recentes`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => removeRecentSearch(term)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {previewTracks.length > 0 && (
                <div className="py-2">
                  <div className="px-3 text-xs uppercase tracking-wide text-gray-400 mb-2">Músicas</div>
                  {previewTracks.map((t: any) => (
                    <div
                      key={t.id}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 text-left"
                      tabIndex={0}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <img src={t.album?.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'} alt={t.name} className="w-10 h-10 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm truncate">{t.name}</div>
                        <div className="text-gray-400 text-xs truncate">{(t.artists || []).map((a: any) => a.name).join(', ')}</div>
                      </div>
                      <button
                        className="ml-auto bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center leading-none shadow cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (!isReady || !deviceId) return;
                          const trackUri = t.uri || `spotify:track:${t.id}`;
                          playTrack(trackUri);
                        }}
                        aria-label="Reproduzir"
                      >
                        <span className="text-base">▶</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {previewAlbums.length > 0 && (
                <div className="py-2">
                  <div className="px-3 text-xs uppercase tracking-wide text-gray-400 mb-2">Álbuns</div>
                  {previewAlbums.map((a: any) => (
                    <div
                      key={a.id}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 text-left cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => navigate(`/album/${a.id}`)}
                    >
                      <img src={a.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'} alt={a.name} className="w-10 h-10 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm truncate">{a.name}</div>
                        <div className="text-gray-400 text-xs truncate">{(a.artists || []).map((ar: any) => ar.name).join(', ')}</div>
                      </div>
                      <button
                        className="ml-auto bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center leading-none shadow cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isReady || !deviceId) return;
                          playTrack('', a.uri);
                        }}
                        aria-label="Reproduzir álbum"
                      >
                        <span className="text-base">▶</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {previewArtists.length > 0 && (
                <div className="py-2">
                  <div className="px-3 text-xs uppercase tracking-wide text-gray-400 mb-2">Artistas</div>
                  {previewArtists.map((a: any) => (
                    <div
                      key={a.id}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 text-left cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => navigate(`/artist/${a.id}`)}
                    >
                      <img src={a.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-sm truncate">{a.name}</div>
                        <div className="text-gray-400 text-xs truncate">Artista</div>
                      </div>
                      <button
                        className="ml-auto bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center leading-none shadow cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isReady || !deviceId) return;
                          playTrack('', `spotify:artist:${a.id}`);
                        }}
                        aria-label="Reproduzir artista"
                      >
                        <span className="text-base">▶</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {searchText.trim() && (
                <button
                  className="w-full px-3 py-3 text-sm text-white hover:bg-white/5 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
                    addRecentSearch(searchText.trim());
                    // keep preview open to continue searching
                  }}
                >
                  Ver todos os resultados para "{searchText.trim()}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;

