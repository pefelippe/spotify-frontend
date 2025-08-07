interface AlbumProps {
  name: string;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  albumId?: string;
  onClick?: () => void;
  onPlay?: () => void;
}
const sizeClasses = {
  xs: 'w-16 h-16',
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
};

const defaultImage = 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Album';

const Album = ({ name, imageUrl, size = 'md', onClick, onPlay }: AlbumProps) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div
      className="group flex flex-col items-center space-y-3 cursor-pointer transition-all duration-200 hover:bg-gray-800/50 p-3 rounded-lg"
      onClick={onClick}
    >
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-800 flex items-center justify-center relative`}>
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        {/* Play Button - appears on hover */}
        {onPlay && (
          <button
            onClick={handlePlayClick}
            className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="black">
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.287V1.713z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Album;
