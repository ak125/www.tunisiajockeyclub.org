import { motion } from 'framer-motion';
import React from 'react';

// Utility function for class names
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Executive Badge - Version Premium
interface ExecutiveBadgeProps {
  variant?: 'authority' | 'certified' | 'premium' | 'exclusive' | 'ministerial' | 'international';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const ExecutiveBadge = ({ 
  variant = 'authority', 
  size = 'md', 
  children, 
  className,
  animate = true 
}: ExecutiveBadgeProps) => {
  const variants = {
    authority: 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-2xl border-indigo-800/20',
    certified: 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-2xl border-emerald-700/20',
    premium: 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-2xl border-amber-500/20',
    exclusive: 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-2xl border-purple-700/20',
    ministerial: 'bg-gradient-to-r from-red-800 to-red-900 text-white shadow-2xl border-red-700/20',
    international: 'bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-2xl border-blue-700/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold',
    md: 'px-4 py-2 text-sm font-bold',
    lg: 'px-6 py-3 text-base font-bold',
    xl: 'px-8 py-4 text-lg font-black'
  };

  const MotionBadge = motion.span;

  return (
    <MotionBadge
      className={cn(
        'inline-flex items-center rounded-full uppercase tracking-wider border',
        'backdrop-blur-sm transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      whileHover={animate ? { scale: 1.05, y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </MotionBadge>
  );
};

// Executive Button - Ultra Modern
interface ExecutiveButtonProps {
  variant?: 'primary' | 'secondary' | 'ministerial' | 'diplomatic' | 'emergency' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const ExecutiveButton = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left'
}: ExecutiveButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-2xl hover:shadow-3xl border-indigo-800/20',
    secondary: 'bg-white text-slate-900 border-2 border-slate-300 hover:border-slate-900 shadow-lg hover:shadow-2xl',
    ministerial: 'bg-gradient-to-r from-red-800 to-red-900 text-white shadow-2xl hover:shadow-3xl border-red-700/20',
    diplomatic: 'bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-2xl hover:shadow-3xl border-blue-700/20',
    emergency: 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl hover:shadow-3xl border-orange-500/20 animate-pulse',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-semibold',
    md: 'px-6 py-3 text-base font-bold',
    lg: 'px-8 py-4 text-lg font-bold',
    xl: 'px-12 py-5 text-xl font-black'
  };

  const MotionButton = motion.button;

  return (
    <MotionButton
      className={cn(
        'inline-flex items-center justify-center rounded-2xl transition-all duration-300',
        'focus:outline-none focus:ring-4 focus:ring-indigo-500/25',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'border backdrop-blur-sm',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
      } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>Traitement...</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {icon && iconPosition === 'left' && icon}
          <span>{children}</span>
          {icon && iconPosition === 'right' && icon}
        </div>
      )}
    </MotionButton>
  );
};

// Executive Status Indicator
interface ExecutiveStatusProps {
  status: 'operational' | 'warning' | 'critical' | 'maintenance' | 'optimal';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const ExecutiveStatus = ({ 
  status, 
  label, 
  size = 'md', 
  showPulse = true 
}: ExecutiveStatusProps) => {
  const statusConfig = {
    operational: { color: 'bg-emerald-500', text: 'OPÉRATIONNEL', textColor: 'text-emerald-700' },
    warning: { color: 'bg-yellow-500', text: 'ATTENTION', textColor: 'text-yellow-700' },
    critical: { color: 'bg-red-500', text: 'CRITIQUE', textColor: 'text-red-700' },
    maintenance: { color: 'bg-blue-500', text: 'MAINTENANCE', textColor: 'text-blue-700' },
    optimal: { color: 'bg-emerald-400', text: 'OPTIMAL', textColor: 'text-emerald-600' }
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={cn('rounded-full', config.color, sizes[size])} />
        {showPulse && (
          <motion.div
            className={cn('absolute inset-0 rounded-full', config.color, 'opacity-75')}
            animate={{ scale: [1, 1.5], opacity: [0.75, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      {label && (
        <span className={cn('text-sm font-bold uppercase tracking-wide', config.textColor)}>
          {label}
        </span>
      )}
    </div>
  );
};

// Executive Progress Ring
interface ExecutiveProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
}

export const ExecutiveProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  color = 'indigo',
  showValue = true
}: ExecutiveProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const colorClasses = {
    indigo: { stroke: 'stroke-indigo-600', bg: 'stroke-indigo-100', text: 'text-indigo-600' },
    emerald: { stroke: 'stroke-emerald-600', bg: 'stroke-emerald-100', text: 'text-emerald-600' },
    red: { stroke: 'stroke-red-600', bg: 'stroke-red-100', text: 'text-red-600' },
    yellow: { stroke: 'stroke-yellow-600', bg: 'stroke-yellow-100', text: 'text-yellow-600' }
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={cn('fill-none', colors.bg)}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={cn('fill-none', colors.stroke)}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={cn('text-2xl font-black', colors.text)}>{value}%</div>
              {label && (
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {label}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Executive Alert Component
interface ExecutiveAlertProps {
  variant: 'info' | 'success' | 'warning' | 'critical' | 'ministerial';
  title: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ExecutiveAlert = ({
  variant,
  title,
  message,
  dismissible = false,
  onDismiss,
  action
}: ExecutiveAlertProps) => {
  const variants = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      title: 'text-blue-900',
      message: 'text-blue-700'
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      icon: '✅',
      iconBg: 'bg-emerald-100',
      title: 'text-emerald-900',
      message: 'text-emerald-700'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: '⚠️',
      iconBg: 'bg-yellow-100',
      title: 'text-yellow-900',
      message: 'text-yellow-700'
    },
    critical: {
      bg: 'bg-red-50 border-red-200',
      icon: '🚨',
      iconBg: 'bg-red-100',
      title: 'text-red-900',
      message: 'text-red-700'
    },
    ministerial: {
      bg: 'bg-purple-50 border-purple-200',
      icon: '🏛️',
      iconBg: 'bg-purple-100',
      title: 'text-purple-900',
      message: 'text-purple-700'
    }
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        'rounded-2xl border-2 p-6 shadow-lg',
        config.bg
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center', config.iconBg)}>
          <span className="text-xl">{config.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn('text-lg font-black mb-2', config.title)}>
            {title}
          </h3>
          <p className={cn('text-sm font-medium leading-relaxed', config.message)}>
            {message}
          </p>
          
          {action && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="mt-4 px-4 py-2 bg-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              {action.label}
            </motion.button>
          )}
        </div>

        {dismissible && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
            className="w-8 h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
          >
            <span className="text-slate-500 font-bold">×</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
