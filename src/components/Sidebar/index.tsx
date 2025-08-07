
import CustomButton from '../CustomButton';
import { Logo } from '../Logo';
import { SidebarItems } from './SidebarItems';
import { NavigationButton } from '../NavigationButton';

const Sidebar = () => {

  return (
    <div className="w-[300px] bg-[#000] h-screen  flex flex-col font-dm-sans">

      <Logo className="w-[200px] h-[70px] object-contain m-8" />

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1 mx-8">
          {SidebarItems.map((item) => (
            <NavigationButton key={item.name} name={item.name} path={item.path} icon={item.icon} />
          ))}
        </ul>
      </nav>

      {/* PWA Install Button */}
      <div className="mt-auto mx-auto">
        <CustomButton
          label="Instalar PWA"
          icon="⬇️"
          onClick={() => {}}
          variant="secondary"
          customClassName="font-extrabold text-xl m-8 gap-4"
        />
      </div>
    </div>
  );
};

export default Sidebar;
