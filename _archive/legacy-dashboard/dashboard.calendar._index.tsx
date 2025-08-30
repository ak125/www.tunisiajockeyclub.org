import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Trophy, Users, Filter } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data pour le calendrier
  const events = [
    {
      id: 1,
      title: "Prix de Carthage",
      date: "2025-08-25",
      time: "14:30",
      venue: "Hippodrome de Carthage",
      type: "course",
      category: "Galop",
      distance: "1600m",
      participants: 12,
      prize: "25,000 TND",
      status: "confirmed",
      weather: "ensoleillé"
    },
    {
      id: 2,
      title: "Grand Prix de Tunis",
      date: "2025-08-28",
      time: "15:00",
      venue: "Hippodrome de Tunis",
      type: "course",
      category: "Galop",
      distance: "2000m",
      participants: 16,
      prize: "50,000 TND",
      status: "confirmed",
      weather: "nuageux"
    },
    {
      id: 3,
      title: "Entraînement matinal",
      date: "2025-08-26",
      time: "07:00",
      venue: "Piste d'entraînement",
      type: "training",
      category: "Entraînement",
      participants: 8,
      status: "scheduled",
      distance: undefined,
      prize: undefined,
      weather: undefined
    },
    {
      id: 4,
      title: "Visite vétérinaire",
      date: "2025-08-27",
      time: "10:00",
      venue: "Écuries du club",
      type: "medical",
      category: "Santé",
      participants: 5,
      status: "scheduled",
      distance: undefined,
      prize: undefined,
      weather: undefined
    },
    {
      id: 5,
      title: "Course d'obstacles",
      date: "2025-08-30",
      time: "16:00",
      venue: "Hippodrome de Sousse",
      type: "course",
      category: "Obstacles",
      distance: "3200m",
      participants: 10,
      prize: "18,000 TND",
      status: "pending",
      weather: "variable"
    },
    {
      id: 6,
      title: "Compétition junior",
      date: "2025-09-02",
      time: "13:00",
      venue: "Hippodrome de Bizerte",
      type: "course",
      category: "Junior",
      distance: "1200m",
      participants: 14,
      prize: "15,000 TND",
      status: "confirmed",
      weather: "ensoleillé"
    }
  ];

  // Statistiques du mois
  const stats = {
    totalEvents: events.length,
    courses: events.filter(e => e.type === 'course').length,
    entrainements: events.filter(e => e.type === 'training').length,
    medical: events.filter(e => e.type === 'medical').length,
    totalPrize: events
      .filter(e => e.prize)
      .reduce((sum, e) => sum + parseInt(e.prize!.replace(/[^\d]/g, '')), 0),
    totalParticipants: events.reduce((sum, e) => sum + e.participants, 0)
  };

  return json({ events, stats });
};

export default function CalendarPage() {
  const { events, stats } = useLoaderData<typeof loader>();

  // Date actuelle et navigation
  const today = new Date();
  const currentMonth = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'training':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'medical':
        return <Plus className="w-4 h-4 text-green-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmé
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Programmé
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'training':
        return 'border-l-blue-500 bg-blue-50';
      case 'medical':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Grouper les événements par date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📅 Calendrier des Événements</h1>
          <p className="text-gray-600 mt-2">Planifiez et suivez toutes les activités du club</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Événement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Événements</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Courses</p>
              <p className="text-xl font-bold text-gray-900">{stats.courses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Entraînements</p>
              <p className="text-xl font-bold text-gray-900">{stats.entrainements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Médical</p>
              <p className="text-xl font-bold text-gray-900">{stats.medical}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Participants</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-6 w-6 text-green-600 flex items-center justify-center text-sm font-bold">TND</div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Prix Total</p>
              <p className="text-lg font-bold text-gray-900">{(stats.totalPrize / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {currentMonth}
            </h2>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              <option>Tous les événements</option>
              <option>Courses</option>
              <option>Entraînements</option>
              <option>Médical</option>
            </select>
            <Button variant="outline" size="sm">
              Vue mois
            </Button>
            <Button variant="outline" size="sm">
              Vue semaine
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 text-center min-w-[120px]">
                <div className="text-lg font-bold">
                  {new Date(date).getDate()}
                </div>
                <div className="text-sm">
                  {new Date(date).toLocaleDateString('fr-FR', { 
                    weekday: 'short', 
                    month: 'short' 
                  })}
                </div>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">
                {eventsByDate[date].length} événement{eventsByDate[date].length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Events for this date */}
            <div className="ml-4 space-y-3">
              {eventsByDate[date].map((event) => (
                <div
                  key={event.id}
                  className={`border-l-4 ${getTypeColor(event.type)} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getEventTypeIcon(event.type)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        {getStatusBadge(event.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} participants</span>
                        </div>

                        {event.prize && (
                          <div className="flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-yellow-600" />
                            <span className="text-green-600 font-medium">{event.prize}</span>
                          </div>
                        )}
                      </div>

                      {event.distance && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {event.category} • {event.distance}
                          </span>
                          {event.weather && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              ☀️ {event.weather}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Nouvelle Course</h3>
              <p className="text-sm text-yellow-700 mb-4">Programmer une course officielle</p>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Créer
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Entraînement</h3>
              <p className="text-sm text-blue-700 mb-4">Planifier une session d'entraînement</p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Planifier
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Visite Médicale</h3>
              <p className="text-sm text-green-700 mb-4">Programmer un suivi vétérinaire</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Programmer
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Autre Événement</h3>
              <p className="text-sm text-purple-700 mb-4">Créer un événement personnalisé</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Créer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
