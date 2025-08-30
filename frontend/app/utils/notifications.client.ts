// Service de notifications simplifié avec curl/fetch
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'security';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'license' | 'race' | 'compliance' | 'user' | 'security';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  expiresAt?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  lastCheck: string;
  hasMore: boolean;
}

// Service simple avec curl/fetch
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api';
  private pollingInterval: number | null = null;
  private callbacks: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    // Démarrer le polling intelligent
    this.startPolling();
  }

  // Polling intelligent avec intervalles adaptatifs
  private startPolling() {
    let interval = 10000; // 10 secondes par défaut
    let consecutiveEmptyResponses = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/notifications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data: NotificationResponse = await response.json();
          
          if (data.notifications.length > 0) {
            // Reset l'intervalle si on reçoit des notifications
            interval = 10000;
            consecutiveEmptyResponses = 0;
            this.notifyCallbacks(data.notifications);
          } else {
            // Augmenter progressivement l'intervalle si pas de nouvelles notifs
            consecutiveEmptyResponses++;
            if (consecutiveEmptyResponses > 3) {
              interval = Math.min(60000, interval * 1.2); // Max 1 minute
            }
          }
        }
      } catch (error) {
        console.error('Erreur récupération notifications:', error);
        // Réduire la fréquence en cas d'erreur
        interval = Math.min(30000, interval * 1.5);
      }

      // Programmer le prochain appel
      this.pollingInterval = window.setTimeout(poll, interval);
    };

    // Démarrer immédiatement
    poll();
  }

  // Arrêter le polling
  stopPolling() {
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // S'abonner aux notifications
  subscribe(callback: (notifications: Notification[]) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifyCallbacks(notifications: Notification[]) {
    this.callbacks.forEach(callback => callback(notifications));
  }

  // API simplifiées avec curl-like calls

  // Récupérer toutes les notifications
  async getNotifications(page = 1, limit = 20): Promise<NotificationResponse> {
    const response = await fetch(`${this.apiUrl}/notifications?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Marquer comme lu
  async markAsRead(notificationIds: string[]): Promise<void> {
    await fetch(`${this.apiUrl}/notifications/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ids: notificationIds })
    });
  }

  // Marquer toutes comme lues
  async markAllAsRead(): Promise<void> {
    await fetch(`${this.apiUrl}/notifications/mark-all-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
  }

  // Supprimer une notification
  async deleteNotification(id: string): Promise<void> {
    await fetch(`${this.apiUrl}/notifications/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  }

  // Créer une notification (pour les admins)
  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    const response = await fetch(`${this.apiUrl}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(notification)
    });

    if (!response.ok) {
      throw new Error('Erreur création notification');
    }

    return response.json();
  }

  // Test de connectivité simple
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/ping`, {
        method: 'GET',
        credentials: 'include'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instance singleton
export const notificationService = new NotificationService();

// Générateur de notifications mock pour les tests
export const mockNotifications = {
  generateSystemNotification(): Notification {
    return {
      id: `sys_${Date.now()}`,
      type: 'info',
      title: 'Mise à jour système',
      message: 'Le système a été mis à jour avec succès',
      timestamp: new Date().toISOString(),
      priority: 'medium',
      category: 'system',
      read: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  generateSecurityAlert(): Notification {
    return {
      id: `sec_${Date.now()}`,
      type: 'warning',
      title: 'Alerte de sécurité',
      message: 'Tentative de connexion suspecte détectée',
      timestamp: new Date().toISOString(),
      priority: 'high',
      category: 'security',
      read: false,
      actionUrl: '/security-log',
      actionLabel: 'Voir les détails'
    };
  },

  generateLicenseExpiry(): Notification {
    return {
      id: `lic_${Date.now()}`,
      type: 'warning',
      title: 'Licence expirant bientôt',
      message: 'La licence JOC-0123 expire dans 7 jours',
      timestamp: new Date().toISOString(),
      priority: 'medium',
      category: 'license',
      read: false,
      actionUrl: '/licenses/JOC-0123',
      actionLabel: 'Renouveler'
    };
  },

  generateRaceUpdate(): Notification {
    return {
      id: `race_${Date.now()}`,
      type: 'success',
      title: 'Course programmée',
      message: 'Nouvelle course ajoutée: Grand Prix de Tunis',
      timestamp: new Date().toISOString(),
      priority: 'low',
      category: 'race',
      read: false,
      actionUrl: '/races/grand-prix-tunis',
      actionLabel: 'Voir la course'
    };
  },

  generateComplianceAlert(): Notification {
    return {
      id: `comp_${Date.now()}`,
      type: 'error',
      title: 'Non-conformité détectée',
      message: 'Audit de conformité: 2 points critiques à résoudre',
      timestamp: new Date().toISOString(),
      priority: 'urgent',
      category: 'compliance',
      read: false,
      actionUrl: '/compliance/audit-report',
      actionLabel: 'Action requise'
    };
  }
};

// Utilitaires de notification
export const notificationUtils = {
  // Formater le temps écoulé
  getTimeAgo(timestamp: string): string {
    const now = new Date().getTime();
    const notifTime = new Date(timestamp).getTime();
    const diffMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return new Date(timestamp).toLocaleDateString('fr-FR');
  },

  // Obtenir la couleur selon le type
  getTypeColor(type: Notification['type']): string {
    const colors = {
      success: 'text-green-600 bg-green-50 border-green-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      error: 'text-red-600 bg-red-50 border-red-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200',
      security: 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[type];
  },

  // Obtenir l'icône selon la catégorie
  getCategoryIcon(category: Notification['category']): string {
    const icons = {
      system: '⚙️',
      license: '📋',
      race: '🏆',
      compliance: '✅',
      user: '👤',
      security: '🔒'
    };
    return icons[category];
  },

  // Trier par priorité puis par date
  sortNotifications(notifications: Notification[]): Notification[] {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    return [...notifications].sort((a, b) => {
      // D'abord par priorité
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Puis par date (plus récent d'abord)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  },

  // Filtrer les notifications expirées
  filterActive(notifications: Notification[]): Notification[] {
    const now = new Date().getTime();
    return notifications.filter(notif => {
      if (!notif.expiresAt) return true;
      return new Date(notif.expiresAt).getTime() > now;
    });
  }
};
