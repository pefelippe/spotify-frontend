import React from 'react';
import { Modal } from '../../app/components/CustomModal';
import { CustomButton } from '../../app/components/CustomButton';

interface DeletePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
}

export const DeletePlaylistModal: React.FC<DeletePlaylistModalProps> = ({ isOpen, onClose, playlistName, onConfirm, isDeleting = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl font-bold">✕</button>
        </div>
        <div className="text-center">
          <span className="text-white text-xl font-semibold">Deletar playlist</span>
          <p className="text-gray-400 text-sm mt-2">Tem certeza que deseja deletar "{playlistName}"?</p>
          <p className="text-gray-400 text-xs mt-1">Esta ação não pode ser desfeita.</p>
        </div>
        <div className="flex pt-4">
          <CustomButton
            label={isDeleting ? 'Deletando...' : 'Deletar'}
            onClick={onConfirm}
            variant="primary"
            customClassName="w-full bg-red-600 hover:bg-red-700 justify-center items-center flex"
            disabled={isDeleting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeletePlaylistModal;

