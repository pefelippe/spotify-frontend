import { CustomButton } from '../../../app/components/CustomButton';
import { Logo } from '../../../app/components/Logo';
import { DefaultPage } from '../../../app/layout/DefaultPage';
import { env } from '../../../config/env';

export const Login = () => {
  return (
    <DefaultPage className="max-lg:min-h-screen relative flex flex-col items-center justify-center">
      <div className="flex flex-col items-center  justify-center text-center h-full">
        <Logo className="w-[200px] h-[50px] object-contain mb-6" />
        <p className="text-white-text text-xl font-medium font-weight-500 mb-6">
          Entre com sua conta Spotify clicando no botão abaixo
        </p>
        <CustomButton
          onClick={() => {
            // Garantir que não há duplas barras na URL
            const baseUrl = env.API_URL.replace(/\/$/, ''); // Remove barra no final se existir
            const loginUrl = `${baseUrl}/auth/login`;
            console.log('Redirecionando para login:', loginUrl);
            window.location.href = loginUrl;
          }}
          variant="spotify"
          label="Entrar"
          />
      </div>
    </DefaultPage>
  );
};

