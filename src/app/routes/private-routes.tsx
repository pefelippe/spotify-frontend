import { Routes, Route } from 'react-router-dom';

import { Sidebar } from '@/app/components/Sidebar';
import { MobileHeader } from '@/app/layout/MobileHeader';
import { BottomNavigation } from '@/app/components/BottomNavigation';

import Home from '@/app/pages/private/home';
import Perfil from '@/app/pages/private/profile';
import Artistas from '@/app/pages/private/artists';
import Playlists from '@/app/pages/private/playlist';
import UserProfile from '@/app/pages/private/user-profile';
import AlbumDetalhes from '@/app/pages/private/album-details';
import ArtistaDetalhes from '@/app/pages/private/artists-details';
import PlaylistDetalhes from '@/app/pages/private/playlist-details';

interface ProtectedRouteConfig {
    path: string;
    component: React.ComponentType;
  }

export const privateRoutes: ProtectedRouteConfig[] = [
    { path: '/', component: Home },
    { path: '/artists', component: Artistas },
    { path: '/artist/:artistId', component: ArtistaDetalhes },
    { path: '/album/:albumId', component: AlbumDetalhes },
    { path: '/playlists', component: Playlists },
    { path: '/playlists/liked-songs', component: Playlists },
    { path: '/playlist/:playlistId', component: PlaylistDetalhes },
    { path: '/profile', component: Perfil },
    { path: '/user/:userId', component: UserProfile },
  ];

export const PrivateRoutes: React.FC = () => {
  return (
    <>
      <MobileHeader />
      <Sidebar />
      <Routes>
        {privateRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <div className="flex justify-center flex-1 lg:ml-[250px] pt-16 lg:pt-0 ">
                <Component />
              </div>
            }
          />
        ))}
      </Routes>
      <BottomNavigation />
    </>
  );
};
