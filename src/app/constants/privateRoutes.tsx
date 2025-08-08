import Home from '@/app/pages/private/home';
import Perfil from '@/app/pages/private/profile';
import Artistas from '@/app/pages/private/artists';
import Playlists from '@/app/pages/private/playlist';
import UserProfile from '@/app/pages/private/user-details';
import AlbumDetalhes from '@/app/pages/private/album-details';
import ArtistaDetalhes from '@/app/pages/private/artists-details';
import PlaylistDetalhes from '@/app/pages/private/playlist-details';
import LikedSongs from '@/app/pages/private/liked-songs';

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
  ];