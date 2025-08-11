interface ArtistItemProps {
  name: string;
  imageUrl?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const defaultImage = 'https://via.placeholder.com/150x150/1DB954/FFFFFF?text=Artist';

export const ArtistItem = ({ name, imageUrl, onClick, size = 'md' }: ArtistItemProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors duration-200"
    >
      {/* Artist Image */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-800 flex-shrink-0`}>
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
      </div>

      {/* Artist Name */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-white font-semibold ${textSizeClasses[size]} truncate`}>
          {name}
        </h3>
      </div>
    </div>
  );
};

export default ArtistItem;
