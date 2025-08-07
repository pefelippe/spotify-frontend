import CustomButton from '../components/CustomButton';
import { CustomLabel } from '../components/CustomLabel';
import { Logo } from '../components/Logo';

const Login = () => {
  const handleSpotifyLogin = () => {
    console.log('Spotify login clicked');
  };

  return (
    <div className="flex items-center justify-center items-center flex flex-col items-center justify-center text-center rounded-lg">
        <Logo className="w-[200px] h-[60px] object-contain mb-6" />
        <CustomLabel label="Entra com sua conta Spotify clicando no botão abaixo" />
        <CustomButton
          onClick={handleSpotifyLogin}
          variant="spotify"
          label="Entrar"
        />
    </div>
  );
};

export default Login;
