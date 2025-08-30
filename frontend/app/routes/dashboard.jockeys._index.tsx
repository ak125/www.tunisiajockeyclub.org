import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { 
  Users, Award, TrendingUp, Trophy, Eye, Plus,
  Star, Calendar, Activity
} from 'lucide-react';

export async function loader({ request }: LoaderFunctionArgs) {
  // Pour l'instant, données simulées - à remplacer par l'API réelle
  const sampleJockeys = [
    {
      id: 1,
      name: 'Ahmed Ben Salem',
      age: 28,
      experience: 8,
      wins: 156,
      races: 420,
      winRate: 37.1,
      rating: 95,
      lastRace: '2025-08-25',
      status: 'active',
      specialties: ['Sprint', 'Mile']
    },
    {
      id: 2, 
      name: 'Fatma Trabelsi',
      age: 24,
      experience: 5,
      wins: 89,
      races: 250,
      winRate: 35.6,
      rating: 88,
      lastRace: '2025-08-20',
      status: 'active',
      specialties: ['Steeple', 'Distance']
    },
    {
      id: 3,
      name: 'Mohamed Karray',
      age: 35,
      experience: 15,
      wins: 312,
      races: 890,
      winRate: 35.1,
      rating: 92,
      lastRace: '2025-08-15',
      status: 'active',
      specialties: ['Mile', 'Distance']
    },
  ];

  return json({
    jockeys: sampleJockeys,
    jockeyStats: {
      total: sampleJockeys.length,
      active: sampleJockeys.filter(j => j.status === 'active').length,
      totalWins: sampleJockeys.reduce((sum, j) => sum + j.wins, 0),
      averageRating: Math.round(sampleJockeys.reduce((sum, j) => sum + j.rating, 0) / sampleJockeys.length),
    },
  });
}

export default function DashboardJockeys() {
  const { jockeys, jockeyStats } = useLoaderData<typeof loader>();
  const { permissions } = useOutletContext<{
    permissions: any;
  }>();

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'bg-purple-100 text-purple-800';
    if (rating >= 80) return 'bg-blue-100 text-blue-800';
    if (rating >= 70) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 35) return 'text-green-600';
    if (winRate >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 text-purple-600 mr-2" />
            Gestion des Jockeys
          </h1>
          <p className="text-gray-600">
            Profils et performances des jockeys du club
          </p>
        </div>
        
        {permissions.canManageHorses && (
          <Link
            to="/dashboard/jockeys/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau jockey</span>
          </Link>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total jockeys</p>
              <p className="text-xl font-bold text-purple-600">{jockeyStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En activité</p>
              <p className="text-xl font-bold text-green-600">{jockeyStats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Victoires totales</p>
              <p className="text-xl font-bold text-yellow-600">{jockeyStats.totalWins}</p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rating moyen</p>
              <p className="text-xl font-bold text-blue-600">{jockeyStats.averageRating}</p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-4">
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="retired">Retraité</option>
          </select>
          
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Toutes spécialités</option>
            <option value="sprint">Sprint</option>
            <option value="mile">Mile</option>
            <option value="distance">Distance</option>
            <option value="steeple">Steeple</option>
          </select>
          
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Trier par</option>
            <option value="wins">Victoires</option>
            <option value="winrate">% Victoires</option>
            <option value="rating">Rating</option>
            <option value="experience">Expérience</option>
          </select>
        </div>
      </div>

      {/* Liste des jockeys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jockeys.map((jockey) => (
          <div key={jockey.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
            {/* Header du profil */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{jockey.name}</h3>
                <p className="text-sm text-gray-600">{jockey.age} ans • {jockey.experience} ans d'expérience</p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    jockey.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-500 capitalize">{jockey.status}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={`/dashboard/jockeys/${jockey.id}`}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  title="Voir détails"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(jockey.rating)}`}>
                Rating: {jockey.rating}
              </span>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{jockey.wins}</p>
                <p className="text-xs text-gray-600">Victoires</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{jockey.races}</p>
                <p className="text-xs text-gray-600">Courses</p>
              </div>
              <div className="text-center">
                <p className={`text-lg font-bold ${getWinRateColor(jockey.winRate)}`}>
                  {jockey.winRate}%
                </p>
                <p className="text-xs text-gray-600">% Victoires</p>
              </div>
            </div>

            {/* Spécialités */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Spécialités:</p>
              <div className="flex flex-wrap gap-1">
                {jockey.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Dernière course */}
            <div className="flex items-center text-sm text-gray-600 border-t border-gray-100 pt-3">
              <Calendar className="h-4 w-4 mr-2" />
              Dernière course: {new Date(jockey.lastRace).toLocaleDateString('fr-FR')}
            </div>

            {/* Performance trend */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">En forme</span>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${
                      i < Math.floor(jockey.rating / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance comparison */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
          Comparaison des performances
        </h3>
        
        <div className="space-y-3">
          {jockeys.sort((a, b) => b.winRate - a.winRate).map((jockey, index) => (
            <div key={jockey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-gray-100 text-gray-800' :
                  index === 2 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900">{jockey.name}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`font-semibold ${getWinRateColor(jockey.winRate)}`}>
                  {jockey.winRate}%
                </span>
                <span className="text-sm text-gray-600">
                  {jockey.wins}/{jockey.races}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
