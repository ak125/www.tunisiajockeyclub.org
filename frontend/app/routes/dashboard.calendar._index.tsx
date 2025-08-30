import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { 
  Calendar, Clock, MapPin, Users, Trophy, AlertCircle,
  Plus, Eye, Settings, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Récupérer les événements depuis le backend
    const eventsResponse = await fetch('http://localhost:3000/api/events/list');
    const racesResponse = await fetch('http://localhost:3000/api/races/list');

    const events = eventsResponse.ok ? await eventsResponse.json() : { events: [] };
    const races = racesResponse.ok ? await racesResponse.json() : { races: [] };

    return json({
      events: events.events || [],
      races: races.races || [],
      upcomingCount: 0, // À calculer
    });
  } catch (error) {
    console.error('Erreur chargement calendrier:', error);
    return json({
      events: [],
      races: [],
      upcomingCount: 0,
    });
  }
}

export default function DashboardCalendar() {
  const { events, races } = useLoaderData<typeof loader>();
  const { permissions } = useOutletContext<{
    permissions: any;
  }>();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'list'>('month');
  const [filterType, setFilterType] = useState<'all' | 'races' | 'events'>('all');

  // Données simulées pour le développement
  const sampleEvents = [
    {
      id: 1,
      title: 'Course Hippique de Kasserine',
      type: 'race',
      date: '2025-08-30',
      time: '15:00',
      location: 'Hippodrome de Kasserine',
      status: 'confirmed',
      participants: 12,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Assemblée Générale TJC',
      type: 'meeting',
      date: '2025-09-05',
      time: '14:00',
      location: 'Siège TJC, Tunis',
      status: 'confirmed',
      participants: 25,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Formation Jockeys Apprentis',
      type: 'training',
      date: '2025-09-10',
      time: '09:00',
      location: 'Centre d\'Entraînement',
      status: 'planning',
      participants: 8,
      priority: 'low'
    },
    {
      id: 4,
      title: 'Prix du Président - Grand Prix',
      type: 'race',
      date: '2025-09-15',
      time: '16:00',
      location: 'Hippodrome Sousse',
      status: 'confirmed',
      participants: 18,
      priority: 'high'
    },
    {
      id: 5,
      title: 'Inspection Vétérinaire',
      type: 'inspection',
      date: '2025-09-12',
      time: '10:00',
      location: 'Multiple locations',
      status: 'confirmed',
      participants: 6,
      priority: 'medium'
    }
  ];

  const allEvents = [...sampleEvents, ...events, ...races];
  const filteredEvents = allEvents.filter(event => {
    if (filterType === 'all') return true;
    if (filterType === 'races') return event.type === 'race';
    return event.type !== 'race';
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'race': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'planning': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
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

  const formatEventTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todaysEvents = filteredEvents.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.date === today;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            Calendrier des Événements
          </h1>
          <p className="text-gray-600">
            Gestion des courses, réunions et événements TJC
          </p>
        </div>
        
        {permissions?.canManageEvents && (
          <div className="flex space-x-3">
            <Link
              to="/dashboard/calendar/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvel événement</span>
            </Link>
          </div>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aujourd'hui</p>
              <p className="text-xl font-bold text-blue-600">{todaysEvents.length}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À venir (7j)</p>
              <p className="text-xl font-bold text-green-600">
                {upcomingEvents.filter(e => {
                  const eventDate = new Date(e.date);
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return eventDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Courses ce mois</p>
              <p className="text-xl font-bold text-purple-600">
                {filteredEvents.filter(e => 
                  e.type === 'race' && 
                  new Date(e.date).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants total</p>
              <p className="text-xl font-bold text-orange-600">
                {filteredEvents.reduce((sum, e) => sum + (e.participants || 0), 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Contrôles de vue */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">Tous les événements</option>
                <option value="races">Courses uniquement</option>
                <option value="events">Autres événements</option>
              </select>
            </div>
            
            <div className="flex rounded-lg border">
              {(['list', 'month', 'week'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`px-3 py-1 text-sm ${
                    viewType === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type === 'list' ? 'Liste' : type === 'month' ? 'Mois' : 'Semaine'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium min-w-32 text-center">
              {currentDate.toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events à venir (urgents) */}
      {todaysEvents.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-800">Événements aujourd'hui</h3>
          </div>
          <div className="space-y-2">
            {todaysEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between bg-white rounded p-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type === 'race' ? 'Course' : 
                     event.type === 'meeting' ? 'Réunion' :
                     event.type === 'training' ? 'Formation' :
                     event.type === 'inspection' ? 'Inspection' : event.type}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.time} - {event.location}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/dashboard/calendar/event/${event.id}`}
                  className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des événements */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Événements à venir ({upcomingEvents.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {upcomingEvents.slice(0, 10).map((event) => (
            <div key={event.id} className={`p-4 border-l-4 ${getPriorityColor(event.priority)} hover:bg-gray-50`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type === 'race' ? 'Course' : 
                       event.type === 'meeting' ? 'Réunion' :
                       event.type === 'training' ? 'Formation' :
                       event.type === 'inspection' ? 'Inspection' : event.type}
                    </span>
                    <span className={`text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status === 'confirmed' ? 'Confirmé' :
                       event.status === 'planning' ? 'Planifié' :
                       event.status === 'cancelled' ? 'Annulé' : event.status}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatEventTime(event.date, event.time)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.participants} participants
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/dashboard/calendar/event/${event.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    title="Voir détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  {permissions?.canManageEvents && (
                    <Link
                      to={`/dashboard/calendar/event/${event.id}/edit`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Modifier"
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {upcomingEvents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun événement planifié</p>
            {permissions?.canManageEvents && (
              <Link
                to="/dashboard/calendar/new"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Créer le premier événement
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
