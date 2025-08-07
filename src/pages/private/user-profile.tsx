import { useParams } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import { CenteredLayout } from '../../components/layout/CenteredLayout';
import { QueryState } from '../../components/QueryState';
import { useUserDetails } from '../../hooks/useUserDetails';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: userProfile, isLoading, error } = useUserDetails(userId!);

  if (!userId) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton artistName="Usuário não encontrado" />
          <h1 className="text-2xl font-bold text-white-text">Usuário não encontrado</h1>
        </div>
      </div>
    );
  }

  if (isLoading || error) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton artistName={isLoading ? 'Carregando...' : 'Erro'} />
          <h1 className="text-2xl font-bold text-white-text">
            {isLoading ? 'Carregando perfil...' : 'Erro ao carregar perfil'}
          </h1>
        </div>
        <QueryState
          isLoading={isLoading}
          error={error}
          loadingMessage=""
          errorMessage="Tente novamente mais tarde."
          centered={false}
        />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center space-x-4 mb-8">
        <BackButton artistName={userProfile?.display_name || 'Usuário'} />
      </div>

      <CenteredLayout>
        <div className="text-center">
          <div className="mb-6">
            <img
              src={userProfile?.images?.[0]?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt={userProfile?.display_name || 'User'}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-800"
            />
          </div>

          <h1 className="text-3xl font-bold text-white-text mb-4">
            {userProfile?.display_name || 'Usuário'}
          </h1>

          {userProfile?.followers?.total && (
            <p className="text-gray-400 text-lg mb-6">
              {userProfile.followers.total.toLocaleString()} seguidores
            </p>
          )}

          <div className="text-gray-400 text-sm">
            <p>Perfil do Spotify</p>
          </div>
        </div>
      </CenteredLayout>
    </div>
  );
};

export default UserProfile;
