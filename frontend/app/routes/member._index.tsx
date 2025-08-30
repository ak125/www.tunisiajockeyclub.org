import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { 
  Activity, 
  Calendar, 
  Trophy, 
  TrendingUp,
  Clock,
  Target,
  AlertCircle
} from "lucide-react";
import { createSecureLoader } from "../utils/auth.server";

export const loader = createSecureLoader(async ({ context }) => {
  // En production, récupérer les données du membre depuis l'API
  const memberStats = {
    totalHorses: 3,
    activeRaces: 5,
    wins: 12,
    totalRaces: 45,
    winRate: 26.7,
    earnings: 45000
  };

  const upcomingRaces = [
    { id: '1', name: 'Prix de Carthage', date: '2025-08-30', horse: 'Thunder Strike', time: '15:30' },
    { id: '2', name: 'Prix de Tunis', date: '2025-09-02', horse: 'Desert Wind', time: '16:00' },
    { id: '3', name: 'Prix des Oliviers', date: '2025-09-05', horse: 'Golden Arrow', time: '14:45' }
  ];

  const recentResults = [
    { race: 'Prix des Jasmins', horse: 'Thunder Strike', position: 1, date: '2025-08-25', prize: 15000 },
    { race: 'Prix de Sidi Bou Said', horse: 'Desert Wind', position: 3, date: '2025-08-20', prize: 5000 },
    { race: 'Prix de La Marsa', horse: 'Golden Arrow', position: 2, date: '2025-08-18', prize: 8000 }
  ];

  return json({ 
    user: context.user,
    memberStats,
    upcomingRaces,
    recentResults
  });
}, { requireAuth: true, minRole: 'MEMBER' });

export default function MemberDashboard() {
  const { user, memberStats, upcomingRaces, recentResults } = useLoaderData<typeof loader>();

  const statCards = [
    { 
      title: 'Mes Chevaux', 
      value: memberStats.totalHorses.toString(), 
      icon: Activity, 
      color: 'text-blue-600',
      change: '+1 ce mois'
    },
    { 
      title: 'Courses Actives', 
      value: memberStats.activeRaces.toString(), 
      icon: Calendar, 
      color: 'text-green-600',
      change: '+2 cette semaine'
    },
    { 
      title: 'Victoires', 
      value: memberStats.wins.toString(), 
      icon: Trophy, 
      color: 'text-yellow-600',
      change: `${memberStats.winRate}% de réussite`
    },
    { 
      title: 'Gains Totaux', 
      value: `${(memberStats.earnings / 1000).toFixed(0)}k TND`, 
      icon: TrendingUp, 
      color: 'text-purple-600',
      change: '+15% ce mois'
    }
  ];

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-600">
          Votre tableau de bord personnel - Tunisia Jockey Club
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prochaines Courses */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Prochaines Courses</h2>
          </div>
          <div className="space-y-4">
            {upcomingRaces.map((race, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-900">{race.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{race.horse}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(race.date).toLocaleDateString('fr-FR')} - {race.time}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  Détails
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Résultats Récents */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold">Résultats Récents</h2>
          </div>
          <div className="space-y-4">
            {recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{result.race}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{result.horse}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(result.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                    result.position === 2 ? 'bg-gray-100 text-gray-800' :
                    result.position === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.position === 1 ? '1ère' : result.position === 2 ? '2ème' : result.position === 3 ? '3ème' : `${result.position}ème`}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">{result.prize?.toLocaleString('fr-FR')} TND</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Actions Rapides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Nouvelle Inscription</h3>
              <p className="text-sm text-gray-600">Inscrire un cheval à une course</p>
            </button>

            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <Activity className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Gérer mes Chevaux</h3>
              <p className="text-sm text-gray-600">Voir et modifier mes chevaux</p>
            </button>

            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <Trophy className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Historique</h3>
              <p className="text-sm text-gray-600">Consulter mes performances</p>
            </button>
          </div>
        </div>
      </div>

      {/* Notification importantes */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-amber-800">Rappel Important</h3>
        </div>
        <p className="text-amber-700 mt-1">
          N'oubliez pas de confirmer vos inscriptions pour les courses de la semaine prochaine avant demain 18h.
        </p>
      </div>
    </div>
  );
}
