import React from 'react';

interface ExecutiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ExecutiveButton({ children, className = '', ...props }: ExecutiveButtonProps) {
  return (
    <button
      className={`
        px-6 py-3 
        bg-gradient-to-r from-indigo-600 to-blue-600
        hover:from-indigo-700 hover:to-blue-700 
        text-white font-semibold 
        rounded-lg 
        shadow-md hover:shadow-lg 
        transition-all duration-200 
        transform hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function ExecutiveBadge({ children, variant = 'primary' }: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'success' | 'warning' 
}) {
  const variantStyles = {
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variantStyles[variant]}
    `}>
      {children}
    </span>
  );
}
