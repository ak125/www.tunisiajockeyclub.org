import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Plus, Search, Filter, MoreHorizontal, Activity, Trophy, TrendingUp, Star, Medal, Heart, Calendar } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data pour les chevaux
  const horses = [
    {
      id: 1,
      name: "Thunder Bay",
      breed: "Pur-sang Arabe",
      age: 5,
      gender: "Étalon",
      color: "Bai brun",
      height: "1.65m",
      weight: "480kg",
      owner: "Haras El Ons",
      trainer: "Mohamed Gharbi",
      jockey: "Ahmed Ben Ali",
      totalRaces: 24,
      victories: 8,
      podiums: 16,
      winRate: 33.3,
      earnings: "125,000 TND",
      status: "active",
      lastRace: "2025-08-20",
      nextRace: "2025-08-25",
      form: ["1", "2", "1", "3", "1"],
      specialties: ["Galop", "1200-1600m"],
      photo: "/api/placeholder/64/64",
      condition: "excellent",
      rating: 92
    },
    {
      id: 2,
      name: "Desert Storm",
      breed: "Pur-sang Anglais",
      age: 4,
      gender: "Jument",
      color: "Alezan",
      height: "1.62m",
      weight: "465kg",
      owner: "Écurie Al Baraka",
      trainer: "Slim Karray",
      jockey: "Mohamed Khalil",
      totalRaces: 18,
      victories: 5,
      podiums: 11,
      winRate: 27.8,
      earnings: "89,000 TND",
      status: "active",
      lastRace: "2025-08-18",
      nextRace: "2025-08-28",
      form: ["2", "1", "4", "2", "1"],
      specialties: ["Galop", "1400-1800m"],
      photo: "/api/placeholder/64/64",
      condition: "good",
      rating: 87
    },
    {
      id: 3,
      name: "Sahara Prince",
      breed: "Pur-sang Arabe",
      age: 6,
      gender: "Étalon", 
      color: "Gris",
      height: "1.64m",
      weight: "475kg",
      owner: "Haras de Carthage",
      trainer: "Farid Mansour",
      jockey: "Youssef Mansour",
      totalRaces: 31,
      victories: 12,
      podiums: 22,
      winRate: 38.7,
      earnings: "198,000 TND",
      status: "active",
      lastRace: "2025-08-22",
      nextRace: "2025-08-30",
      form: ["1", "1", "2", "1", "3"],
      specialties: ["Galop", "1600-2000m"],
      photo: "/api/placeholder/64/64",
      condition: "excellent",
      rating: 95
    },
    {
      id: 4,
      name: "Atlas Runner",
      breed: "Anglo-Arabe",
      age: 7,
      gender: "Hongre",
      color: "Bai",
      height: "1.63m",
      weight: "470kg",
      owner: "Club Hippique Sousse",
      trainer: "Nizar Haddad",
      jockey: "Karim Saidi",
      totalRaces: 45,
      victories: 9,
      podiums: 28,
      winRate: 20.0,
      earnings: "156,000 TND",
      status: "veteran",
      lastRace: "2025-08-15",
      nextRace: "2025-09-05",
      form: ["3", "2", "5", "2", "1"],
      specialties: ["Obstacles", "Cross-country"],
      photo: "/api/placeholder/64/64",
      condition: "good",
      rating: 82
    },
    {
      id: 5,
      name: "Medina Star",
      breed: "Pur-sang Arabe",
      age: 3,
      gender: "Pouliche",
      color: "Noir",
      height: "1.61m",
      weight: "445kg",
      owner: "Écurie Zitouna",
      trainer: "Lotfi Ben Salem",
      jockey: "Slim Karray",
      totalRaces: 8,
      victories: 2,
      podiums: 5,
      winRate: 25.0,
      earnings: "34,000 TND",
      status: "rising",
      lastRace: "2025-08-19",
      nextRace: "2025-08-26",
      form: ["1", "3", "2", "4", "1"],
      specialties: ["Galop", "1000-1400m"],
      photo: "/api/placeholder/64/64",
      condition: "excellent",
      rating: 78
    }
  ];

  const stats = {
    totalHorses: horses.length,
    activeHorses: horses.filter(h => h.status === 'active').length,
    veteranHorses: horses.filter(h => h.status === 'veteran').length,
    risingHorses: horses.filter(h => h.status === 'rising').length,
    totalRaces: horses.reduce((sum, h) => sum + h.totalRaces, 0),
    totalVictories: horses.reduce((sum, h) => sum + h.victories, 0),
    averageWinRate: (horses.reduce((sum, h) => sum + h.winRate, 0) / horses.length).toFixed(1),
    totalEarnings: horses.reduce((sum, h) => sum + parseInt(h.earnings.replace(/[^\d]/g, '')), 0)
  };

  return json({ horses, stats });
};

export default function HorsesPage() {
  const { horses, stats } = useLoaderData<typeof loader>();

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
      case 'rising':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            Prometteur
          </span>
        );
      default:
        return null;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 font-semibold';
      case 'good': return 'text-blue-600 font-medium';
      case 'average': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getFormDisplay = (form: string[]) => {
    return form.map((position, index) => (
      <span
        key={index}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
          position === '1' ? 'bg-yellow-100 text-yellow-800' :
          position === '2' ? 'bg-gray-100 text-gray-800' :
          position === '3' ? 'bg-amber-100 text-amber-800' :
          'bg-red-100 text-red-800'
        }`}
      >
        {position}
      </span>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🐎 Gestion des Chevaux</h1>
          <p className="text-gray-600 mt-2">Gérez les profils et performances de tous les chevaux</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performances
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Cheval
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Chevaux</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalHorses}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats.activeHorses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Star className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Vétérans</p>
              <p className="text-xl font-bold text-gray-900">{stats.veteranHorses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Prometteurs</p>
              <p className="text-xl font-bold text-gray-900">{stats.risingHorses}</p>
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
              <p className="text-lg font-bold text-gray-900">{(stats.totalEarnings / 1000).toFixed(0)}K</p>
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
                placeholder="Rechercher un cheval..."
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
              <option>Prometteurs</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Toutes les races</option>
              <option>Pur-sang Arabe</option>
              <option>Pur-sang Anglais</option>
              <option>Anglo-Arabe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Horses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horses.map((horse) => (
          <div key={horse.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header with photo and basic info */}
            <div className="p-6 pb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {horse.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">{horse.breed} • {horse.age} ans</p>
                  <p className="text-xs text-gray-400 mb-2">{horse.gender} • {horse.color}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(horse.status)}
                    <span className={`text-sm font-medium ${getConditionColor(horse.condition)}`}>
                      ⚡ {horse.condition}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{horse.victories}</p>
                  <p className="text-xs text-gray-500">Victoires</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{horse.totalRaces}</p>
                  <p className="text-xs text-gray-500">Courses</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{horse.winRate}%</p>
                  <p className="text-xs text-gray-500">Taux</p>
                </div>
              </div>
            </div>

            {/* Form and Rating */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Forme récente</p>
                  <div className="flex space-x-1">
                    {getFormDisplay(horse.form)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-lg font-bold text-purple-600">{horse.rating}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 pb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Propriétaire:</span>
                <span className="text-gray-900 text-right text-xs">{horse.owner}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Entraîneur:</span>
                <span className="text-gray-900 text-right text-xs">{horse.trainer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Jockey:</span>
                <span className="text-gray-900 text-right text-xs">{horse.jockey}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Spécialités:</span>
                <span className="text-gray-900 text-right text-xs">{horse.specialties.join(' • ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gains:</span>
                <span className="text-green-600 font-medium">{horse.earnings}</span>
              </div>
            </div>

            {/* Next Race */}
            {horse.nextRace && (
              <div className="px-6 pb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-blue-700 font-medium">Prochaine course</p>
                      <p className="text-sm text-blue-900">{new Date(horse.nextRace).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Dernière course: {new Date(horse.lastRace).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/horses/${horse.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Voir fiche
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
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Nouveau Cheval</h3>
              <p className="text-sm text-blue-700 mb-4">Enregistrer un nouveau cheval</p>
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
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Suivi Santé</h3>
              <p className="text-sm text-green-700 mb-4">Gérer les fiches médicales</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Heart className="w-4 h-4 mr-1" />
                Consulter
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
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Performances</h3>
              <p className="text-sm text-purple-700 mb-4">Analyser les résultats détaillés</p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Trophy className="w-4 h-4 mr-1" />
                Analyser
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
