
interface CustomButtonProps {
  onClick: () => void;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'spotify';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  customClassName?: string;
}

const CustomButton = ({ 
  onClick, 
  label, 
  icon, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  customClassName 
}: CustomButtonProps) => {

  const baseClasses = 'font-bold cursor-pointer flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-8',
    md: 'px-6 py-3 text-base h-10',
    lg: 'px-8 py-4 text-lg h-12'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg',
    secondary: 'text-white rounded-lg',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg',
    ghost: 'text-gray-700 hover:bg-gray-100 rounded-lg',
    spotify: 'bg-green-spotify text-black-text rounded-[24px] font-bold h-[50px] cursor-pointer flex items-center hover:bg-green-spotify/80 justify-center gap-[10px] px-12'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${customClassName || ''}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {icon && <span className="text-3xl">{icon}</span>}
      <span className="text-xl font-extrabold">{label}</span>
    </button>
  );
};

export default CustomButton;
