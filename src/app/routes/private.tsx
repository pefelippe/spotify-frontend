import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

import { Sidebar } from '../components/Sidebar';
import { MobileHeader } from '../layout/MobileHeader';
import { BottomNavigation } from '../components/BottomNavigation';

import Home from '../pages/private/home';
import Perfil from '../pages/private/profile';
import Artistas from '../pages/private/artists';
import Playlists from '../pages/private/playlist';
import UserProfile from '../pages/private/user-details';
import AlbumDetalhes from '../pages/private/album-details';
import ArtistaDetalhes from '../pages/private/artists-details';
import PlaylistDetalhes from '../pages/private/playlist-details';
import LikedSongs from '../pages/private/liked-songs';
import SearchPage from '../pages/private/search';

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
    { path: '/playlists/liked-songs', component: LikedSongs },
    { path: '/playlist/:playlistId', component: PlaylistDetalhes },
    { path: '/profile', component: Perfil },
    { path: '/user/:userId', component: UserProfile },
  { path: '/search', component: SearchPage },
  ];

export const PrivateRoutes: React.FC = () => {
  return (
    <>
      <MobileHeader />
      <ScrollToTop />
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
