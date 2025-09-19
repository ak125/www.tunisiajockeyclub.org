import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { 
  Bell, 
  Settings, 
  Check, 
  X, 
  Clock, 
  Trophy,
  AlertCircle,
  Info,
  Calendar,
  User,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: 'race' | 'result' | 'system' | 'user' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
}

export async function loader() {
  // Simuler des notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'result',
      title: 'Résultats Prix de Choucha',
      message: 'Les résultats du Prix de Choucha sont maintenant disponibles. Rahib Albadeia remporte la victoire !',
      timestamp: '2025-08-31T10:30:00Z',
      read: false,
      priority: 'high',
      actionUrl: '/courses/2',
      actionText: 'Voir les résultats'
    },
    {
      id: '2',
      type: 'race',
      title: 'Nouvelle course programmée',
      message: 'Une nouvelle course "Prix du Président" a été ajoutée au programme pour le 5 septembre 2025.',
      timestamp: '2025-08-31T09:15:00Z',
      read: false,
      priority: 'medium',
      actionUrl: '/courses',
      actionText: 'Voir les courses'
    },
    {
      id: '3',
      type: 'system',
      title: 'Maintenance programmée',
      message: 'Une maintenance du système est prévue dimanche 1 septembre de 02h00 à 06h00.',
      timestamp: '2025-08-30T16:45:00Z',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'user',
      title: 'Profil mis à jour',
      message: 'Votre profil utilisateur a été mis à jour avec succès.',
      timestamp: '2025-08-30T14:20:00Z',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'alert',
      title: 'Charge serveur élevée',
      message: 'La charge du serveur a dépassé 85%. Surveillance en cours.',
      timestamp: '2025-08-31T11:00:00Z',
      read: false,
      priority: 'high',
      actionUrl: '/monitoring',
      actionText: 'Voir le monitoring'
    },
    {
      id: '6',
      type: 'race',
      title: 'Changement d\'horaire',
      message: 'La course "Prix Ben Guerdane" a été reportée à 16h30 au lieu de 15h00.',
      timestamp: '2025-08-29T12:30:00Z',
      read: true,
      priority: 'medium'
    }
  ];

  const stats = {
    total: mockNotifications.length,
    unread: mockNotifications.filter(n => !n.read).length,
    high: mockNotifications.filter(n => n.priority === 'high').length,
    today: mockNotifications.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.timestamp);
      return notifDate.toDateString() === today.toDateString();
    }).length
  };

  return json({
    notifications: mockNotifications,
    stats
  });
}

export default function NotificationsPage() {
  const { notifications, stats } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || notif.type === filter;
    const matchesReadStatus = showRead || !notif.read;
    return matchesFilter && matchesReadStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'race': return Calendar;
      case 'result': return Trophy;
      case 'system': return Settings;
      case 'user': return User;
      case 'alert': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'race': return 'bg-blue-100 text-blue-800';
      case 'result': return 'bg-yellow-100 text-yellow-800';
      case 'system': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'race': return 'Course';
      case 'result': return 'Résultat';
      case 'system': return 'Système';
      case 'user': return 'Utilisateur';
      case 'alert': return 'Alerte';
      default: return 'Info';
    }
  };

  const markAsRead = (id: string) => {
    // Dans une vraie app, on ferait un call API ici
    console.log('Marquer comme lue:', id);
  };

  const markAsUnread = (id: string) => {
    // Dans une vraie app, on ferait un call API ici
    console.log('Marquer comme non lue:', id);
  };

  const deleteNotification = (id: string) => {
    // Dans une vraie app, on ferait un call API ici
    console.log('Supprimer notification:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="h-8 w-8 mr-3 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">
              Restez informé des dernières actualités du Tunisia Jockey Club
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
            <div className="text-sm text-gray-600">Non lues</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <div className="text-sm text-gray-600">Priorité haute</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.today}</div>
            <div className="text-sm text-gray-600">Aujourd'hui</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtrer par:</span>
            </div>
            
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Toutes' },
                { value: 'race', label: 'Courses' },
                { value: 'result', label: 'Résultats' },
                { value: 'system', label: 'Système' },
                { value: 'user', label: 'Utilisateur' },
                { value: 'alert', label: 'Alertes' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === value
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center ml-auto">
              <input
                type="checkbox"
                id="showRead"
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showRead" className="text-sm text-gray-600">
                Afficher les lues
              </label>
            </div>
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const IconComponent = getTypeIcon(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'border-r-4 border-r-blue-200' : ''
                } hover:shadow-lg transition-shadow`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {getTypeLabel(notification.type)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(notification.timestamp).toLocaleString('fr-FR')}
                          </div>
                          
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {notification.actionText}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {notification.read ? (
                        <button
                          onClick={() => markAsUnread(notification.id)}
                          className="text-gray-400 hover:text-blue-600 p-1"
                          title="Marquer comme non lue"
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-gray-400 hover:text-green-600 p-1"
                          title="Marquer comme lue"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Supprimer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <button className="text-gray-400 hover:text-gray-600 p-1" title="Plus d'options">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow border">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "Vous n'avez aucune notification pour le moment." 
                : `Aucune notification de type "${getTypeLabel(filter)}" trouvée.`
              }
            </p>
          </div>
        )}

        {/* Actions en lot */}
        {stats.unread > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {stats.unread} notification{stats.unread > 1 ? 's' : ''} non lue{stats.unread > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                  Tout marquer comme lu
                </button>
                <button className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                  Supprimer toutes les lues
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
