import { NavigationButton } from './NavigationButton';
import { DownloadIcon } from './SpotifyIcons';
import { usePWA } from '@/features/pwa';
import { SidebarItems } from './Sidebar';

export const BottomNavigation = () => {
  const { installApp, isInstallable } = usePWA();

  const handleInstallClick = async () => {
    console.log('[PWA] Install button clicked (BottomNavigation). isInstallable:', isInstallable);
    const ok = await installApp();
    console.log('[PWA] installApp result:', ok);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700/30 z-40 lg:hidden">
      <div className="flex justify-between items-start h-16 lg:h-24 px-4">
        {SidebarItems.map((item) => (
          <div key={item.name} className="flex flex-col items-center ">
            <NavigationButton
              name=""
              path={item.path}
              icon={item.icon}
              baseClassName="flex flex-col items-center justify-center p-2.5 rounded-lg transition-all duration-200 cursor-pointer"
              activeClassName="text-white-text bg-gray-800/40"
              inactiveClassName="text-gray-400 hover:text-white-text"
            />
            <span className="text-xs text-gray-400  font-medium">{item.name}</span>
          </div>
        ))}
        <div className="flex flex-col items-center ">
          <button
            onClick={handleInstallClick}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
              !isInstallable
                ? 'text-gray-600'
                : 'text-gray-400 hover:text-white-text hover:bg-gray-800/40'
            }`}
            aria-label="Instalar PWA"
          >
            <DownloadIcon size={20} />
          </button>
          <span className="text-xs text-gray-400 font-medium">PWA</span>
        </div>
      </div>
    </div>
  );
};
