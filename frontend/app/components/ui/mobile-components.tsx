import { motion } from "framer-motion";
import { useState } from "react";
import { ExecutiveBadge, ExecutiveButton } from "./executive-components";

interface MobileNavigationProps {
  currentUser: any;
  systemHealth: any;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const MobileNavigation = ({ 
  currentUser, 
  systemHealth, 
  onNavigate, 
  currentPath 
}: MobileNavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Dashboard", path: "/secure-dashboard", icon: "🏛️", color: "from-indigo-500 to-indigo-600" },
    { label: "Licences", path: "/licenses", icon: "📋", color: "from-emerald-500 to-emerald-600" },
    { label: "Analytics", path: "/analytics", icon: "📊", color: "from-purple-500 to-purple-600" },
    { label: "Interface", path: "/professional-demo", icon: "🎨", color: "from-blue-500 to-blue-600" }
  ];

  const quickActions = [
    { label: "Nouvelle Licence", action: () => {}, icon: "➕", color: "bg-green-500" },
    { label: "Export Données", action: () => {}, icon: "📄", color: "bg-blue-500" },
    { label: "Rapport Urgent", action: () => {}, icon: "🚨", color: "bg-red-500" }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & User */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏇</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800">TJC Admin</h1>
                <p className="text-xs text-slate-600">{currentUser.firstName}</p>
              </div>
            </div>

            {/* Status & Menu */}
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${systemHealth.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <ExecutiveButton
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? '✕' : '☰'}
              </ExecutiveButton>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Navigation Items */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Navigation</h3>
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      currentPath === item.path 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                      {item.icon}
                    </div>
                    <span className={`font-medium ${currentPath === item.path ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Actions Rapides</h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white text-sm mb-2`}>
                        {action.icon}
                      </div>
                      <span className="text-xs font-medium text-slate-600 text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Info & Logout */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{currentUser.firstName} {currentUser.lastName}</p>
                      <ExecutiveBadge variant="authority" size="sm">
                        {currentUser.role.replace('_', ' ').toUpperCase()}
                      </ExecutiveBadge>
                    </div>
                  </div>
                  
                  <form action="/logout" method="post">
                    <ExecutiveButton variant="ghost" size="sm">
                      🚪
                    </ExecutiveButton>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

// Composant de cartes métriques optimisé mobile
interface MobileMetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  onClick?: () => void;
}

export const MobileMetricCard = ({ title, value, change, icon, color, onClick }: MobileMetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 active:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
          {icon}
        </div>
        <ExecutiveBadge variant="premium" size="sm">
          {change}
        </ExecutiveBadge>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-800">{value}</h3>
        <p className="text-sm text-slate-600 leading-tight">{title}</p>
      </div>
    </motion.div>
  );
};

// Composant de liste optimisé mobile
interface MobileListItemProps {
  title: string;
  subtitle: string;
  status?: string;
  statusColor?: string;
  timestamp?: string;
  onClick?: () => void;
  actions?: Array<{ label: string; onClick: () => void; color?: string }>;
}

export const MobileListItem = ({ 
  title, 
  subtitle, 
  status, 
  statusColor = 'bg-gray-500', 
  timestamp, 
  onClick, 
  actions = [] 
}: MobileListItemProps) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl p-4 mb-3 active:bg-slate-50 transition-colors"
    >
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">{title}</h3>
            <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
          </div>
          
          {status && (
            <div className="flex items-center space-x-1 ml-3">
              <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
              <span className="text-xs font-medium text-slate-600">{status}</span>
            </div>
          )}
        </div>

        {timestamp && (
          <p className="text-xs text-slate-500">{timestamp}</p>
        )}
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <ExecutiveButton
              size="sm"
              variant="ghost"
              onClick={() => setShowActions(!showActions)}
            >
              {showActions ? 'Masquer' : 'Actions'} {showActions ? '▲' : '▼'}
            </ExecutiveButton>
          </div>

          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 flex gap-2 flex-wrap"
            >
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    action.color || 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Composant de bottom sheet mobile
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const MobileBottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxHeight = "80vh" 
}: MobileBottomSheetProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50"
        style={{ maxHeight }}
      >
        <div className="p-4">
          {/* Handle */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <ExecutiveButton variant="ghost" size="sm" onClick={onClose}>
              ✕
            </ExecutiveButton>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
            {children}
          </div>
        </div>
      </motion.div>
    </>
  );
};
