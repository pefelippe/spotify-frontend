import { useAuth } from '@/core/auth';
import { PlayerProvider } from '@/app/providers/player-provider';
import { LikedTracksProvider } from '@/app/providers/liked-tracks-provider';
import { MusicPlayer } from '@/components/MusicPlayer';
import { PremiumWarning } from '@/components/PremiumWarning';

import { PrivateRoutes } from '@/app/routes/private-routes';
import { PublicRoutes } from '@/app/routes/public-routes';

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
