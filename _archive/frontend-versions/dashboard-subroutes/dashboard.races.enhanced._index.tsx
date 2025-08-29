import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Plus, Search, Filter, MoreHorizontal, Calendar, MapPin, Users, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data amélioré pour les courses - en production, ceci viendrait de votre base de données
  const races = [
    {
      id: 1,
      name: "Prix du Président",
      date: "2025-08-25",
      time: "15:30",
      location: "Hippodrome de Kassar Said",
      category: "Groupe I",
      distance: "1600m",
      prize: "50,000 TND",
      participants: 12,
      maxParticipants: 16,
      status: "upcoming",
      surface: "Turf",
      conditions: "Bonnes",
      registrationEnd: "2025-08-23",
      weather: "Ensoleillé"
    },
    {
      id: 2,
      name: "Coupe de Tunisie",
      date: "2025-08-28",
      time: "16:00",
      location: "Hippodrome de Sousse",
      category: "Groupe II",
      distance: "2000m",
      prize: "35,000 TND",
      participants: 10,
      maxParticipants: 14,
      status: "registration",
      surface: "Turf",
      conditions: "Bonnes",
      registrationEnd: "2025-08-26",
      weather: "Nuageux"
    },
    {
      id: 3,
      name: "Derby de Tunis",
      date: "2025-08-22",
      time: "17:00",
      location: "Hippodrome de Kassar Said",
      category: "Groupe I",
      distance: "2400m",
      prize: "75,000 TND",
      participants: 8,
      maxParticipants: 12,
      status: "completed",
      surface: "Turf",
      conditions: "Fermes",
      winner: "Thunder Bolt",
      winTime: "2:28.45",
      weather: "Pluvieux"
    },
    {
      id: 4,
      name: "Prix Hassan Belkhodja",
      date: "2025-08-30",
      time: "14:45",
      location: "Hippodrome de Bizerte",
      category: "Groupe III",
      distance: "1400m",
      prize: "25,000 TND",
      participants: 15,
      maxParticipants: 18,
      status: "registration",
      surface: "Sable",
      conditions: "Bonnes",
      registrationEnd: "2025-08-28",
      weather: "Variable"
    },
    {
      id: 5,
      name: "Grand Prix d'été",
      date: "2025-08-20",
      time: "16:30",
      location: "Hippodrome de Sousse",
      category: "Groupe II",
      distance: "1800m",
      prize: "45,000 TND",
      participants: 11,
      maxParticipants: 14,
      status: "completed",
      surface: "Turf",
      conditions: "Souples",
      winner: "Desert Wind",
      winTime: "1:52.30",
      weather: "Ensoleillé"
    }
  ];

  const stats = {
    totalRaces: races.length,
    upcomingRaces: races.filter(r => r.status === 'upcoming').length,
    registrationOpen: races.filter(r => r.status === 'registration').length,
    completedRaces: races.filter(r => r.status === 'completed').length,
    totalPrize: races.reduce((sum, race) => sum + parseInt(race.prize.replace(/[^\d]/g, '')), 0),
    totalParticipants: races.reduce((sum, race) => sum + race.participants, 0),
    averageParticipants: Math.round(races.reduce((sum, race) => sum + race.participants, 0) / races.length),
    occupancyRate: Math.round((races.reduce((sum, race) => sum + race.participants, 0) / races.reduce((sum, race) => sum + race.maxParticipants, 0)) * 100)
  };

  return json({ races, stats });
};

export default function RacesPage() {
  const { races, stats } = useLoaderData<typeof loader>();

  const getStatusBadge = (status: string, winner?: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            À venir
          </span>
        );
      case 'registration':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Users className="w-3 h-3 mr-1" />
            Inscriptions
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Trophy className="w-3 h-3 mr-1" />
            Terminée
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Groupe II':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Groupe III':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏁 Gestion des Courses</h1>
          <p className="text-gray-600 mt-2">Planifiez, organisez et suivez toutes les courses hippiques</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Course
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Courses</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalRaces}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">À venir</p>
              <p className="text-xl font-bold text-gray-900">{stats.upcomingRaces}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Inscriptions</p>
              <p className="text-xl font-bold text-gray-900">{stats.registrationOpen}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-gray-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Terminées</p>
              <p className="text-xl font-bold text-gray-900">{stats.completedRaces}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Participants</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Prix Total</p>
              <p className="text-lg font-bold text-gray-900">{(stats.totalPrize / 1000).toFixed(0)}k TND</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Moy. Part.</p>
              <p className="text-xl font-bold text-gray-900">{stats.averageParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Taux Occ.</p>
              <p className="text-xl font-bold text-gray-900">{stats.occupancyRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une course..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Toutes les courses</option>
              <option>À venir</option>
              <option>Inscriptions ouvertes</option>
              <option>Terminées</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tous les groupes</option>
              <option>Groupe I</option>
              <option>Groupe II</option>
              <option>Groupe III</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tous les hippodromes</option>
              <option>Kassar Said</option>
              <option>Sousse</option>
              <option>Bizerte</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Races Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Liste des Courses</h3>
            <div className="text-sm text-gray-500">
              {races.length} courses trouvées
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu & Conditions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants & Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut & Résultat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {races.map((race) => (
                <tr key={race.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 mb-1">{race.name}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(race.category)}`}>
                          {race.category}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{race.distance}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{race.surface}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(race.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">{race.time}</div>
                        {race.registrationEnd && race.status === 'registration' && (
                          <div className="text-xs text-orange-600 mt-1">
                            Inscr. jusqu'au {new Date(race.registrationEnd).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-900">{race.location}</div>
                        <div className="text-xs text-gray-500">{race.conditions}</div>
                        <div className="text-xs text-gray-400">{race.weather}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-gray-900 font-medium">{race.participants}</span>
                        <span className="text-gray-500">/{race.maxParticipants}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                          (race.participants / race.maxParticipants) > 0.8 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {Math.round((race.participants / race.maxParticipants) * 100)}%
                        </span>
                      </div>
                      <div className="text-xs font-medium text-green-600">{race.prize}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getStatusBadge(race.status, race.winner)}
                      {race.winner && (
                        <div className="text-xs">
                          <div className="text-green-600 font-medium">🏆 {race.winner}</div>
                          {race.winTime && (
                            <div className="text-gray-500">⏱ {race.winTime}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/dashboard/races/${race.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Détails
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{races.length}</span> sur <span className="font-medium">{races.length}</span> courses
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Planifier une Course</h3>
              <p className="text-sm text-blue-700 mb-4">Créez et programmez une nouvelle course avec tous les détails nécessaires</p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Commencer
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Résultats</h3>
              <p className="text-sm text-green-700 mb-4">Saisir et publier les résultats des courses terminées</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Trophy className="w-4 h-4 mr-1" />
                Accéder
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Inscriptions</h3>
              <p className="text-sm text-purple-700 mb-4">Gérer les inscriptions et les participants aux courses</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Users className="w-4 h-4 mr-1" />
                Gérer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
