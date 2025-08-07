import { useAuth } from '@/core/auth';
import { PlayerProvider } from '@/features/player';
import { LikedTracksProvider } from '@/app/providers/liked-tracks-provider';
import { MusicPlayer } from '@/features/player/MusicPlayer';

import { PremiumWarning } from '@/app/components/PremiumWarning';

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
