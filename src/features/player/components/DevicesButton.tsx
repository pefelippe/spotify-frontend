import React, { useState } from 'react';
import { DevicesIcon } from '@/app/components/SpotifyIcons';
import { SpotifyDevice } from '@/features/player/player';

type DevicesButtonProps = {
  devices: SpotifyDevice[];
  onRefresh: () => Promise<void>;
  onTransfer: (deviceId: string) => Promise<void>;
};

export const DevicesButton: React.FC<DevicesButtonProps> = ({ devices, onRefresh, onTransfer }) => {
  const [open, setOpen] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
    await onRefresh();
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
        aria-label="Devices"
        title="Devices"
      >
        <DevicesIcon size={18} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-10 w-64 bg-[#111] border border-gray-700 rounded-lg shadow-xl p-2 z-[200]" onClick={(e) => e.stopPropagation()}>
          <div className="px-2 py-1.5 text-xs text-gray-400">Available devices</div>
          <div className="max-h-60 overflow-y-auto">
            {devices.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No devices found</div>
            ) : (
              devices.map((d) => (
                <button
                  key={d.id}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${d.is_active ? 'bg-green-600/10 text-green-400' : 'text-gray-200 hover:bg-white/10'}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await onTransfer(d.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{d.name}</span>
                    {d.is_active && <span className="text-[10px] uppercase">Active</span>}
                  </div>
                  <div className="text-[10px] text-gray-400 capitalize">{`${d.type}`.toLowerCase()}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesButton;

