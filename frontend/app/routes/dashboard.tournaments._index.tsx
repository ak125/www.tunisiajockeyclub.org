import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { 
  Trophy, Users, Calendar, Award, Clock, Target,
  TrendingUp, Medal, Star, ArrowRight, Plus, Filter, Search
} from 'lucide-react';
import { useState } from 'react';
import { requirePermission, Permission } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Vérifier les permissions d'accès aux tournois
  await requirePermission(request, Permission.TOURNAMENTS);

  try {
    // Récupérer les tournois depuis le backend
    const tournamentsResponse = await fetch('http://localhost:3000/api/tournaments/list');
    const statsResponse = await fetch('http://localhost:3000/api/tournaments/statistics');

    const tournaments = tournamentsResponse.ok ? await tournamentsResponse.json() : { tournaments: [] };
    const stats = statsResponse.ok ? await statsResponse.json() : {};

    return json({
      tournaments: tournaments.tournaments || [],
      tournamentStats: stats,
    });
  } catch (error) {
    console.error('Erreur chargement tournois:', error);
    return json({
      tournaments: [],
      tournamentStats: {},
    });
  }
}

export default function DashboardTournaments() {
  const { tournaments } = useLoaderData<typeof loader>();
  const { permissions } = useOutletContext<{
    permissions: any;
  }>();

  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées pour le développement
  const sampleTournaments = [
    {
      id: 1,
      name: 'Grand Prix de Tunisie',
      description: 'Le plus prestigieux tournoi hippique de Tunisie',
      startDate: '2025-09-15',
      endDate: '2025-09-17',
      status: 'upcoming',
      prizePool: 250000,
      maxParticipants: 32,
      currentParticipants: 18,
      location: 'Hippodrome de Carthage',
      category: 'prestige'
    },
    {
      id: 2,
      name: 'Coupe des Champions',
      description: 'Tournoi réservé aux meilleurs jockeys',
      startDate: '2025-08-25',
      endDate: '2025-08-30',
      status: 'active',
      prizePool: 180000,
      maxParticipants: 24,
      currentParticipants: 24,
      location: 'Hippodrome de Sousse',
      category: 'elite'
    },
    {
      id: 3,
      name: 'Tournoi des Espoirs',
      description: 'Compétition pour les jeunes talents',
      startDate: '2025-07-10',
      endDate: '2025-07-12',
      status: 'completed',
      prizePool: 75000,
      maxParticipants: 16,
      currentParticipants: 16,
      location: 'Hippodrome de Tunis',
      category: 'junior'
    },
    {
      id: 4,
      name: 'Derby du Maghreb',
      description: 'Tournoi international maghrébin',
      startDate: '2025-10-20',
      endDate: '2025-10-22',
      status: 'upcoming',
      prizePool: 320000,
      maxParticipants: 40,
      currentParticipants: 5,
      location: 'Hippodrome International',
      category: 'international'
    }
  ];

  const allTournaments = [...sampleTournaments, ...tournaments];
  const filteredTournaments = allTournaments.filter(tournament => {
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prestige': return 'text-purple-600';
      case 'elite': return 'text-yellow-600';
      case 'international': return 'text-blue-600';
      case 'junior': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prestige': return Trophy;
      case 'elite': return Medal;
      case 'international': return Star;
      case 'junior': return Target;
      default: return Award;
    }
  };

  const upcomingCount = filteredTournaments.filter(t => t.status === 'upcoming').length;
  const activeCount = filteredTournaments.filter(t => t.status === 'active').length;
  const completedCount = filteredTournaments.filter(t => t.status === 'completed').length;
  const totalPrizePool = filteredTournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-6 w-6 text-yellow-600 mr-2" />
            Tournois et Compétitions
          </h1>
          <p className="text-gray-600">
            Gestion des tournois hippiques et compétitions
          </p>
        </div>
        
        {permissions?.canManageEvents && (
          <div className="flex space-x-3">
            <Link
              to="/dashboard/tournaments/new"
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau tournoi</span>
            </Link>
          </div>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À venir</p>
              <p className="text-xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-xl font-bold text-green-600">{activeCount}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminés</p>
              <p className="text-xl font-bold text-gray-600">{completedCount}</p>
            </div>
            <Award className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dotations totales</p>
              <p className="text-xl font-bold text-purple-600">{(totalPrizePool / 1000).toFixed(0)}K DT</p>
            </div>
            <Medal className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un tournoi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="active">En cours</option>
              <option value="completed">Terminés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tournois */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.map((tournament) => {
          const CategoryIcon = getCategoryIcon(tournament.category);
          const participationRate = (tournament.currentParticipants / tournament.maxParticipants) * 100;
          
          return (
            <div key={tournament.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CategoryIcon className={`h-6 w-6 ${getCategoryColor(tournament.category)}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                      <p className="text-sm text-gray-600">{tournament.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {tournament.status === 'upcoming' ? 'À venir' :
                     tournament.status === 'active' ? 'En cours' :
                     tournament.status === 'completed' ? 'Terminé' :
                     tournament.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(tournament.startDate).toLocaleDateString('fr-FR')} - {new Date(tournament.endDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Medal className="h-4 w-4 mr-1" />
                      {(tournament.prizePool / 1000).toFixed(0)}K DT
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium text-gray-900">
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${participationRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    📍 {tournament.location}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/tournaments/${tournament.id}`}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Voir détails
                    </Link>
                    {tournament.status === 'upcoming' && permissions?.canManageEvents && (
                      <Link
                        to={`/dashboard/tournaments/${tournament.id}/edit`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        Modifier
                      </Link>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {tournament.status === 'active' && (
                      <span className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        En direct
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun tournoi trouvé</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Aucun tournoi ne correspond à vos critères de recherche'
              : 'Aucun tournoi planifié pour le moment'}
          </p>
          {permissions?.canManageEvents && (
            <Link
              to="/dashboard/tournaments/new"
              className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Créer le premier tournoi</span>
            </Link>
          )}
        </div>
      )}

      {/* Actions rapides */}
      {permissions?.canManageEvents && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/tournaments/templates"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors text-center"
            >
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="font-medium text-gray-900">Modèles</p>
              <p className="text-sm text-gray-500">Créer depuis un modèle</p>
            </Link>
            
            <Link
              to="/dashboard/tournaments/calendar"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
            >
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-gray-900">Calendrier</p>
              <p className="text-sm text-gray-500">Vue chronologique</p>
            </Link>
            
            <Link
              to="/dashboard/tournaments/reports"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
            >
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-gray-900">Rapports</p>
              <p className="text-sm text-gray-500">Analyses détaillées</p>
            </Link>
            
            <Link
              to="/dashboard/tournaments/participants"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium text-gray-900">Participants</p>
              <p className="text-sm text-gray-500">Gestion globale</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
