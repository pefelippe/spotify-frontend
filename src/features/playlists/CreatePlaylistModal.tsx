import React, { useState, useEffect } from 'react';
import { Modal } from '../../app/components/CustomModal';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  const canSubmit = !!name.trim() && !isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl font-bold">
            ✕
          </button>
        </div>

        <div className="text-center">
          <span className="text-white text-base font-semibold">Dê um nome a sua playlist</span>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=""
            className="w-full px-0 pb-3 bg-transparent border-b-2 border-gray-600 text-white justify-center text-center placeholder-gray-400 focus:outline-none focus:border-white transition-colors text-xl font-extrabold"
            maxLength={100}
            autoFocus
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => onSubmit(name.trim())}
            disabled={!canSubmit}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-200 ${
              canSubmit ? 'bg-green-500 text-black hover:bg-green-400 cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePlaylistModal;

