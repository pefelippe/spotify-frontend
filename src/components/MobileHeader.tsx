import { Logo } from './Logo';

export const MobileHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black-bg border-b border-gray-800 lg:hidden z-40">
      <div className="flex items-center justify-center py-4 px-4">
        <Logo className="h-8 object-contain" />
      </div>
    </div>
  );
};
