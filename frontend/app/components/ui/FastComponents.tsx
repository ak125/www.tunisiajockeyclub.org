import { type ComponentProps } from 'react';

interface OptimizedImageProps extends ComponentProps<'img'> {
  alt: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

// Ultra-light image component
export function OptimizedImage({ 
  alt, 
  loading = 'lazy',
  priority = false,
  className = '',
  ...props 
}: OptimizedImageProps) {
  // Ensure alt text is meaningful
  const validAlt = alt && alt.trim().length > 0 ? alt : 'Image décorative';
  
  return (
    <img
      {...props}
      alt={validAlt}
      loading={priority ? 'eager' : loading}
      className={`${className}`}
      aria-label={validAlt}
      decoding="async"
    />
  );
}

// Fast horse avatar component
export function FastHorseAvatar({ 
  name, 
  className = "w-12 h-12" 
}: { 
  name: string; 
  className?: string; 
}) {
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <div
      className={`${className} bg-blue-600 text-white rounded-full flex items-center justify-center font-bold`}
      role="img"
      aria-label={`Avatar du cheval ${name}`}
      title={`Cheval: ${name}`}
    >
      {initial}
    </div>
  );
}

// Fast rating badge component
export function FastRatingBadge({ 
  rating, 
  className = "" 
}: { 
  rating: number; 
  className?: string; 
}) {
  const color = rating >= 80 ? 'bg-green-100 text-green-800' 
    : rating >= 60 ? 'bg-yellow-100 text-yellow-800'
    : 'bg-red-100 text-red-800';
    
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}
      role="img"
      aria-label={`Rating: ${rating} points`}
      title={`Rating IFHA: ${rating}`}
    >
      {rating}
    </span>
  );
}

export default OptimizedImage;
