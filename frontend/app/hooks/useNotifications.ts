import { useState, useEffect, useCallback, useRef } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'security';
  title: string;
  message: string;
  timestamp: string;
  userId?: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'license' | 'race' | 'compliance' | 'security';
  actionUrl?: string;
  data?: any;
}

interface UseNotificationsOptions {
  userId: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxRetries?: number;
}

export const useNotifications = ({
  userId,
  autoConnect = true,
  reconnectInterval = 5000,
  maxRetries = 5
}: UseNotificationsOptions) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulateur de notifications (en attendant un vrai WebSocket serveur)
  const startNotificationSimulator = useCallback(() => {
    const notifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        type: 'success',
        title: 'Nouvelle licence approuvée',
        message: 'Licence jockey #TJC-2025 validée avec succès',
        priority: 'medium',
        category: 'license',
        actionUrl: '/licenses'
      },
      {
        type: 'info',
        title: 'Course programmée',
        message: 'Grand Prix National - Hippodrome de Tunis, 15 Septembre',
        priority: 'medium',
        category: 'race',
        actionUrl: '/races'
      },
      {
        type: 'warning',
        title: 'Maintenance programmée',
        message: 'Système en maintenance demain de 2h à 4h du matin',
        priority: 'high',
        category: 'system'
      },
      {
        type: 'security',
        title: 'Nouvelle connexion détectée',
        message: `Connexion administrateur depuis une nouvelle IP`,
        priority: 'high',
        category: 'security',
        userId
      },
      {
        type: 'error',
        title: 'Échec de synchronisation',
        message: 'Erreur lors de la synchronisation avec le système externe',
        priority: 'critical',
        category: 'system'
      }
    ];

    const sendRandomNotification = () => {
      if (Math.random() > 0.7) { // 30% de chance d'envoyer une notification
        const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
        const notification: Notification = {
          ...randomNotif,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false
        };

        setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Garder max 50 notifications
        setUnreadCount(prev => prev + 1);

        // Notification browser si supporté et autorisé
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id
          });
        }
      }
    };

    // Envoyer une notification toutes les 30-60 secondes
    const interval = setInterval(sendRandomNotification, Math.random() * 30000 + 30000);
    
    // Notification de bienvenue
    setTimeout(() => {
      const welcomeNotif: Notification = {
        id: `welcome_${Date.now()}`,
        type: 'success',
        title: 'Système de notifications activé',
        message: 'Vous recevrez maintenant les alertes en temps réel',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
        category: 'system',
        userId
      };
      setNotifications(prev => [welcomeNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [userId]);

  // Connecter WebSocket (simulé pour l'instant)
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');
    
    try {
      // Simulation d'une connexion WebSocket
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('connected');
        retryCountRef.current = 0;
        
        // Démarrer le simulateur de notifications
        const cleanup = startNotificationSimulator();
        
        // Stocker la fonction de nettoyage
        wsRef.current = {
          close: cleanup,
          readyState: WebSocket.OPEN
        } as any;

      }, 1000);

    } catch (error) {
      console.error('Erreur connexion WebSocket:', error);
      setConnectionStatus('error');
      setIsConnected(false);
      
      // Gestion de la reconnexion inline pour éviter la dépendance circulaire
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      } else {
        setConnectionStatus('error');
      }
    }
  }, [startNotificationSimulator, maxRetries, reconnectInterval]);

  // Déconnecter
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      if (typeof wsRef.current.close === 'function') {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  // Actions sur les notifications
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notif = prev.find(n => n.id === notificationId);
      if (notif && !notif.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Filtrer les notifications
  const getNotificationsByCategory = useCallback((category: Notification['category']) => {
    return notifications.filter(notif => notif.category === category);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notif => !notif.read);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority: Notification['priority']) => {
    return notifications.filter(notif => notif.priority === priority);
  }, [notifications]);

  // Demander permission pour les notifications browser
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Auto-connexion
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getUnreadNotifications,
    getNotificationsByPriority,
    requestNotificationPermission
  };
};
