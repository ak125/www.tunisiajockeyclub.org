import React from 'react';

/**
 * Enhanced Button Component with Animation Support
 * Bouton amélioré avec support des animations
 */
interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  animation?: 'none' | 'bounce' | 'pulse' | 'glow' | 'slide';
  children: React.ReactNode;
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  animation = 'none',
  className = '',
  children,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
    overflow-hidden
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-turf-green-500 to-turf-green-600 
      text-white hover:from-turf-green-600 hover:to-turf-green-700
      focus:ring-turf-green-500 shadow-lg hover:shadow-xl
      active:scale-95
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-blue-600 
      text-white hover:from-blue-600 hover:to-blue-700
      focus:ring-blue-500 shadow-lg hover:shadow-xl
      active:scale-95
    `,
    outline: `
      border-2 border-turf-green-500 text-turf-green-600
      hover:bg-turf-green-500 hover:text-white
      focus:ring-turf-green-500
      active:scale-95
    `,
    ghost: `
      text-gray-600 hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-500
      active:scale-95
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      text-white hover:from-red-600 hover:to-red-700
      focus:ring-red-500 shadow-lg hover:shadow-xl
      active:scale-95
    `,
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const animations = {
    none: '',
    bounce: 'hover:animate-bounce-subtle',
    pulse: 'hover:animate-pulse',
    glow: `
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-700
    `,
    slide: 'hover:translate-x-1 hover:-translate-y-1',
  };

  const combinedClassName = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${animations[animation]}
    ${className}
  `;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Chargement...
        </>
      ) : (
        children
      )}
      
      {/* Effet de ripple */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-300 rounded-full" />
      </span>
    </button>
  );
}

/**
 * Enhanced Card Component with Animation Support
 * Carte améliorée avec support des animations
 */
interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  animation?: 'none' | 'hover' | 'float' | 'tilt';
  className?: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLDivElement>;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(({
  children,
  variant = 'default',
  animation = 'none',
  className = '',
  onClick,
}, ref) => {
  const baseClasses = `
    relative p-6 rounded-xl transition-all duration-300 ease-out
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const variants = {
    default: `
      bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
      hover:shadow-lg
    `,
    elevated: `
      bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl
      border border-gray-100 dark:border-gray-700
    `,
    glass: `
      bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
      border border-white/20 dark:border-gray-700/50
      shadow-xl
    `,
    gradient: `
      bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
      border border-gray-200 dark:border-gray-700
      shadow-lg hover:shadow-xl
    `,
  };

  const animations = {
    none: '',
    hover: 'hover:scale-[1.02] hover:-translate-y-1',
    float: 'hover:scale-105 hover:-translate-y-2',
    tilt: 'hover:rotate-1 hover:scale-105',
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${animations[animation]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

/**
 * Enhanced Input Component with Animation Support
 * Champ de saisie amélioré avec support des animations
 */
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  animation?: 'none' | 'focus' | 'glow';
}

export function AnimatedInput({
  label,
  error,
  success,
  animation = 'focus',
  className = '',
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const baseClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : success
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
    : 'border-gray-300 focus:border-turf-green-500 focus:ring-turf-green-500';

  const animations = {
    none: '',
    focus: 'focus:scale-[1.02]',
    glow: `
      focus:shadow-lg focus:shadow-turf-green-500/25
      ${isFocused ? 'shadow-lg shadow-turf-green-500/25' : ''}
    `,
  };

  return (
    <div className="relative">
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}
        `}>
          {label}
        </label>
      )}
      <input
        className={`${baseClasses} ${stateClasses} ${animations[animation]} ${className}`}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-slideInUp">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mt-1 text-sm text-green-600 animate-slideInUp">
          ✓ Valide
        </p>
      )}
    </div>
  );
}

/**
 * Enhanced Modal Component with Animation Support
 * Modal amélioré avec support des animations
 */
interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'flip';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
  animation = 'scale',
  size = 'md',
}: AnimatedModalProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const animations = {
    fade: isOpen ? 'opacity-100' : 'opacity-0',
    slide: isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
    scale: isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
    flip: isOpen ? 'rotateX-0 opacity-100' : 'rotateX-90 opacity-0',
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/50 backdrop-blur-sm transition-opacity duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0'}
    `}>
      <div
        className={`
          w-full ${sizes[size]} bg-white dark:bg-gray-800 rounded-xl shadow-2xl
          transform transition-all duration-300 ease-out
          ${animations[animation]}
        `}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span className="sr-only">Fermer</span>
              ✕
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Loading Spinner with Multiple Variants
 * Spinner de chargement amélioré avec plusieurs variantes
 */
interface LoadingSpinnerProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export function LoadingSpinner({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: { spinner: 'w-4 h-4', text: 'text-sm' },
    md: { spinner: 'w-8 h-8', text: 'text-base' },
    lg: { spinner: 'w-12 h-12', text: 'text-lg' },
  };

  const colors = {
    primary: 'text-turf-green-500',
    secondary: 'text-blue-500',
    white: 'text-white',
  };

  const spinners = {
    spinner: (
      <svg className={`animate-spin ${sizes[size].spinner} ${colors[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 ${colors[color]} rounded-full animate-pulse`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div className={`${sizes[size].spinner} ${colors[color]} rounded-full animate-pulse`} style={{ backgroundColor: 'currentColor' }} />
    ),
    bars: (
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1 h-4 ${colors[color]} animate-pulse`}
            style={{ 
              backgroundColor: 'currentColor',
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {spinners[variant]}
      {text && (
        <p className={`${sizes[size].text} ${colors[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}
