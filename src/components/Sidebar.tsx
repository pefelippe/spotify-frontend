
import { CustomButton } from './CustomButton';
import { Logo } from './Logo';
import { NavigationButton } from './NavigationButton';
import { HomeIcon, ArtistIcon, PlaylistIcon, UserIcon, DownloadIcon } from './SpotifyIcons';
import { usePWA } from '@/hooks/usePWA';

export const SidebarItems = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Artistas', path: '/artists', icon: ArtistIcon },
  { name: 'Playlists', path: '/playlists', icon: PlaylistIcon },
  { name: 'Perfil', path: '/profile', icon: UserIcon },
];

export const Sidebar = () => {
  const { installApp } = usePWA();

  const handleInstallClick = async () => {
    await installApp();
  };

  return (
    <div className="w-[250px] fixed top-0 left-0 h-screen flex-col hidden lg:flex animate-slide-in-left border-r border-gray-800/50" style={{ backgroundColor: '#000000' }}>
      <div className="p-6 border-b border-gray-800/30">
        <Logo className="w-[170px] h-[42px] object-contain mx-auto" />
      </div>

      <div className="flex-1 px-3 flex items-start justify-start">
        <nav className="space-y-2 w-full">
          {SidebarItems.map((item) => (
            <NavigationButton
              key={item.name}
              name={item.name}
              path={item.path}
              icon={item.icon}
              baseClassName="w-full flex items-start justify-start gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-out font-medium cursor-pointer group"
              activeClassName="text-white-text bg-gray-800/60 shadow-sm"
              inactiveClassName="text-gray-400 hover:text-white-text hover:bg-gray-800/30"
            />
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-800/30">
        <CustomButton
          label="Instalar PWA"
          icon={<DownloadIcon size={18} />}
          onClick={handleInstallClick}
          variant="pwa"
          className="w-full justify-start"
        />
      </div>
    </div>
  );
};
