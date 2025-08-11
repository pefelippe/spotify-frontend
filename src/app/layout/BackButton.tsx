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
      className={'text-white-text hover:text-gray-300 transition-colors text-lg cursor-pointer flex pb-10 items-center gap-2'}
    >
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-2xl">
        <path d="M25.3333 16H6.66663" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 25.3334L6.66663 16L16 6.66669" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{artistName}</span>
    </button>
  );
};
