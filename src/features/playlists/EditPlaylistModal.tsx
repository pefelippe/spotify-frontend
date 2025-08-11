import React, { useEffect, useState } from 'react';
import { Modal } from '../../app/components/CustomModal';
import { CustomButton } from '../../app/components/CustomButton';

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialDescription?: string;
  onSave: (data: { name: string; description: string }) => void | Promise<void>;
  isSaving?: boolean;
  onRequestDelete?: () => void;
}

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  initialName = '',
  initialDescription = '',
  onSave,
  isSaving = false,
  onRequestDelete: _onRequestDelete,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Playlist">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-2 border-gray-600 text-white rounded-md placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              maxLength={100}
              placeholder="Nome da playlist"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-2 border-gray-600 text-white rounded-md placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              rows={4}
              maxLength={300}
              placeholder="Descrição da playlist"
            />
          </div>
        </div>

        <div className="flex flex-col pt-2 w-full">
          <CustomButton
            label={isSaving ? 'Salvando...' : 'Salvar'}
            onClick={() => onSave({ name: name || '', description: description || '' })}
            variant="spotify"
            customClassName="mx-auto w-full text-center flex justify-center"
            disabled={isSaving}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditPlaylistModal;

