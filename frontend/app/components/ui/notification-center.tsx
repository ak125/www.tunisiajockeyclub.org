import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNotifications, type Notification } from "../../hooks/useNotifications";
import { ExecutiveBadge, ExecutiveButton } from "./executive-components";

interface NotificationCenterProps {
  userId: string;
  className?: string;
}

export const NotificationCenter = ({ userId, className = "" }: NotificationCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['category']>('all');
  
  const {
    notifications,
    unreadCount,
    isConnected,
    connectionStatus,
    connect,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getUnreadNotifications,
    requestNotificationPermission
  } = useNotifications({ userId, autoConnect: true });

  // Demander permission pour notifications browser au montage
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // Filtrer les notifications
  const filteredNotifications = (() => {
    switch (filter) {
      case 'unread':
        return getUnreadNotifications();
      case 'all':
        return notifications;
      default:
        return getNotificationsByCategory(filter as Notification['category']);
    }
  })();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'security': return '🔒';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'critical') return 'border-l-red-500 bg-red-50';
    
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'security': return 'border-l-purple-500 bg-purple-50';
      default: return 'border-l-slate-500 bg-slate-50';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return { variant: 'ministerial' as const, label: 'CRITIQUE' };
      case 'high': return { variant: 'premium' as const, label: 'HAUTE' };
      case 'medium': return { variant: 'authority' as const, label: 'MOYENNE' };
      case 'low': return { variant: 'certified' as const, label: 'BASSE' };
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de notification */}
      <ExecutiveButton
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3"
      >
        <div className="relative">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </motion.div>
          )}
          
          {/* Indicateur de connexion */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getConnectionStatusColor()}`}></div>
        </div>
      </ExecutiveButton>

      {/* Panel de notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/60 z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
                  <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <ExecutiveButton
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Tout marquer lu
                    </ExecutiveButton>
                  )}
                  
                  <ExecutiveButton
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </ExecutiveButton>
                </div>
              </div>

              {/* Statut de connexion */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-slate-600">
                  <span>État:</span>
                  <span className={`font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionStatus === 'connected' ? 'Connecté' :
                     connectionStatus === 'connecting' ? 'Connexion...' :
                     connectionStatus === 'error' ? 'Erreur' : 'Déconnecté'}
                  </span>
                </div>
                
                {!isConnected && (
                  <ExecutiveButton size="sm" variant="ghost" onClick={connect}>
                    Reconnecter
                  </ExecutiveButton>
                )}
              </div>

              {/* Filtres */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[
                  { key: 'all', label: 'Toutes' },
                  { key: 'unread', label: 'Non lues' },
                  { key: 'system', label: 'Système' },
                  { key: 'security', label: 'Sécurité' },
                  { key: 'license', label: 'Licences' }
                ].map(filterOption => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      filter === filterOption.key
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-l-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                        getNotificationColor(notification.type, notification.priority)
                      } ${!notification.read ? 'bg-opacity-80' : 'bg-opacity-30'}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`text-sm font-bold text-slate-800 ${!notification.read ? 'font-black' : ''}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <ExecutiveBadge 
                                  variant={getPriorityBadge(notification.priority).variant}
                                  size="sm"
                                >
                                  {getPriorityBadge(notification.priority).label}
                                </ExecutiveBadge>
                                
                                <span className="text-xs text-slate-500">
                                  {new Date(notification.timestamp).toLocaleString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {notification.actionUrl && (
                                  <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors">
                                    Voir
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="font-medium">Aucune notification</p>
                    <p className="text-sm">
                      {filter === 'unread' ? 'Toutes les notifications ont été lues' : 'Tout est calme pour le moment'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
                  </span>
                  
                  <ExecutiveButton
                    size="sm"
                    variant="ghost"
                    onClick={clearAllNotifications}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Tout supprimer
                  </ExecutiveButton>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay pour fermer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
