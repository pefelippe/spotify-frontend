

import { CustomButton } from '../../../components/CustomButton';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useAuth } from '@/core/auth';

const Perfil = () => {
  const { logout } = useAuth();
  const { data: userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-32">
      <div className="text-center">
        <div className="mb-8">
          <img
            src={userProfile?.images?.[0]?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
            alt={userProfile?.display_name || 'User'}
            className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-gray-700 shadow-xl"
          />
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">
          {userProfile?.display_name || 'Usuário'}
        </h1>

        <CustomButton
          label="Sair"
          onClick={logout}
          variant="spotify"
          customClassName="w-[250px] mx-auto justify-center"
        />
      </div>
    </div>
  );
};

export default Perfil;
