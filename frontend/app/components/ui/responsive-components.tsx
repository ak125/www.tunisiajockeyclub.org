import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Hook pour détecter la taille d'écran
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    isLargeScreen: windowSize.width >= 1440,
  };
};

// Composant de navigation mobile
export const MobileNavigation = ({ 
  isOpen, 
  onClose,
  user,
  systemHealth 
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  systemHealth: any;
}) => {
  const navItems = [
    { label: "Dashboard", href: "/secure-dashboard", icon: "🏛️" },
    { label: "Licences", href: "/licenses", icon: "📋" },
    { label: "Analytics", href: "/analytics", icon: "📊" },
    { label: "Interface Demo", href: "/professional-demo", icon: "🎨" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu mobile */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏇</span>
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Club Jockey</h2>
                <p className="text-sm text-slate-600">Tunisie</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-600">{user.role.replace('_', ' ')}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              systemHealth.isHealthy ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 group"
                onClick={onClose}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.label}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors"
            >
              <span>🚪</span>
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

// Header mobile adaptatif
export const ResponsiveHeader = ({
  title,
  subtitle,
  user,
  systemHealth,
  onMenuToggle,
  actions
}: {
  title: string;
  subtitle?: string;
  user: any;
  systemHealth: any;
  onMenuToggle?: () => void;
  actions?: React.ReactNode;
}) => {
  const { isMobile } = useResponsive();

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-3">
            {/* Menu burger sur mobile */}
            {isMobile && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors lg:hidden"
              >
                <div className="space-y-1">
                  <div className="w-5 h-0.5 bg-slate-600 rounded"></div>
                  <div className="w-5 h-0.5 bg-slate-600 rounded"></div>
                  <div className="w-5 h-0.5 bg-slate-600 rounded"></div>
                </div>
              </button>
            )}

            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔐</span>
              </div>
              <div>
                <h1 className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  {isMobile ? title.split(' ')[0] : title}
                </h1>
                {subtitle && !isMobile && (
                  <p className="text-sm text-slate-600">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* System status - masqué sur très petits écrans */}
            {!isMobile && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemHealth.isHealthy ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-slate-600 hidden sm:block">
                  {systemHealth.isHealthy ? 'Opérationnel' : 'Maintenance'}
                </span>
              </div>
            )}

            {/* Actions personnalisées */}
            {actions}

            {/* User avatar sur desktop */}
            {!isMobile && (
              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-32">
                    {user.firstName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Grid responsive adaptatif
export const ResponsiveGrid = ({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}: {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
}) => {
  const gridClasses = `grid gap-4 sm:gap-6 ${className}
    grid-cols-${cols.mobile || 1}
    md:grid-cols-${cols.tablet || 2}
    lg:grid-cols-${cols.desktop || 3}
    xl:grid-cols-${cols.large || 4}
  `;

  return <div className={gridClasses}>{children}</div>;
};

// Card responsive
export const ResponsiveCard = ({
  children,
  className = "",
  padding = "normal"
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "small" | "normal" | "large";
}) => {
  const { isMobile } = useResponsive();
  
  const paddingClasses = {
    none: "",
    small: isMobile ? "p-3" : "p-4",
    normal: isMobile ? "p-4" : "p-6",
    large: isMobile ? "p-6" : "p-8"
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/60 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

// Table responsive avec scroll horizontal
export const ResponsiveTable = ({
  headers,
  data,
  renderRow,
  className = ""
}: {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  className?: string;
}) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    // Version mobile: Cards au lieu de table
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            {renderRow(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // Version desktop: Table normale
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};

// Composant de métriques responsive
export const ResponsiveMetrics = ({
  metrics,
  className = ""
}: {
  metrics: Array<{
    label: string;
    value: string | number;
    change?: string;
    icon: string;
    color: string;
  }>;
  className?: string;
}) => {
  const { isMobile, isTablet } = useResponsive();

  // Déterminer le nombre de colonnes
  const cols = isMobile ? 1 : isTablet ? 2 : metrics.length > 4 ? 4 : metrics.length;

  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
              {metric.icon}
            </div>
            {metric.change && (
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-lg">
                {metric.change}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
              {metric.value}
            </h3>
            <p className="text-sm text-slate-600">{metric.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Composant modal responsive
export const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium"
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
}) => {
  const { isMobile } = useResponsive();

  const sizeClasses = {
    small: isMobile ? "w-full h-full" : "w-96 max-h-96",
    medium: isMobile ? "w-full h-full" : "w-[500px] max-h-[600px]",
    large: isMobile ? "w-full h-full" : "w-[800px] max-h-[700px]",
    full: "w-full h-full"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden ${sizeClasses[size]} ${
          isMobile ? 'rounded-none' : ''
        }`}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
