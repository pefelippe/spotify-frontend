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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-2xl"
      >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>{artistName}</span>
    </button>
  );
};
