import { useAuth } from './providers/auth-provider';
import { PlayerProvider } from './providers/player-provider';
import { LikedTracksProvider } from './providers/liked-tracks-provider';
import { MusicPlayer } from '../components/MusicPlayer';
import { PremiumWarning } from '../components/PremiumWarning';

import { PrivateRoutes } from './routes/private-routes';
import { PublicRoutes } from './routes/public-routes';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  return (
    <LikedTracksProvider>
      <PlayerProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#090707' }}>
          <PrivateRoutes />
          <MusicPlayer />
          <PremiumWarning />
        </div>
      </PlayerProvider>
    </LikedTracksProvider>
  );
}

export default App;
