import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  placeholder,
  priority = false 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Default placeholder gradient
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNV8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzVfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMzIwIiB5Mj0iMTgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGOUZBRkIiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRjNGNEY2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K';

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* Actual Image */}
      {!error && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.05
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Image non disponible</span>
        </div>
      )}
    </div>
  );
}

// Horse avatar component with optimized loading
export function HorseAvatar({ horseName, className = "w-12 h-12" }: { horseName: string; className?: string }) {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600', 
    'from-purple-400 to-purple-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600'
  ];
  
  const colorIndex = horseName.length % colors.length;
  const gradient = colors[colorIndex];
  const initials = horseName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  return (
    <div className={`${className} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
      {initials}
    </div>
  );
}
