import { CustomButton } from '../../../components/CustomButton';
import { Logo } from '../../../components/Logo';

export const Login = () => {

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center text-center w-full">
        <Logo className="w-[200px] h-[50px] object-contain mb-6" />
        <p className="text-white-text text-xl font-medium font-weight-500 mb-6">
          Entre com sua conta Spotify clicando no botão abaixo
        </p>
        <CustomButton
          onClick={() => {
            window.location.href = 'http://localhost:3001/auth/login';
          }}
          variant="spotify"
          label="Entrar"
        />
      </div>
    </div>
  );
};

