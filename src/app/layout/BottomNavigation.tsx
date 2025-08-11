import { NavigationButton } from './NavigationButton';
import { SidebarItems } from '../components/Sidebar';

export const BottomNavigation = () => {

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700/30 z-40 lg:hidden">
      <div className="flex justify-between items-start h-16 lg:h-24 px-4 max-w-[90%] mx-auto">
        {SidebarItems.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <NavigationButton
              name={item.name}
              path={item.path}
              icon={item.icon}
              baseClassName="flex flex-col items-center justify-center p-2.5 rounded-lg transition-all duration-200 cursor-pointer"
              activeClassName="text-white-text bg-gray-800/40"
              inactiveClassName="text-gray-400 hover:text-white-text"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
