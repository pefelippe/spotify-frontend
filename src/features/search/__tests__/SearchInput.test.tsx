import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchInput from '../SearchInput';

vi.mock('../../player', () => ({ usePlayer: () => ({ playTrack: vi.fn(), isReady: false }) }));
const setSearchTextMock = vi.fn();
vi.mock('../useHomeSearchPreview', async () => ({
  useHomeSearchPreview: () => ({
    searchText: '',
    setSearchText: setSearchTextMock,
    showPreview: false,
    setShowPreview: vi.fn(),
    previewTracks: [],
    previewAlbums: [],
    previewArtists: [],
    recentSearches: [],
    addRecentSearch: vi.fn(),
    removeRecentSearch: vi.fn(),
    clearRecentSearches: vi.fn(),
  }),
}));

describe('SearchInput', () => {
  it('renders input and allows typing', async () => {
    render(
      <MemoryRouter>
        <SearchInput />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText('O que você deseja ouvir?');
    await userEvent.type(input, 'abc');
    expect(setSearchTextMock).toHaveBeenCalled();
  });
});

