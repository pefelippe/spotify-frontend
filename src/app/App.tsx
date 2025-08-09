import { useAuth } from '../core/auth';
import { PlayerProvider } from '../features/player';
import { LikedTracksProvider } from '../features/liked-songs/liked-tracks-provider';
import { MusicPlayer } from '../features/player/MusicPlayer';

import { PremiumWarning } from '../features/player/components/PremiumWarning';

import { PrivateRoutes } from '../app/routes/private-routes';
import { PublicRoutes } from '../app/routes/public-routes';

function App() {
  const { isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  return (
    <div className="min-h-screen bg-black-bg">
      <LikedTracksProvider>
        <PlayerProvider>
          <PrivateRoutes />
            <MusicPlayer />
          <PremiumWarning />
        </PlayerProvider>
      </LikedTracksProvider>
    </div>
  );
}

export default App;
