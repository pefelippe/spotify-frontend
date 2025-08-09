import { useState, useEffect } from 'react';
import { usePlayer } from '../../../features/player';

export const PremiumWarning = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { isPremiumRequired, resetPremiumWarning } = usePlayer();

  useEffect(() => {
    if (isPremiumRequired) {
      setIsVisible(true);
    }
  }, [isPremiumRequired]);

  if (!isVisible || !isPremiumRequired) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 bg-yellow-600 text-black p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-sm">Spotify Premium Necessário</h3>
            <p className="text-xs mt-1">
              Para reproduzir músicas, você precisa ter uma conta Spotify Premium ativa.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            resetPremiumWarning();
          }}
          className="text-black hover:text-gray-700 text-xl font-bold ml-4 cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

