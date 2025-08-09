import { CustomButton } from '../../../app/components/CustomButton';
import { Logo } from '../../../app/components/Logo';
import { DefaultPage } from '../../../app/layout/DefaultPage';
import { env } from '../../../config/env';

export const Login = () => {
  return (
    <DefaultPage className="max-lg:min-h-screen relative flex flex-col items-center justify-center">
      <div className="flex flex-col items-center  justify-center text-center h-full gap-[16px]">
        <Logo className="w-[164px] h-[50px] object-contain" />
        <p className="text-white-text font-rubik font-medium text-[14px] leading-[20px] ">
          Entre com sua conta Spotify clicando no botão abaixo
        </p>
        <CustomButton
          onClick={() => {
            const loginUrl = `${env.API_URL}/auth/login`;
            window.location.href = loginUrl;
          }}
          variant="spotify"
          label="Entrar"
          size="custom"
          />
      </div>
    </DefaultPage>
  );
};

