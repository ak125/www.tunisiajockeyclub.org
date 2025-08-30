import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { 
  Trophy, Users, Calendar, Activity,
  TrendingUp, AlertTriangle, Clock, Target
} from "lucide-react";
import { createSecureLoader } from "../utils/auth.server";

export const loader = createSecureLoader(async ({ context }) => {
  // En production, récupérer les vraies données depuis l'API
  const stats = {
    totalRaces: 124,
    totalUsers: 89,
    activeJockeys: 32,
    upcomingRaces: 8,
    todayEntries: 45,
    pendingApprovals: 3
  };

  const recentActivity = [
    { type: 'race_created', message: 'Nouvelle course "Prix de Carthage" créée', time: '2 min ago' },
    { type: 'user_registered', message: 'Nouveau membre: Ahmed Trabelsi', time: '15 min ago' },
    { type: 'result_updated', message: 'Résultats du Prix de Tunis mis à jour', time: '1h ago' },
    { type: 'approval_pending', message: 'Inscription en attente d\'approbation', time: '2h ago' }
  ];

  return json({ 
    user: context.user,
    stats,
    recentActivity 
  });
}, { requireAuth: true, minRole: 'ADMIN' });

export default function AdminDashboard() {
  const { stats, recentActivity } = useLoaderData<typeof loader>();

  const statCards = [
    { 
      title: 'Total Courses', 
      value: stats.totalRaces.toString(), 
      icon: Trophy, 
      color: 'text-blue-600',
      change: '+12%'
    },
    { 
      title: 'Utilisateurs', 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: 'text-green-600',
      change: '+8%'
    },
    { 
      title: 'Jockeys Actifs', 
      value: stats.activeJockeys.toString(), 
      icon: Activity, 
      color: 'text-purple-600',
      change: '+5%'
    },
    { 
      title: 'Courses à venir', 
      value: stats.upcomingRaces.toString(), 
      icon: Calendar, 
      color: 'text-orange-600',
      change: '+3'
    }
  ];

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Administrateur
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble du système - Tunisia Jockey Club
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
        {/* Activité Récente */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Activité Récente</h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.type === 'approval_pending' && (
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Actions Rapides</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Nouvelle Course</h3>
              <p className="text-sm text-gray-600">Créer une course</p>
            </button>

            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Gérer Utilisateurs</h3>
              <p className="text-sm text-gray-600">Voir les membres</p>
            </button>

            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <Trophy className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Résultats</h3>
              <p className="text-sm text-gray-600">Saisir résultats</p>
            </button>

            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <Activity className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Voir statistiques</p>
            </button>
          </div>
        </div>
      </div>

      {/* Alertes / Notifications */}
      {stats.pendingApprovals > 0 && (
        <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Attention requise</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-orange-700">
              {stats.pendingApprovals} inscriptions en attente d'approbation
            </p>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              Action requise
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
