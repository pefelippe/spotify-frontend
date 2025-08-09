import spotifyLogo from '../../assets/spotify-logo.png';

export const Logo = ( { className, onClick }: { className: string, onClick?: () => void } ) => {
  return (
    <img
      src={spotifyLogo}
      alt="Spotify"
      className={className}
      onClick={onClick}
    />
  );
};
