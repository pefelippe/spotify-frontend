

import { CustomButton } from '../../../app/components/CustomButton';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { useAuth } from '../../../core/auth';

const Perfil = () => {
  const { logout } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-[96px] lg:pb-12">
      <div className="w-full max-w-screen-sm text-center">
        <div className="mb-8">
          <img
            src={userProfile?.images?.[0]?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
            alt={userProfile?.display_name || 'User'}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover border-4 border-gray-700 shadow-xl"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 break-words">
          {userProfile?.display_name || 'Usuário'}
        </h1>

        <CustomButton
          label="Sair"
          onClick={logout}
          variant="spotify"
          customClassName="w-full sm:w-64 mx-auto justify-center"
        />
      </div>
    </div>
  );
};

export default Perfil;
