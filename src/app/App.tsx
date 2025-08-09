import { useAuth } from '../core/auth';
import { PlayerProvider } from '../features/player';
import { LikedTracksProvider } from '../features/liked-songs/liked-tracks-provider';
import { MusicPlayer } from '../features/player/MusicPlayer';

import { PremiumWarning } from '../features/player/components/PremiumWarning';

import { PrivateRoutes } from '../app/routes/private-routes';
import { PublicRoutes } from '../app/routes/public-routes';

function App() {
  const { isAuthenticated, accessToken, tokenScopes, logout } = useAuth();

  const hasTokenButMissingScopes = accessToken && tokenScopes && !isAuthenticated;

  if (hasTokenButMissingScopes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090707] text-white p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Permissões Atualizadas Necessárias</h1>
          <p className="mb-6 text-gray-300">
            O aplicativo foi atualizado e agora requer permissões adicionais para funcionar corretamente. 
            Por favor, faça login novamente para conceder as novas permissões.
          </p>
          <button
            onClick={logout}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Fazer Login Novamente
          </button>
        </div>
      </div>
    );
  }

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
