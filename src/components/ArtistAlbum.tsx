interface ArtistAlbumProps {
  name: string;
  imageUrl?: string;
  releaseDate: string;
  albumType: 'album' | 'single' | 'compilation';
  onClick?: () => void;
  onPlay?: () => void;
  albumId?: string;
}

const defaultImage = 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Album';

const ArtistAlbum = ({ name, imageUrl, releaseDate, albumType, onClick, onPlay, albumId }: ArtistAlbumProps) => {
  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const formatAlbumType = (type: string) => {
    switch (type) {
      case 'album':
        return 'Álbum';
      case 'single':
        return 'Single';
      case 'compilation':
        return 'Compilação';
      default:
        return 'Álbum';
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onPlay) {
      onPlay();
    } else {
      console.warn('⚠️ Função onPlay não foi fornecida para o álbum:', name);
    }
  };

  return (
    <div
      className="group flex flex-col cursor-pointer w-full transition-all duration-200 hover:bg-gray-800/50 p-3 rounded-lg"
      onClick={onClick}
    >
      {/* Square Album Cover */}
      <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-800 flex items-center justify-center mb-3 relative">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        {/* Play Button - appears on hover */}
        <button
          onClick={handlePlayClick}
          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.287V1.713z"/>
          </svg>
        </button>
      </div>

      {/* Album Info */}
      <div className="flex flex-col">
        <h4 className="text-white text-sm font-medium truncate mb-1">
          {name}
        </h4>
        <p className="text-gray-400 text-xs">
          {formatYear(releaseDate)} • {formatAlbumType(albumType)}
        </p>
      </div>
    </div>
  );
};

export default ArtistAlbum;
