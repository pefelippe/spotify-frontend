import React from 'react';
import { UserAvatar } from '../UserAvatar';
import { CustomButton } from '../CustomButton';
import { PencilIcon, PlayIcon, TrashIcon } from '../SpotifyIcons';

interface PlaylistHeaderProps {
  playlist: any;
  isOwner: boolean;
  onClickOwner: (ownerId: string) => void;
  onClickPlay: () => void;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  totalDurationText?: string;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  playlist,
  isOwner,
  onClickOwner,
  onClickPlay,
  onClickEdit,
  onClickDelete,
  totalDurationText,
}) => {
  if (!playlist) {
    return null;
  }
  const headerImageUrl = playlist.images?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36';

  return (
    <div className="relative mb-6 md:mb-8 rounded-xl overflow-hidden w-full">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div style={{ backgroundImage: `url(${headerImageUrl})` }} className="w-full h-full bg-cover bg-center blur-3xl scale-110" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/70 to-transparent" />
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-start gap-12 p-4 md:p-6 lg:p-8 mx-auto">
        <div className="w-full md:w-auto flex-shrink-0">
          <img
            src={headerImageUrl}
            alt={playlist.name}
            className="mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] aspect-square rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-start gap-2 text-white/80 text-xs md:text-sm font-medium uppercase tracking-[0.14em] mb-2">
            <span>Playlist</span>
            {isOwner && (
              <>
                <button
                  aria-label="Editar playlist"
                  title="Editar playlist"
                  onClick={onClickEdit}
                  className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  aria-label="Deletar playlist"
                  title="Deletar playlist"
                  onClick={onClickDelete}
                  className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <TrashIcon size={16} />
                </button>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white-text mb-3 md:mb-4 break-words">{playlist.name}</h1>
          {playlist.description ? (
            <p className="text-gray-300/90 text-sm md:text-base mb-3 md:mb-4 max-w-2xl">{playlist.description}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-300/90 text-sm gap-x-2 gap-y-1">
            <div className="flex items-center gap-2">
              <UserAvatar userId={playlist.owner?.id || ''} displayName={playlist.owner?.display_name || ''} size="md" />
              <span
                className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                onClick={() => onClickOwner(playlist.owner?.id)}
              >
                {playlist.owner?.display_name}
              </span>
            </div>
            {playlist.followers?.total ? (
              <>
                <span className="opacity-60">•</span>
                <span>{playlist.followers.total.toLocaleString()} seguidores</span>
              </>
            ) : null}
            <span className="opacity-60">•</span>
            <span>{playlist.tracks?.total} músicas</span>
            {totalDurationText ? (
              <>
                <span className="opacity-60">•</span>
                <span>{totalDurationText}</span>
              </>
            ) : null}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <CustomButton label="Reproduzir" onClick={onClickPlay} variant="spotify" customClassName="inline-flex items-center gap-2" icon={<PlayIcon size={18} className="ml-0.5" />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;

