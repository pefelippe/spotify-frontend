import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DefaultPage } from '../../layout/DefaultPage';
import { QueryState } from '../../components/QueryState';
import { UserHeader } from '../../layout/UserHeader';
import { useUserDetails, useUserPublicPlaylists } from '../../../core/api/hooks/useUserDetails';
import { ArtistsSection } from '../../components/ArtistsSection';
import { CustomSection } from '../../components/CustomSection';
import { useUserProfile } from '../../../core/api/hooks/useUserProfile';
import { useUserFollowingArtists } from '../../../core/api/hooks/useUserFollowing';
import { useLikedSongs } from '../../../core/api/hooks/useLikedSongs';

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: userProfile } = useUserDetails(userId!);
  const { data: currentUser } = useUserProfile();
  const { data: playlistsData, isLoading: isLoadingPlaylists, error: playlistsError } = useUserPublicPlaylists(userId!);

  const showPrivateSections = !!(currentUser?.id && userProfile?.id && currentUser.id === userProfile.id);

  const { data: followingData } = useUserFollowingArtists(showPrivateSections, 20);
  const followingArtists = useMemo(
    () => (followingData?.pages?.flatMap((p: any) => p?.artists?.items) || []).slice(0, 12),
    [followingData],
  );

  const { data: likedSongsData } = useLikedSongs();
  const likedSongsTotal = showPrivateSections ? (likedSongsData?.pages?.[0]?.total ?? undefined) : undefined;

  const publicPlaylists = useMemo(() => {
    const all = playlistsData?.pages.flatMap(page => page.items) || [];
    return all.filter((pl: any) => pl?.owner?.id === userProfile?.id);
  }, [playlistsData, userProfile?.id]);

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <DefaultPage
      hasBackButton
    >
      <div className="space-y-8">
        <UserHeader
          userProfile={userProfile}
          stats={{
            followers: userProfile?.followers?.total,
            following: showPrivateSections ? followingData?.pages?.[0]?.artists?.total ?? 0 : undefined,
            playlists: publicPlaylists.length,
            likedSongs: likedSongsTotal,
          }}
        />
        {publicPlaylists.length > 0 && (
          <div className="mb-8 mt-10">
            {isLoadingPlaylists ? (
              <QueryState isLoading={true} loadingMessage="Carregando playlists..." centered={false} />
            ) : playlistsError ? (
              <QueryState error={playlistsError} errorMessage="Erro ao carregar playlists." centered={false} />
            ) : (
              <CustomSection
                title="Playlists Públicas"
                data={publicPlaylists.slice(0, 12).map((pl: any) => ({
                  id: pl.id,
                  title: pl.name,
                  subtitle: pl.owner?.display_name,
                  imageSrc: pl.images?.[0]?.url || '',
                  playback: { contextUri: `spotify:playlist:${pl.id}` },
                }))}
                onClickData={(playlistId: string) => handlePlaylistClick(playlistId)}
                hasShowMore={false}
              />
            )}
          </div>
        )}
        {showPrivateSections && followingArtists.length > 0 && (
          <ArtistsSection
            title="Seguindo"
            artists={followingArtists.map((a: any) => ({ id: a.id, name: a.name, images: a.images }))}
            onClickArtist={(artistId) => navigate(`/artist/${artistId}`)}
          />
        )}

      </div>
    </DefaultPage>
  );
};

export default UserDetails;
