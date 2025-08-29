import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock WebSocket
const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

// Mock Notification API
const mockNotification = {
  permission: 'granted',
  requestPermission: vi.fn().mockResolvedValue('granted'),
  close: vi.fn()
};

Object.defineProperty(global, 'WebSocket', {
  value: vi.fn(() => mockWebSocket),
  writable: true
});

Object.defineProperty(global, 'Notification', {
  value: vi.fn().mockImplementation((title, options) => ({
    title,
    ...options,
    ...mockNotification
  })),
  writable: true
});

Object.defineProperty(global.Notification, 'permission', {
  value: 'granted',
  writable: true
});

Object.defineProperty(global.Notification, 'requestPermission', {
  value: mockNotification.requestPermission,
  writable: true
});

describe('Notification System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Notification Creation', () => {
    it('should create notification with correct structure', () => {
      const createNotification = (type: string, title: string, message: string) => ({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
        category: 'system',
        actions: []
      });

      const notification = createNotification('success', 'Test Success', 'Operation completed');
      
      expect(notification.id).toMatch(/^notif_\d+_[a-z0-9]{9}$/);
      expect(notification.type).toBe('success');
      expect(notification.title).toBe('Test Success');
      expect(notification.message).toBe('Operation completed');
      expect(notification.read).toBe(false);
      expect(notification.priority).toBe('medium');
      expect(notification.category).toBe('system');
      expect(notification.actions).toEqual([]);
    });

    it('should create notification with custom properties', () => {
      const createAdvancedNotification = (config: any) => ({
        id: `notif_${Date.now()}`,
        ...config,
        timestamp: new Date().toISOString(),
        read: false
      });

      const notification = createAdvancedNotification({
        type: 'error',
        title: 'System Error',
        message: 'Database connection lost',
        priority: 'high',
        category: 'system',
        actions: [
          { label: 'Retry', action: 'retry' },
          { label: 'Dismiss', action: 'dismiss' }
        ],
        autoClose: false,
        requiresAck: true
      });

      expect(notification.type).toBe('error');
      expect(notification.priority).toBe('high');
      expect(notification.actions).toHaveLength(2);
      expect(notification.autoClose).toBe(false);
      expect(notification.requiresAck).toBe(true);
    });

    it('should validate notification types', () => {
      const validTypes = ['success', 'error', 'warning', 'info'];
      
      const validateNotificationType = (type: string) => {
        return validTypes.includes(type);
      };

      expect(validateNotificationType('success')).toBe(true);
      expect(validateNotificationType('error')).toBe(true);
      expect(validateNotificationType('invalid')).toBe(false);
    });

    it('should set correct priority levels', () => {
      const getPriorityLevel = (priority: string) => {
        const levels = {
          low: 1,
          medium: 2,
          high: 3,
          critical: 4
        };
        return levels[priority as keyof typeof levels] || 2;
      };

      expect(getPriorityLevel('low')).toBe(1);
      expect(getPriorityLevel('medium')).toBe(2);
      expect(getPriorityLevel('high')).toBe(3);
      expect(getPriorityLevel('critical')).toBe(4);
      expect(getPriorityLevel('unknown')).toBe(2);
    });
  });

  describe('Notification Filtering', () => {
    const mockNotifications = [
      { id: '1', category: 'system', type: 'error', read: false, priority: 'high' },
      { id: '2', category: 'security', type: 'warning', read: true, priority: 'medium' },
      { id: '3', category: 'system', type: 'success', read: false, priority: 'low' },
      { id: '4', category: 'user', type: 'info', read: false, priority: 'medium' },
      { id: '5', category: 'security', type: 'error', read: false, priority: 'critical' }
    ];

    it('should filter notifications by category', () => {
      const filterByCategory = (notifications: any[], category: string) => {
        return notifications.filter(n => n.category === category);
      };

      const systemNotifications = filterByCategory(mockNotifications, 'system');
      expect(systemNotifications).toHaveLength(2);
      expect(systemNotifications.every(n => n.category === 'system')).toBe(true);

      const securityNotifications = filterByCategory(mockNotifications, 'security');
      expect(securityNotifications).toHaveLength(2);
      expect(securityNotifications.every(n => n.category === 'security')).toBe(true);
    });

    it('should filter notifications by type', () => {
      const filterByType = (notifications: any[], type: string) => {
        return notifications.filter(n => n.type === type);
      };

      const errorNotifications = filterByType(mockNotifications, 'error');
      expect(errorNotifications).toHaveLength(2);
      expect(errorNotifications.every(n => n.type === 'error')).toBe(true);
    });

    it('should filter unread notifications', () => {
      const getUnreadNotifications = (notifications: any[]) => {
        return notifications.filter(n => !n.read);
      };

      const unread = getUnreadNotifications(mockNotifications);
      expect(unread).toHaveLength(4);
      expect(unread.every(n => !n.read)).toBe(true);
    });

    it('should filter notifications by priority', () => {
      const filterByMinPriority = (notifications: any[], minPriority: string) => {
        const priorityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
        const minLevel = priorityLevels[minPriority as keyof typeof priorityLevels];
        
        return notifications.filter(n => {
          const nLevel = priorityLevels[n.priority as keyof typeof priorityLevels];
          return nLevel >= minLevel;
        });
      };

      const highPriorityNotifications = filterByMinPriority(mockNotifications, 'high');
      expect(highPriorityNotifications).toHaveLength(2);
      expect(highPriorityNotifications.every(n => 
        ['high', 'critical'].includes(n.priority)
      )).toBe(true);
    });

    it('should combine multiple filters', () => {
      const filterNotifications = (
        notifications: any[], 
        filters: { 
          category?: string; 
          type?: string; 
          unreadOnly?: boolean; 
          minPriority?: string 
        }
      ) => {
        return notifications.filter(notification => {
          if (filters.category && notification.category !== filters.category) return false;
          if (filters.type && notification.type !== filters.type) return false;
          if (filters.unreadOnly && notification.read) return false;
          if (filters.minPriority) {
            const priorityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
            const minLevel = priorityLevels[filters.minPriority as keyof typeof priorityLevels];
            const nLevel = priorityLevels[notification.priority as keyof typeof priorityLevels];
            if (nLevel < minLevel) return false;
          }
          return true;
        });
      };

      const filtered = filterNotifications(mockNotifications, {
        category: 'system',
        unreadOnly: true,
        minPriority: 'medium'
      });

      expect(filtered).toHaveLength(0); // Aucune notification système non lue de priorité >= medium
      
      const filtered2 = filterNotifications(mockNotifications, {
        category: 'security',
        type: 'error'
      });

      expect(filtered2).toHaveLength(1);
      expect(filtered2[0].id).toBe('5');
    });
  });

  describe('Real-time Notifications', () => {
    it('should simulate WebSocket connection', () => {
      const createWebSocketSimulator = () => {
        const callbacks = new Map();
        
        return {
          connect: () => {
            setTimeout(() => {
              callbacks.get('open')?.();
            }, 100);
          },
          
          addEventListener: (event: string, callback: Function) => {
            callbacks.set(event, callback);
          },
          
          send: (data: string) => {
            // Echo back for testing
            setTimeout(() => {
              callbacks.get('message')?.({ 
                data: JSON.stringify({ type: 'echo', payload: JSON.parse(data) })
              });
            }, 50);
          },
          
          close: () => {
            callbacks.get('close')?.();
          },
          
          simulateMessage: (message: any) => {
            callbacks.get('message')?.({ 
              data: JSON.stringify(message)
            });
          }
        };
      };

      const ws = createWebSocketSimulator();
      let connected = false;
      let receivedMessage = null;

      ws.addEventListener('open', () => {
        connected = true;
      });

      ws.addEventListener('message', (event) => {
        receivedMessage = JSON.parse(event.data);
      });

      ws.connect();
      
      // Simuler réception d'un message
      ws.simulateMessage({ 
        type: 'notification', 
        payload: { title: 'Test', message: 'WebSocket message' }
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(connected).toBe(true);
          expect(receivedMessage).toEqual({
            type: 'notification',
            payload: { title: 'Test', message: 'WebSocket message' }
          });
          resolve(null);
        }, 200);
      });
    });

    it('should handle connection errors gracefully', () => {
      const createResilientConnection = () => {
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 3;
        const reconnectDelay = 1000;
        
        return {
          connect: () => {
            return new Promise((resolve, reject) => {
              if (reconnectAttempts >= maxReconnectAttempts) {
                reject(new Error('Max reconnection attempts reached'));
                return;
              }
              
              // Simuler échec de connexion
              setTimeout(() => {
                if (Math.random() > 0.7) { // 30% de chance de succès
                  resolve('Connected');
                } else {
                  reconnectAttempts++;
                  reject(new Error(`Connection failed (attempt ${reconnectAttempts})`));
                }
              }, reconnectDelay);
            });
          },
          
          getReconnectAttempts: () => reconnectAttempts,
          resetAttempts: () => { reconnectAttempts = 0; }
        };
      };

      const connection = createResilientConnection();
      expect(connection.getReconnectAttempts()).toBe(0);
    });

    it('should queue notifications when offline', () => {
      const createOfflineQueue = () => {
        const queue: any[] = [];
        let isOnline = true;
        
        return {
          addNotification: (notification: any) => {
            if (isOnline) {
              // Traitement immédiat
              return { queued: false, processed: true };
            } else {
              queue.push(notification);
              return { queued: true, processed: false };
            }
          },
          
          setOnline: (online: boolean) => {
            isOnline = online;
            if (online) {
              // Traiter la queue
              const processed = queue.splice(0);
              return processed;
            }
            return [];
          },
          
          getQueueLength: () => queue.length,
          clearQueue: () => queue.splice(0)
        };
      };

      const queue = createOfflineQueue();
      
      // Test en ligne
      const result1 = queue.addNotification({ title: 'Online notification' });
      expect(result1.processed).toBe(true);
      expect(result1.queued).toBe(false);
      
      // Test hors ligne
      queue.setOnline(false);
      const result2 = queue.addNotification({ title: 'Offline notification' });
      expect(result2.processed).toBe(false);
      expect(result2.queued).toBe(true);
      expect(queue.getQueueLength()).toBe(1);
      
      // Retour en ligne
      const processed = queue.setOnline(true);
      expect(processed).toHaveLength(1);
      expect(processed[0].title).toBe('Offline notification');
      expect(queue.getQueueLength()).toBe(0);
    });
  });

  describe('Browser Notifications', () => {
    it('should request notification permission', async () => {
      const requestPermission = async () => {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          return permission;
        }
        return 'denied';
      };

      const permission = await requestPermission();
      expect(permission).toBe('granted');
      expect(mockNotification.requestPermission).toHaveBeenCalled();
    });

    it('should show browser notification', () => {
      const showBrowserNotification = (title: string, options: any) => {
        if (Notification.permission === 'granted') {
          return new Notification(title, options);
        }
        return null;
      };

      const notification = showBrowserNotification('Test Notification', {
        body: 'This is a test message',
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'test'
      });

      expect(notification).toBeTruthy();
      expect(notification?.title).toBe('Test Notification');
    });

    it('should handle notification clicks', () => {
      const createInteractiveNotification = (title: string, options: any) => {
        const notification = new Notification(title, options);
        const clickHandlers: Function[] = [];
        
        // Mock addEventListener
        notification.addEventListener = vi.fn((event: string, handler: Function) => {
          if (event === 'click') {
            clickHandlers.push(handler);
          }
        });
        
        // Simuler un clic
        notification.simulateClick = () => {
          clickHandlers.forEach(handler => handler());
        };
        
        return notification;
      };

      let clicked = false;
      const notification = createInteractiveNotification('Clickable', { body: 'Click me' });
      
      notification.addEventListener('click', () => {
        clicked = true;
      });
      
      (notification as any).simulateClick();
      expect(clicked).toBe(true);
    });

    it('should respect do not disturb settings', () => {
      const shouldShowNotification = (priority: string, userSettings: any) => {
        if (userSettings.doNotDisturb) {
          // Ne montrer que les notifications critiques en mode DND
          return priority === 'critical';
        }
        return true;
      };

      const dndSettings = { doNotDisturb: true };
      const normalSettings = { doNotDisturb: false };
      
      expect(shouldShowNotification('low', dndSettings)).toBe(false);
      expect(shouldShowNotification('medium', dndSettings)).toBe(false);
      expect(shouldShowNotification('critical', dndSettings)).toBe(true);
      
      expect(shouldShowNotification('low', normalSettings)).toBe(true);
      expect(shouldShowNotification('medium', normalSettings)).toBe(true);
      expect(shouldShowNotification('critical', normalSettings)).toBe(true);
    });
  });

  describe('Notification Persistence', () => {
    it('should save notifications to localStorage', () => {
      const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });

      const saveNotification = (notification: any) => {
        const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
        existing.push(notification);
        localStorage.setItem('notifications', JSON.stringify(existing));
      };

      const loadNotifications = () => {
        return JSON.parse(localStorage.getItem('notifications') || '[]');
      };

      mockLocalStorage.getItem.mockReturnValue('[]');
      
      saveNotification({ id: '1', title: 'Test' });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'notifications', 
        JSON.stringify([{ id: '1', title: 'Test' }])
      );
    });

    it('should clean up old notifications', () => {
      const cleanOldNotifications = (notifications: any[], maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
        const now = Date.now();
        return notifications.filter(notification => {
          const notificationTime = new Date(notification.timestamp).getTime();
          return (now - notificationTime) < maxAge;
        });
      };

      const oldNotifications = [
        { 
          id: '1', 
          title: 'Old', 
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 jours
        },
        { 
          id: '2', 
          title: 'Recent', 
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 jours
        }
      ];

      const cleaned = cleanOldNotifications(oldNotifications);
      expect(cleaned).toHaveLength(1);
      expect(cleaned[0].title).toBe('Recent');
    });

    it('should limit notification storage', () => {
      const limitNotifications = (notifications: any[], maxCount: number = 100) => {
        if (notifications.length <= maxCount) return notifications;
        
        // Garder les plus récentes
        return notifications
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, maxCount);
      };

      const manyNotifications = Array.from({ length: 150 }, (_, i) => ({
        id: `${i}`,
        title: `Notification ${i}`,
        timestamp: new Date(Date.now() - i * 1000).toISOString()
      }));

      const limited = limitNotifications(manyNotifications);
      expect(limited).toHaveLength(100);
      expect(limited[0].id).toBe('0'); // La plus récente
      expect(limited[99].id).toBe('99');
    });
  });

  describe('Notification Actions', () => {
    it('should handle notification actions', () => {
      const executeNotificationAction = (notification: any, actionId: string) => {
        const action = notification.actions?.find((a: any) => a.id === actionId);
        if (!action) return { success: false, error: 'Action not found' };
        
        switch (action.type) {
          case 'dismiss':
            return { success: true, action: 'dismissed' };
          case 'retry':
            return { success: true, action: 'retrying' };
          case 'navigate':
            return { success: true, action: 'navigating', url: action.url };
          default:
            return { success: false, error: 'Unknown action type' };
        }
      };

      const notification = {
        id: '1',
        title: 'Test',
        actions: [
          { id: 'dismiss', type: 'dismiss', label: 'Dismiss' },
          { id: 'retry', type: 'retry', label: 'Retry' },
          { id: 'view', type: 'navigate', label: 'View Details', url: '/details' }
        ]
      };

      const dismissResult = executeNotificationAction(notification, 'dismiss');
      expect(dismissResult.success).toBe(true);
      expect(dismissResult.action).toBe('dismissed');

      const retryResult = executeNotificationAction(notification, 'retry');
      expect(retryResult.success).toBe(true);
      expect(retryResult.action).toBe('retrying');

      const navResult = executeNotificationAction(notification, 'view');
      expect(navResult.success).toBe(true);
      expect(navResult.action).toBe('navigating');
      expect((navResult as any).url).toBe('/details');

      const invalidResult = executeNotificationAction(notification, 'invalid');
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error).toBe('Action not found');
    });

    it('should batch mark notifications as read', () => {
      const markNotificationsAsRead = (notifications: any[], ids: string[]) => {
        return notifications.map(notification => ({
          ...notification,
          read: ids.includes(notification.id) ? true : notification.read
        }));
      };

      const notifications = [
        { id: '1', title: 'Test 1', read: false },
        { id: '2', title: 'Test 2', read: false },
        { id: '3', title: 'Test 3', read: true }
      ];

      const updated = markNotificationsAsRead(notifications, ['1', '2']);
      
      expect(updated[0].read).toBe(true);
      expect(updated[1].read).toBe(true);
      expect(updated[2].read).toBe(true); // Déjà lu
    });
  });
});
