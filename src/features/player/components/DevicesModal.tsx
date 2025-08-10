import React from 'react';
import { SpotifyDevice } from '../player';

interface DevicesModalProps {
  devices: SpotifyDevice[];
  onDeviceSelect: (deviceId: string) => Promise<void>;
  onClose: () => void;
}

export const DevicesModal: React.FC<DevicesModalProps> = ({
  devices,
  onDeviceSelect,
  onClose,
}) => {
  const handleDeviceSelect = async (deviceId: string) => {
    await onDeviceSelect(deviceId);
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="devices-modal absolute bottom-full mb-2 right-0 w-72 bg-[#111] border border-gray-700 rounded-xl shadow-2xl p-2 z-[200]"
    >
      <div className="absolute -bottom-1 left-[2%] w-2 h-2 bg-[#111] border-l border-b border-gray-700 -rotate-45" />
      <div className="px-2 py-1.5 text-xs text-gray-400">Dispositivos disponíveis</div>
      <div className="max-h-60 overflow-y-auto">
        {devices.length === 0 ? (
          <div className="px-3 py-2 text-gray-500 text-sm">Nenhum dispositivo encontrado</div>
        ) : (
          devices.map((device) => {
            const displayName = device.name === 'Spotify Clone Player' ? 'Esse dispositivo' : device.name;
            return (
              <button
                key={device.id}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                  device.is_active
                    ? 'bg-green-600/10 text-green-400'
                    : 'text-gray-200 hover:bg-white/10'
                }`}
                onClick={() => handleDeviceSelect(device.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{displayName}</span>
                  {device.is_active && <span className="text-[10px] uppercase">Ativo</span>}
                </div>
                <div className="text-[10px] text-gray-400 capitalize">
                  {`${device.type}`.toLowerCase()}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
