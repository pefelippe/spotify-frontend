import React from 'react';
import { formatDatePtBR } from '../../../utils/formatDatePtBR';

interface AlbumHeaderProps {
  album: any;
  primaryArtist?: any;
  onClickArtist: (artistId: string) => void;
  totalDurationText?: string;
}

export const AlbumHeader: React.FC<AlbumHeaderProps> = ({ album, primaryArtist, onClickArtist, totalDurationText }) => {
  if (!album) {
    return null;
  }

  const albumTypeLabel =
    album.album_type === 'album'
      ? 'Álbum'
      : album.album_type === 'single'
      ? 'Single'
      : album.album_type;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <img
        src={album.images?.[0]?.url || ''}
        alt={album.name}
        className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl"
      />
      <div className="flex-1 text-center md:text-left">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">{albumTypeLabel}</p>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white-text mb-4">{album.name}</h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1 mb-2">
          <div className="flex items-center space-x-2">
            {primaryArtist?.images?.[0]?.url ? (
              <img
                src={primaryArtist.images[0].url}
                alt={album.artists?.[0]?.name || 'Artista'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-600" />
            )}
            <span
              className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
              onClick={() => onClickArtist(album.artists?.[0]?.id)}
            >
              {album.artists?.[0]?.name}
            </span>
          </div>
          <span>•</span>
          <span>{formatDatePtBR(album.release_date)}</span>
          {totalDurationText ? (
            <>
              <span>•</span>
              <span>{totalDurationText}</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AlbumHeader;

