import React from 'react';
import { CustomButton } from './CustomButton';
import { PlayIcon, PencilIcon, TrashIcon, HeartIcon } from './SpotifyIcons';
import { UserAvatar } from '../hooks/UserAvatar';

interface TrackInfoDetailedProps {
  imageUrl: string;
  title: string;
  typeLabel: string;
  primaryLabel?: string;
  primaryAvatarUrl?: string;
  onClickPrimaryLabel?: () => void;
  metaItems?: string[];
  primaryUserId?: string; 
  primaryDisplayName?: string;
  onClickPlay?: () => void;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
}

export const TrackInfoDetailed: React.FC<TrackInfoDetailedProps> = ({
  imageUrl,
  title,
  typeLabel,
  primaryLabel,
  primaryAvatarUrl,
  onClickPrimaryLabel,
  metaItems = [],
  primaryUserId,
  primaryDisplayName,
  onClickPlay,
  onClickEdit,
  onClickDelete,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <div className="w-full md:w-auto flex-shrink-0 flex flex-col items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="mx-auto w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl"
          />
        ) : (
          <div className="mx-auto w-32 h-32 md:w-48 md:h-48 rounded-lg shadow-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <HeartIcon size={48} className="text-white" filled />
          </div>
        )}
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{typeLabel}</p>
          {(onClickEdit || onClickDelete) && (
            <div className="flex items-center gap-1">
              {onClickEdit ? (
                <button
                  aria-label="Editar"
                  title="Editar"
                  onClick={onClickEdit}
                  className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <PencilIcon size={16} />
                </button>
              ) : null}
              {onClickDelete ? (
                <button
                  aria-label="Deletar"
                  title="Deletar"
                  onClick={onClickDelete}
                  className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <TrashIcon size={16} />
                </button>
              ) : null}
            </div>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white-text mb-4">{title}</h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1 mb-2">
          {primaryLabel && (
            <div className="flex items-center space-x-2">
              {primaryUserId ? (
                <UserAvatar userId={primaryUserId} displayName={primaryDisplayName || primaryLabel} size="md" />
              ) : primaryAvatarUrl ? (
                <img src={primaryAvatarUrl} alt={primaryLabel} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600" />
              )}
              <span
                className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                onClick={onClickPrimaryLabel}
              >
                {primaryLabel}
              </span>
            </div>
          )}
          {primaryLabel && metaItems.length > 0 ? <span>•</span> : null}
          {metaItems.map((m, idx) => (
            <React.Fragment key={`${m}-${idx}`}>
              <span>{m}</span>
              {idx < metaItems.length - 1 ? <span>•</span> : null}
            </React.Fragment>
          ))}
        </div>
        {onClickPlay ? (
          <div className="mt-4 flex items-center gap-3 justify-center md:justify-start">
            <CustomButton
              label="Reproduzir"
              onClick={onClickPlay}
              variant="spotify"
              customClassName="inline-flex items-center gap-2"
              icon={<PlayIcon size={18} className="ml-0.5" />}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TrackInfoDetailed;

