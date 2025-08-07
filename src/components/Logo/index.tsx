
import spotifyLogo from '../../assets/spotify-logo.png';
export const Logo = ( { className }: { className: string } ) => {
  return (
    <img
      src={spotifyLogo}
      alt="Spotify"
      className={className}
    />
  );
};
