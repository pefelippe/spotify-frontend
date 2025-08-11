import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtistHeader from '../ArtistHeader';

describe('ArtistHeader', () => {
  it('renders name and triggers play', async () => {
    const onPlay = vi.fn();
    render(
      <ArtistHeader
        imageUrl="img"
        name="Artist"
        followers={100}
        onPlay={onPlay}
      />,
    );

    expect(screen.getByText('Artist')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Reproduzir/i }));
    expect(onPlay).toHaveBeenCalled();
  });
});

