import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Plus, Search, Filter, MoreHorizontal, Users, Trophy, TrendingUp, Star, Medal, Target } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data pour les jockeys
  const jockeys = [
    {
      id: 1,
      firstName: "Ahmed",
      lastName: "Ben Ali",
      age: 28,
      nationality: "Tunisienne",
      weight: "52kg",
      height: "1.65m",
      experience: 8,
      totalRaces: 245,
      victories: 67,
      podiums: 134,
      winRate: 27.3,
      earnings: "485,000 TND",
      status: "active",
      lastRace: "2025-08-20",
      specialties: ["Galop", "Obstacles"],
      photo: "/api/placeholder/64/64",
      club: "Tunisia Jockey Club",
      license: "TJC-2025-001"
    },
    {
      id: 2,
      firstName: "Mohamed",
      lastName: "Khalil",
      age: 31,
      nationality: "Tunisienne", 
      weight: "54kg",
      height: "1.68m",
      experience: 12,
      totalRaces: 398,
      victories: 89,
      podiums: 198,
      winRate: 22.4,
      earnings: "672,000 TND",
      status: "active",
      lastRace: "2025-08-22",
      specialties: ["Galop", "Plat"],
      photo: "/api/placeholder/64/64",
      club: "Racing Club Tunis",
      license: "RCT-2025-008"
    },
    {
      id: 3,
      firstName: "Youssef",
      lastName: "Mansour", 
      age: 26,
      nationality: "Tunisienne",
      weight: "51kg",
      height: "1.63m",
      experience: 5,
      totalRaces: 156,
      victories: 34,
      podiums: 78,
      winRate: 21.8,
      earnings: "298,000 TND",
      status: "active",
      lastRace: "2025-08-21",
      specialties: ["Trot", "Galop"],
      photo: "/api/placeholder/64/64",
      club: "Hippique de Sousse",
      license: "HDS-2025-023"
    },
    {
      id: 4,
      firstName: "Karim",
      lastName: "Saidi",
      age: 35,
      nationality: "Tunisienne",
      weight: "55kg", 
      height: "1.70m",
      experience: 15,
      totalRaces: 512,
      victories: 95,
      podiums: 248,
      winRate: 18.6,
      earnings: "756,000 TND",
      status: "veteran",
      lastRace: "2025-08-18",
      specialties: ["Obstacles", "Cross"],
      photo: "/api/placeholder/64/64",
      club: "Club Hippique Bizerte",
      license: "CHB-2025-012"
    },
    {
      id: 5,
      firstName: "Slim",
      lastName: "Karray",
      age: 23,
      nationality: "Tunisienne",
      weight: "50kg",
      height: "1.62m", 
      experience: 2,
      totalRaces: 45,
      victories: 8,
      podiums: 19,
      winRate: 17.8,
      earnings: "89,000 TND",
      status: "rookie",
      lastRace: "2025-08-19",
      specialties: ["Galop"],
      photo: "/api/placeholder/64/64",
      club: "Tunisia Jockey Club",
      license: "TJC-2025-045"
    }
  ];

  const stats = {
    totalJockeys: jockeys.length,
    activeJockeys: jockeys.filter(j => j.status === 'active').length,
    veteranJockeys: jockeys.filter(j => j.status === 'veteran').length,
    rookieJockeys: jockeys.filter(j => j.status === 'rookie').length,
    totalRaces: jockeys.reduce((sum, j) => sum + j.totalRaces, 0),
    totalVictories: jockeys.reduce((sum, j) => sum + j.victories, 0),
    averageWinRate: (jockeys.reduce((sum, j) => sum + j.winRate, 0) / jockeys.length).toFixed(1),
    totalEarnings: jockeys.reduce((sum, j) => sum + parseInt(j.earnings.replace(/[^\d]/g, '')), 0)
  };

  return json({ jockeys, stats });
};

export default function JockeysPage() {
  const { jockeys, stats } = useLoaderData<typeof loader>();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Actif
          </span>
        );
      case 'veteran':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Star className="w-3 h-3 mr-1" />
            Vétéran
          </span>
        );
      case 'rookie':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Target className="w-3 h-3 mr-1" />
            Débutant
          </span>
        );
      default:
        return null;
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 25) return 'text-green-600 font-semibold';
    if (winRate >= 20) return 'text-blue-600 font-medium';
    if (winRate >= 15) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🏇 Gestion des Jockeys</h1>
          <p className="text-gray-600 mt-2">Gérez les profils et performances de tous les jockeys</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistiques
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Jockey
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Jockeys</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalJockeys}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Actifs</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeJockeys}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Vétérans</p>
              <p className="text-xl font-bold text-gray-900">{stats.veteranJockeys}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Débutants</p>
              <p className="text-xl font-bold text-gray-900">{stats.rookieJockeys}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Victoires</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalVictories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Medal className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Courses</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalRaces}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Taux Moy.</p>
              <p className="text-xl font-bold text-gray-900">{stats.averageWinRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-6 w-6 text-purple-600 flex items-center justify-center text-sm font-bold">TND</div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Gains Total</p>
              <p className="text-lg font-bold text-gray-900">{(stats.totalEarnings / 1000000).toFixed(1)}M</p>
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
                placeholder="Rechercher un jockey..."
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
              <option>Tous les statuts</option>
              <option>Actifs</option>
              <option>Vétérans</option>
              <option>Débutants</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Toutes les spécialités</option>
              <option>Galop</option>
              <option>Trot</option>
              <option>Obstacles</option>
              <option>Cross</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jockeys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jockeys.map((jockey) => (
          <div key={jockey.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header with photo and basic info */}
            <div className="p-6 pb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {jockey.firstName} {jockey.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{jockey.club}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(jockey.status)}
                    <span className="text-xs text-gray-400">#{jockey.license}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{jockey.victories}</p>
                  <p className="text-xs text-gray-500">Victoires</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{jockey.totalRaces}</p>
                  <p className="text-xs text-gray-500">Courses</p>
                </div>
                <div>
                  <p className={`text-lg font-bold ${getWinRateColor(jockey.winRate)}`}>
                    {jockey.winRate}%
                  </p>
                  <p className="text-xs text-gray-500">Taux</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 pb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Âge:</span>
                <span className="text-gray-900">{jockey.age} ans ({jockey.experience} ans exp.)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Poids/Taille:</span>
                <span className="text-gray-900">{jockey.weight} • {jockey.height}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Spécialités:</span>
                <span className="text-gray-900">{jockey.specialties.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gains:</span>
                <span className="text-green-600 font-medium">{jockey.earnings}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Dernière course: {new Date(jockey.lastRace).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/jockeys/${jockey.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Voir profil
                  </Link>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Nouveau Jockey</h3>
              <p className="text-sm text-blue-700 mb-4">Ajouter un nouveau jockey au registre</p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Performances</h3>
              <p className="text-sm text-green-700 mb-4">Analyser les statistiques détaillées</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <TrendingUp className="w-4 h-4 mr-1" />
                Analyser
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Classements</h3>
              <p className="text-sm text-purple-700 mb-4">Voir les classements et palmares</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Trophy className="w-4 h-4 mr-1" />
                Voir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
