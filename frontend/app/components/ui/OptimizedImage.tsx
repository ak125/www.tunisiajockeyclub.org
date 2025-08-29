import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  ariaLabel?: string;
  role?: string;
  priority?: boolean;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  width, 
  height,
  loading = 'lazy',
  ariaLabel,
  role,
  priority = false,
  fallback = '/images/placeholder.jpg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Validation alt text selon standards d'accessibilité
  const hasValidAltText = alt && alt.trim().length > 0 && !alt.toLowerCase().includes('photo') && !alt.toLowerCase().includes('image');
  
  if (!hasValidAltText && !ariaLabel) {
    console.warn(`OptimizedImage: Alt text devrait être descriptif pour ${src}. Évitez "photo" ou "image".`);
  }

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
      )}
      
      <motion.img 
        src={imageError ? fallback : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        aria-label={ariaLabel || alt}
        role={role}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    </div>
  );
}

interface HorseAvatarProps {
  horse: {
    id?: string;
    name: string;
    breed?: string;
    age?: number;
    rating?: number;
    color?: string;
  };
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showRating?: boolean;
}

export function HorseAvatar({ 
  horse,
  imageUrl, 
  size = 'md',
  className = "",
  showRating = false
}: HorseAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Alt text descriptif complet selon les standards
  const getHorseAltText = () => {
    const parts = [horse.name];
    
    if (horse.breed) parts.push(`race ${horse.breed}`);
    if (horse.age) parts.push(`âgé de ${horse.age} ans`);
    if (horse.color) parts.push(`robe ${horse.color}`);
    if (horse.rating) parts.push(`rating ${horse.rating}`);
    
    return parts.join(', ');
  };

  if (imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <OptimizedImage
          src={imageUrl}
          alt={getHorseAltText()}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          ariaLabel={`Avatar ${getHorseAltText()}`}
          role="img"
          fallback="/images/horse-placeholder.jpg"
        />
        
        {showRating && horse.rating && (
          <RatingBadge 
            rating={horse.rating} 
            className="absolute -top-1 -right-1"
            ariaLabel={`Rating IFHA de ${horse.name}: ${horse.rating} points`}
          />
        )}
      </div>
    );
  }

  // Avatar par défaut avec initiale
  const initial = horse.name.charAt(0).toUpperCase();
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}
        aria-label={`Avatar ${getHorseAltText()}`}
        role="img"
      >
        {initial}
      </div>
      
      {showRating && horse.rating && (
        <RatingBadge 
          rating={horse.rating} 
          className="absolute -top-1 -right-1"
          ariaLabel={`Rating IFHA de ${horse.name}: ${horse.rating} points`}
        />
      )}
    </div>
  );
}

interface JockeyAvatarProps {
  jockey: {
    id?: string;
    name: string;
    nationality?: string;
    wins?: number;
    experience?: number;
  };
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStats?: boolean;
}

export function JockeyAvatar({ 
  jockey,
  imageUrl, 
  size = 'md',
  className = "",
  showStats = false
}: JockeyAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Alt text descriptif pour jockey selon les standards
  const getJockeyAltText = () => {
    const parts = [`Jockey ${jockey.name}`];
    
    if (jockey.nationality) parts.push(`nationalité ${jockey.nationality}`);
    if (jockey.wins) parts.push(`${jockey.wins} victoires`);
    if (jockey.experience) parts.push(`${jockey.experience} ans d'expérience`);
    
    return parts.join(', ');
  };

  if (imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <OptimizedImage
          src={imageUrl}
          alt={getJockeyAltText()}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-blue-200`}
          ariaLabel={`Avatar ${getJockeyAltText()}`}
          role="img"
          fallback="/images/jockey-placeholder.jpg"
        />
        
        {showStats && jockey.wins && (
          <div 
            className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[1.5rem] text-center"
            aria-label={`${jockey.wins} victoires pour ${jockey.name}`}
            role="status"
          >
            {jockey.wins}
          </div>
        )}
      </div>
    );
  }

  // Avatar par défaut avec initiale
  const initial = jockey.name.charAt(0).toUpperCase();
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-blue-200`}
        aria-label={`Avatar ${getJockeyAltText()}`}
        role="img"
      >
        {initial}
      </div>
      
      {showStats && jockey.wins && (
        <div 
          className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[1.5rem] text-center"
          aria-label={`${jockey.wins} victoires pour ${jockey.name}`}
          role="status"
        >
          {jockey.wins}
        </div>
      )}
    </div>
  );
}

interface RatingBadgeProps {
  rating: number;
  confidence?: number;
  scale?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export function RatingBadge({ 
  rating, 
  confidence, 
  scale = "Tunisia", 
  className = "",
  size = 'sm',
  ariaLabel
}: RatingBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 120) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (rating >= 110) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 100) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 90) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rating >= 75) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getRatingLevel = (rating: number) => {
    if (rating >= 120) return 'Élite internationale';
    if (rating >= 110) return 'Très haut niveau';
    if (rating >= 100) return 'Haut niveau';
    if (rating >= 90) return 'Bon niveau';
    if (rating >= 75) return 'Niveau moyen';
    return 'Niveau débutant';
  };

  const defaultAriaLabel = `Rating ${rating} sur échelle ${scale} - ${getRatingLevel(rating)}${confidence ? ` avec ${confidence}% de confiance` : ''}`;

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses[size]} ${getRatingColor(rating)} ${className}`}
      aria-label={ariaLabel || defaultAriaLabel}
      role="status"
      title={defaultAriaLabel}
    >
      {rating} {scale}
      {confidence && (
        <span className="ml-1 opacity-75">
          ({confidence}%)
        </span>
      )}
    </span>
  );
}

interface TrackImageProps {
  trackId?: string;
  trackName: string;
  location?: string;
  surface?: string;
  distance?: string;
  imageUrl?: string;
  className?: string;
}

export function TrackImage({ 
  trackId,
  trackName, 
  location, 
  surface, 
  distance, 
  imageUrl,
  className = '' 
}: TrackImageProps) {
  // Alt text descriptif pour hippodrome
  const getTrackAltText = () => {
    const parts = [`Hippodrome ${trackName}`];
    
    if (location) parts.push(`situé à ${location}`);
    if (surface) parts.push(`surface ${surface}`);
    if (distance) parts.push(`distance ${distance}`);
    
    return parts.join(', ');
  };

  return (
    <OptimizedImage
      src={imageUrl || `/images/tracks/${trackId || 'default'}.jpg`}
      alt={getTrackAltText()}
      className={`rounded-lg shadow-md ${className}`}
      fallback="/images/track-placeholder.jpg"
      ariaLabel={`Vue ${getTrackAltText()}`}
    />
  );
}
