import React from 'react';
import { VolumeIcon, VolumeMuteIcon } from '@/app/components/SpotifyIcons';

type VolumeControlProps = {
  volumePercent: number;
  isMuted: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const VolumeControl: React.FC<VolumeControlProps> = ({ volumePercent, isMuted, onToggleMute, onChange }) => {
  return (
    <div className="hidden lg:flex items-center space-x-2">
      <button onClick={onToggleMute} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
        {isMuted ? <VolumeMuteIcon size={16} /> : <VolumeIcon size={16} />}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volumePercent}
        onChange={onChange}
        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        style={{ background: `linear-gradient(to right, #fff 0%, #fff ${volumePercent}%, #4b5563 ${volumePercent}%, #4b5563 100%)` }}
      />
    </div>
  );
};

export default VolumeControl;

