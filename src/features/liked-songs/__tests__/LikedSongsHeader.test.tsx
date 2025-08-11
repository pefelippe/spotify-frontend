import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LikedSongsHeader } from '../LikedSongsHeader';

vi.mock('../../../core/api/hooks/useUserDetails', () => ({
  useUserDetails: () => ({ data: { images: [] } }),
}));

describe('LikedSongsHeader', () => {
  it('renders user name, count and duration, and handles click on user', async () => {
    const onClickUser = vi.fn();
    render(
      <LikedSongsHeader
        user={{ id: 'u1', display_name: 'Pedro' }}
        likedSongsCount={10}
        totalDurationText="35 min"
        onClickUser={onClickUser}
      />
    );

    expect(screen.getByText('Músicas Curtidas')).toBeInTheDocument();
    expect(screen.getByText('Pedro')).toBeInTheDocument();
    expect(screen.getByText('10 músicas')).toBeInTheDocument();
    expect(screen.getByText('35 min')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Pedro'));
    expect(onClickUser).toHaveBeenCalledWith('u1');
  });
});

