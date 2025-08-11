
import { ReactNode } from 'react';

interface CustomButtonProps {
  onClick: () => void;
  label: string;
  icon?: ReactNode | string;
  variant?: 'primary' | 'pwa' | 'outline' | 'ghost' | 'spotify';
  size?: 'sm' | 'md' | 'lg' | 'custom';
  disabled?: boolean;
  customClassName?: string;
  className?: string;
}

export const CustomButton = ({
  onClick,
  label,
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  customClassName,
  className,
}: CustomButtonProps) => {

  const baseClasses = 'font-bold cursor-pointer flex items-center transition-all duration-200 gap-4';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-8',
    md: 'px-6 py-3 text-base h-10',
    lg: 'px-8 py-4 text-lg h-12',
    custom: '',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg',
    pwa: 'text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-lg font-medium text-sm gap-4 px-4 py-2.5 text-[2',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg',
    ghost: 'text-gray-700 hover:bg-gray-100 rounded-lg',
    spotify: 'font-rubik bg-green-spotify text-black-text rounded-[24px] font-medium h-[50px] cursor-pointer px-10  transition-all hover:underline hover:opacity-80',
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${customClassName || ''} ${className || ''}`;

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <span className={`${variant === 'pwa' ? 'text-[20px]' : 'text-xl'}`}>{icon}</span>;
    }
    return icon;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon && renderIcon()}
      <span>{label}</span>
    </button>
  );
};
