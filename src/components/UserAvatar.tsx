import { useState } from 'react';
import { useUserDetails } from '../hooks/useUserDetails';

interface UserAvatarProps {
  userId: string;
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar = ({ userId, displayName, size = 'md', className = '' }: UserAvatarProps) => {
  const { data: userProfile, isLoading } = useUserDetails(userId);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  const profileImage = userProfile?.images?.[0]?.url;
  const initials = displayName?.charAt(0)?.toUpperCase() || 'U';

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-700 animate-pulse ${className}`} />
    );
  }

  // Show image if available and no error
  if (profileImage && !imageError) {
    return (
      <img
        src={profileImage}
        alt={displayName}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to initials
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-600 flex items-center justify-center text-white font-medium ${className}`}>
      {initials}
    </div>
  );
};
