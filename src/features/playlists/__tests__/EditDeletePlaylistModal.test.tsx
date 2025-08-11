import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPlaylistModal from '../EditPlaylistModal';
import DeletePlaylistModal from '../DeletePlaylistModal';

describe('Playlist modals', () => {
  it('edits playlist name and description', async () => {
    const onSave = vi.fn();
    render(
      <EditPlaylistModal
        isOpen
        onClose={vi.fn()}
        initialName="Old"
        initialDescription="Desc"
        onSave={onSave}
      />,
    );

    const name = screen.getByPlaceholderText('Nome da playlist');
    const desc = screen.getByPlaceholderText('Descrição da playlist');
    await userEvent.clear(name);
    await userEvent.type(name, 'New');
    await userEvent.clear(desc);
    await userEvent.type(desc, 'New Desc');

    await userEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    expect(onSave).toHaveBeenCalledWith({ name: 'New', description: 'New Desc' });
  });

  it('confirms delete in DeletePlaylistModal', async () => {
    const onConfirm = vi.fn();
    render(
      <DeletePlaylistModal
        isOpen
        onClose={vi.fn()}
        playlistName="Minha"
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /Deletar/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

