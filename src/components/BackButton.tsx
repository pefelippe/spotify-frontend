import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  artistName: string;
}

export const BackButton = ({artistName}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className={'text-white-text hover:text-gray-300 transition-colors text-lg cursor-pointer'}
    >
     <span className="text-2xl">{'<-'} {artistName}</span>
    </button>
  );
};
