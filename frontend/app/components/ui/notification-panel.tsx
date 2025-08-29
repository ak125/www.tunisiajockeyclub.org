import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  notificationService, 
  notificationUtils,
  mockNotifications,
  type Notification 
} from "../../utils/notifications.client";
import { ExecutiveBadge, ExecutiveButton } from "./executive-components";

interface NotificationPanelProps {
  className?: string;
  maxVisible?: number;
  showMockData?: boolean;
}

export const NotificationPanel = ({ 
  className = "",
  maxVisible = 10,
  showMockData = true 
}: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // S'abonner aux notifications en temps réel
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(prev => {
        const combined = [...newNotifications, ...prev];
        const unique = combined.filter((notif, index, self) => 
          index === self.findIndex(n => n.id === notif.id)
        );
        return notificationUtils.sortNotifications(unique).slice(0, 50); // Garder max 50
      });
    });

    // Charger les notifications initiales
    loadNotifications();

    // Générer des données de démo si demandé
    if (showMockData) {
      generateMockData();
    }

    return unsubscribe;
  }, [showMockData]);

  // Calculer le nombre de non-lus
  useEffect(() => {
    const activeNotifications = notificationUtils.filterActive(notifications);
    setUnreadCount(activeNotifications.filter(n => !n.read).length);
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(notificationUtils.sortNotifications(data.notifications));
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    // Générer quelques notifications de démo
    const mockData = [
      mockNotifications.generateSystemNotification(),
      mockNotifications.generateLicenseExpiry(),
      mockNotifications.generateRaceUpdate(),
    ];
    
    // Ajouter une alerte de sécurité de temps en temps
    if (Math.random() > 0.7) {
      mockData.push(mockNotifications.generateSecurityAlert());
    }
    
    // Ajouter une alerte de conformité de temps en temps
    if (Math.random() > 0.8) {
      mockData.push(mockNotifications.generateComplianceAlert());
    }

    setNotifications(prev => {
      const combined = [...mockData, ...prev];
      const unique = combined.filter((notif, index, self) => 
        index === self.findIndex(n => n.id === notif.id)
      );
      return notificationUtils.sortNotifications(unique);
    });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead([notificationId]);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erreur marquage tout lu:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de notification avec badge */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <span className="text-xl">🔔</span>
        
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Panel des notifications */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-16 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[600px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔔</span>
                    <div>
                      <h3 className="font-semibold text-slate-800">Notifications</h3>
                      <p className="text-sm text-slate-600">
                        {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <ExecutiveButton
                        onClick={handleMarkAllAsRead}
                        variant="ghost"
                        size="sm"
                      >
                        Tout marquer lu
                      </ExecutiveButton>
                    )}
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="overflow-y-auto max-h-[500px]">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-600">Chargement...</p>
                  </div>
                ) : visibleNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📭</span>
                    </div>
                    <p className="text-slate-600">Aucune notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {visibleNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-slate-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/30 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icône de catégorie */}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                            notificationUtils.getTypeColor(notification.type)
                          }`}>
                            {notificationUtils.getCategoryIcon(notification.category)}
                          </div>
                          
                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-slate-800 truncate">
                                {notification.title}
                              </h4>
                              
                              <div className="flex items-center space-x-2">
                                <ExecutiveBadge 
                                  variant={
                                    notification.priority === 'urgent' ? 'ministerial' :
                                    notification.priority === 'high' ? 'premium' :
                                    notification.priority === 'medium' ? 'authority' : 'certified'
                                  }
                                  size="sm"
                                >
                                  {notification.priority}
                                </ExecutiveBadge>
                                
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {notificationUtils.getTimeAgo(notification.timestamp)}
                              </span>
                              
                              <div className="flex items-center space-x-2">
                                {notification.actionUrl && (
                                  <a
                                    href={notification.actionUrl}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    {notification.actionLabel || 'Voir'}
                                  </a>
                                )}
                                
                                {!notification.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                                  >
                                    Marquer lu
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => handleDelete(notification.id)}
                                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > maxVisible && (
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => {/* Navigate to full notifications page */}}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Voir toutes les notifications ({notifications.length})
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant de notification toast
export const NotificationToast = ({ 
  notification, 
  onClose 
}: { 
  notification: Notification; 
  onClose: () => void; 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close après 5 secondes
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className={`max-w-sm p-4 rounded-2xl shadow-2xl border-l-4 ${
        notificationUtils.getTypeColor(notification.type)
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-lg">
          {notificationUtils.getCategoryIcon(notification.category)}
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
          <p className="text-sm opacity-90 mb-2">{notification.message}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">
              {notificationUtils.getTimeAgo(notification.timestamp)}
            </span>
            
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-xs font-medium underline"
                onClick={onClose}
              >
                {notification.actionLabel || 'Voir'}
              </a>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-lg opacity-50 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};
