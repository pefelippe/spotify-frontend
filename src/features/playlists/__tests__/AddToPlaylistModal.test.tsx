import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToPlaylistModal } from '../AddToPlaylistModal';

vi.mock('../../../core/api/hooks/useUserPlaylists', () => ({
  useUserPlaylists: () => ({
    data: {
      pages: [
        {
          items: [
            { id: 'pl1', name: 'Minhas Faixas', images: [{ url: 'img1' }], owner: { id: 'me' }, tracks: { total: 1 } },
            { id: 'pl2', name: 'Favoritas', images: [{ url: 'img2' }], owner: { id: 'me' }, tracks: { total: 2 } },
          ],
        },
      ],
    },
  }),
}));

vi.mock('../../../core/api/hooks/useUserProfile', () => ({
  useUserProfile: () => ({ data: { id: 'me' } }),
}));

const mutateAsync = vi.fn().mockResolvedValue(undefined);
vi.mock('../../../core/api/hooks/useAddTrackToPlaylist', () => ({
  useAddTrackToPlaylist: () => ({ mutateAsync }),
}));

describe('AddToPlaylistModal', () => {
  it('selects playlists and confirms add', async () => {
    const onClose = vi.fn();
    render(
      <AddToPlaylistModal
        isOpen
        onClose={onClose}
        trackUri="spotify:track:123"
        trackName="Song"
      />,
    );

    // Two playlists visible
    expect(screen.getByText('Minhas Faixas')).toBeInTheDocument();
    expect(screen.getByText('Favoritas')).toBeInTheDocument();

    // Select first
    await userEvent.click(screen.getByText('Minhas Faixas'));
    // Confirm
    await userEvent.click(screen.getByRole('button', { name: /Adicionar/i }));

    expect(mutateAsync).toHaveBeenCalledWith({ playlistId: 'pl1', trackUri: 'spotify:track:123' });
  });
});

