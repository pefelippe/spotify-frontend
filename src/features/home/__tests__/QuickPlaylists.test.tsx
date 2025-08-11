import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickPlaylists } from '../QuickPlaylists';

vi.mock('../../player/usePlayer', () => ({
  usePlayer: () => ({
    isReady: true,
    deviceId: 'dev',
    isPlaying: false,
    playTrack: vi.fn(),
    pauseTrack: vi.fn(),
  }),
}));

describe('QuickPlaylists', () => {
  const baseItems = [
    { id: 'liked', name: 'Músicas Curtidas (10)', image: '', isLiked: true, onClick: vi.fn() },
    { id: 'p1', name: 'Minha Playlist', image: 'img.jpg', onClick: vi.fn() },
  ];

  it('renders items and calls onClick when card is clicked (desktop grid)', async () => {
    render(<QuickPlaylists items={baseItems} />);

    // Appears in mobile and desktop DOM; assert at least one
    expect(screen.getAllByText('Músicas Curtidas (10)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Minha Playlist').length).toBeGreaterThan(0);

    // Click first occurrence should trigger onClick
    await userEvent.click(screen.getAllByText('Minha Playlist')[0]);
    expect(baseItems[1].onClick).toHaveBeenCalledTimes(1);
  });

  it('shows play button overlay on hover-able containers (smoke test)', () => {
    render(<QuickPlaylists items={baseItems} />);
    // Button exists in DOM but may be hidden by opacity; ensure it is present for overlay
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

