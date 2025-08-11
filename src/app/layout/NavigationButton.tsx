import { Link, useLocation } from 'react-router-dom';
import { ComponentType } from 'react';

interface NavigationButtonProps {
  name: string;
  path?: string;
  icon: ComponentType<{ size?: number; className?: string }> | string;
  activeClassName?: string;
  inactiveClassName?: string;
  baseClassName?: string;
}

export const NavigationButton = ({
  name,
  icon,
  path = '/',
  activeClassName = 'text-white-text bg-gray-800/50 shadow-lg',
  inactiveClassName = 'text-[#949EA2] hover:text-white-text hover:bg-gray-800/30',
  baseClassName = 'w-full flex items-center gap-6 px-4 py-3 rounded-lg transition-all duration-300 ease-out font-medium text-left cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-md',
}: NavigationButtonProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  const buttonClasses = `${baseClassName} ${
    isActive ? activeClassName : inactiveClassName
  }`;

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return (
        <span className={`text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </span>
      );
    }

    const IconComponent = icon;
    return (
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        <IconComponent size={20} className="flex-shrink-0" />
      </div>
    );
  };

  return (
    <Link to={path} className="w-full">
      <button className={buttonClasses}>
        {icon && renderIcon()}
        {name && (
          <span className="text-[16px] font-medium tracking-wide">
            {name}
          </span>
        )}
      </button>
    </Link>
  );
};
