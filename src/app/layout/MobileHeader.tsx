import { SpotifyLogo } from '../components/SpotifyIcons';
import { useNavigate } from 'react-router-dom';

export const MobileHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 right-0 bg-black-bg border-b border-gray-800 lg:hidden z-40">
      <div className="flex items-center justify-center py-4 px-4">
        <SpotifyLogo className="h-8 object-contain cursor-pointer" onClick={() => navigate('/')}/>
      </div>
    </div>
  );
};
