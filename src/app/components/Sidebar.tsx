
import { useNavigate } from 'react-router-dom';
import { CustomButton } from './CustomButton';
import { NavigationButton } from '../layout/NavigationButton';
import { HomeIcon, ArtistIcon, PlaylistIcon, UserIcon, DownloadIcon, SpotifyLogo } from './SpotifyIcons';
import { usePWA } from '../../core/pwa';

export const SidebarItems = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Artistas', path: '/artists', icon: ArtistIcon },
  { name: 'Playlists', path: '/playlists', icon: PlaylistIcon },
  { name: 'Perfil', path: '/profile', icon: UserIcon },
];

export const Sidebar = () => {
  const { installApp, isInstallable, isInstalled } = usePWA();
  const navigate = useNavigate();
  const handleInstallClick = async () => {
    console.log('[PWA] Install button clicked (Sidebar). isInstallable:', isInstallable, 'isInstalled:', isInstalled);
    const ok = await installApp();
    console.log('[PWA] installApp result:', ok);
  };

  return (
    <div className="w-[250px] fixed top-0 left-0 h-screen flex-col hidden lg:flex animate-slide-in-left border-r border-gray-800/50" style={{ backgroundColor: '#000000' }}>
      <div className="p-6 border-b border-gray-800/30">
        <SpotifyLogo className="w-[170px] h-[50px] object-contain cursor-pointer" onClick={() => navigate('/')}/>
      </div>

      <div className="flex-1 mt-5 px-3 flex items-start justify-start">
        <nav className="flex flex-col gap-4  w-full">
          {SidebarItems.map((item) => (
            <NavigationButton
              key={item.name}
              name={item.name}
              path={item.path}
              icon={item.icon}
              baseClassName="w-full flex items-start justify-start gap-4 px-4 py-2 rounded-lg transition-all duration-200 ease-out font-medium cursor-pointer group"
              activeClassName="text-white-text bg-gray-800/60 shadow-sm"
              inactiveClassName="text-gray-400 hover:text-white-text hover:bg-gray-800/30"
            />
          ))}
        </nav>
      </div>

      {!isInstalled && (
        <div className="p-6 border-t border-gray-800/30">
          <CustomButton
            label="Instalar PWA"
            icon={<DownloadIcon size={18} />}
            onClick={handleInstallClick}
            variant="pwa"
            className="w-full justify-start hidden lg:flex font-[19px]"
          />
        </div>
      )}
    </div>
  );
};
