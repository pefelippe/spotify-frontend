import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, SpeakerHigh, SpeakerSlash, Heart as HeartPh, ArrowsOutSimple, DeviceMobileSpeaker, PencilSimple, Trash, Check } from 'phosphor-react';
import spotifyLogo from '../assets/spotify-logo.png';

export const SpotifyLogo = ({ className = '', onClick }: { size?: number; className?: string, onClick?: () => void }) => (
    <img
    src={spotifyLogo}
    alt="Spotify"
    className={className}
    onClick={onClick}
  />
);

export const SkipBackIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <SkipBack size={size} weight="fill" className={className} />
);

export const SkipForwardIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <SkipForward size={size} weight="fill" className={className} />
);

export const PlayIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <Play size={size} weight="fill" className={className} />
);

export const PauseIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <Pause size={size} weight="fill" className={className} />
);

export const SkipNextIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <SkipForward size={size} weight="fill" className={className} />
);

export const SkipPrevIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <SkipBack size={size} weight="fill" className={className} />
);

export const ShuffleIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <Shuffle size={size} weight="bold" className={className} />
);

export const RepeatIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <Repeat size={size} weight="bold" className={className} />
);

export const VolumeIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <SpeakerHigh size={size} weight="fill" className={className} />
);

export const VolumeMuteIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <SpeakerSlash size={size} weight="fill" className={className} />
);

export const HeartIcon = ({ size = 16, className = '', filled = false }: { size?: number; className?: string; filled?: boolean }) => (
  <HeartPh size={size} weight={filled ? 'fill' : 'regular'} className={className} />
);

export const PlusIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"/>
  </svg>
);

export const MoreIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
  </svg>
);

export const PlayingIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M11.196 8 6 5v6l5.196-3z"/>
    <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5A1.75 1.75 0 0 0 1.002 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z"/>
  </svg>
);

export const UserIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={Math.round((size/24)*25)} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 21.2503V19.2503C20 18.1895 19.5786 17.1721 18.8284 16.4219C18.0783 15.6718 17.0609 15.2503 16 15.2503H8C6.93913 15.2503 5.92172 15.6718 5.17157 16.4219C4.42143 17.1721 4 18.1895 4 19.2503V21.2503" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11.2503C14.2091 11.2503 16 9.45947 16 7.25034C16 5.0412 14.2091 3.25034 12 3.25034C9.79086 3.25034 8 5.0412 8 7.25034C8 9.45947 9.79086 11.2503 12 11.2503Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClockIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M8 1.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-3.5a.75.75 0 0 1 .75.75v2.5h1.75a.75.75 0 0 1 0 1.5H8.75V11a.75.75 0 0 1-1.5 0V8.5H5.5a.75.75 0 0 1 0-1.5h1.75V5.5A.75.75 0 0 1 8 4.5z"/>
  </svg>
);

export const TimeIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.75.75 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0z"/>
  </svg>
);

// Navigation Icons
export const HomeIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={Math.round((size/24)*27)} viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_1_2433)">
      <path d="M12 15.3401C11.2044 15.3401 10.4413 15.683 9.87868 16.2932C9.31607 16.9035 9 17.7312 9 18.5942V26.2153H15V18.5942C15 17.7312 14.6839 16.9035 14.1213 16.2932C13.5587 15.683 12.7956 15.3401 12 15.3401Z" fill="#949EA2"/>
      <path d="M13.338 1.05839C12.9707 0.699826 12.4941 0.501423 12 0.501423C11.5059 0.501423 11.0293 0.699826 10.662 1.05839L0 11.4671V22.748C0 23.6685 0.337142 24.5514 0.937258 25.2024C1.53737 25.8533 2.35131 26.219 3.2 26.219H7V18.5947C7 17.1563 7.52678 15.7768 8.46447 14.7597C9.40215 13.7426 10.6739 13.1712 12 13.1712C13.3261 13.1712 14.5979 13.7426 15.5355 14.7597C16.4732 15.7768 17 17.1563 17 18.5947V26.2157H20.8C21.6487 26.2157 22.4626 25.85 23.0627 25.1991C23.6629 24.5482 24 23.6653 24 22.7447V11.4639L13.338 1.05839Z" fill="#949EA2"/>
    </g>
    <defs>
      <clipPath id="clip0_1_2433">
        <rect width="24" height="26.0327" fill="white" transform="translate(0 0.154716)"/>
      </clipPath>
    </defs>
  </svg>
);

export const HomeIconActive = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={Math.round((size/24)*27)} viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.338 1.05839C12.9707 0.699826 12.4941 0.501423 12 0.501423C11.5059 0.501423 11.0293 0.699826 10.662 1.05839L0 11.4671V22.748C0 23.6685 0.337142 24.5514 0.937258 25.2024C1.53737 25.8533 2.35131 26.219 3.2 26.219H7V18.5947C7 17.1563 7.52678 15.7768 8.46447 14.7597C9.40215 13.7426 10.6739 13.1712 12 13.1712C13.3261 13.1712 14.5979 13.7426 15.5355 14.7597C16.4732 15.7768 17 17.1563 17 18.5947V26.2157H20.8C21.6487 26.2157 22.4626 25.85 23.0627 25.1991C23.6629 24.5482 24 23.6653 24 22.7447V11.4639L13.338 1.05839Z" fill="white"/>
  </svg>
);

export const SearchIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"/>
  </svg>
);

export const LibraryIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1.5.866l8-9a1 1 0 0 0 0-1.732l-8-9zM16 4.732L21.197 12 16 19.268V4.732z"/>
    <path d="M7 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"/>
  </svg>
);

export const ArtistIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={Math.round((size/24)*25)} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22.1874C17.5228 22.1874 22 17.7103 22 12.1874C22 6.66458 17.5228 2.18742 12 2.18742C6.47715 2.18742 2 6.66458 2 12.1874C2 17.7103 6.47715 22.1874 12 22.1874Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15.1874C13.6569 15.1874 15 13.8443 15 12.1874C15 10.5306 13.6569 9.18742 12 9.18742C10.3431 9.18742 9 10.5306 9 12.1874C9 13.8443 10.3431 15.1874 12 15.1874Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PlaylistIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={Math.round((size/24)*25)} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 3.21887L19 12.2189L5 21.2189V3.21887Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DownloadIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={Math.round((size/24)*25)} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17 12.9673L12 17.9736L7 12.9673M12 6.95978V16.9724V6.95978ZM12 1.95349C18.075 1.95349 23 6.88469 23 12.9673C23 19.05 18.075 23.9812 12 23.9812C5.925 23.9812 1 19.05 1 12.9673C1 6.88469 5.925 1.95349 12 1.95349Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const ChevronDownIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

export const FullscreenIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <ArrowsOutSimple size={size} weight="bold" className={className} />
);

export const QueueIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
  </svg>
);

export const DevicesIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <DeviceMobileSpeaker size={size} weight="regular" className={className} />
);

export const ChevronRightIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

export const PencilIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <PencilSimple size={size} weight="regular" className={className} />
);

export const TrashIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <Trash size={size} weight="regular" className={className} />
);

export const CheckIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <Check size={size} weight="bold" className={className} />
);
