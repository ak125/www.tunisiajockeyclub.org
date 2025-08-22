import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Trophy, Home, Users, DollarSign, TrendingUp, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const loader = async () => {
  return json({
    stats: {
      totalRaces: 127,
      activeHorses: 342,
      totalUsers: 1584,
      revenue: 125430,
    },
    liveStats: {
      onlineUsers: 234,
      activeBets: 89,
      nextRaceIn: '00:45:23'
    }
  });
};

export default function DashboardTest() {
  const { stats, liveStats } = useLoaderData<typeof loader>();

  const statsCards = [
    {
      title: "Courses Totales",
      value: stats.totalRaces.toLocaleString(),
      change: "+12%",
      icon: Trophy,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Chevaux Actifs",
      value: stats.activeHorses.toLocaleString(),
      change: "+5%",
      icon: Home,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers.toLocaleString(),
      change: "+18%",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Revenus (TND)",
      value: stats.revenue.toLocaleString(),
      change: "+23%",
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Moderne */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">🏇 Tunisia Jockey Club</h1>
              <p className="text-blue-100">Dashboard Admin Moderne - Shadcn/ui + Lucide React</p>
            </div>

            {/* Stats Live */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                  <span className="text-2xl font-bold">{liveStats.onlineUsers}</span>
                </div>
                <p className="text-xs text-blue-100">En ligne</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold">{liveStats.activeBets}</span>
                </div>
                <p className="text-xs text-blue-100">Paris actifs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📊 Statistiques en Temps Réel
          </h2>
          <p className="text-gray-600">
            Tableau de bord avec animations Framer Motion et composants Shadcn/ui
          </p>
        </div>

        {/* Stats Cards avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{card.change}</span>
                </div>
              </div>
              
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-gray-900">Serveur Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">NestJS</span>
                <span className="text-green-600 font-medium">✅ Opérationnel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Redis</span>
                <span className="text-green-600 font-medium">✅ Connecté</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Supabase</span>
                <span className="text-green-600 font-medium">✅ API REST</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Stack Moderne</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Vite + Remix</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Shadcn/ui + Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Lucide React Icons</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Framer Motion</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
          >
            <h3 className="text-lg font-semibold mb-4">🚀 Prochaine Étape</h3>
            <p className="text-blue-100 text-sm mb-4">
              Dashboard opérationnel ! Prêt pour les fonctionnalités avancées :
            </p>
            <ul className="text-xs text-blue-100 space-y-1">
              <li>• WebSocket temps réel</li>
              <li>• Gestion des courses</li>
              <li>• Analytics avancés</li>
              <li>• Interface mobile PWA</li>
            </ul>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ✅ Dashboard Moderne Configuré !
          </h3>
          <p className="text-gray-600">
            Stack: Vite ✅ Shadcn/ui ✅ Lucide React ✅ Framer Motion ✅ Tailwind ✅
          </p>
        </div>
      </div>
    </div>
  );
}
