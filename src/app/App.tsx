import { useAuth } from '../core/auth';
import { MusicPlayer } from '../features/player/MusicPlayer';

import { PremiumWarning } from '../features/player/components/PremiumWarning';

import { PrivateRoutes } from './routes/private';
import { PublicRoutes } from './routes/public';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PublicRoutes />;
  }

  return (
    <>
      <PrivateRoutes />
      <MusicPlayer />
      <PremiumWarning />
    </>
  );
}

export default App;
