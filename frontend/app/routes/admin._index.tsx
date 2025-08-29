import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Trophy, Zap, Users, DollarSign, 
  TrendingUp, Activity, Calendar, MapPin 
} from "lucide-react";
import { DashboardLayout } from "~/components/dashboard/layout";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Récupérer les données du dashboard
  const stats = {
    totalRaces: 127,
    activeHorses: 342,
    totalUsers: 1584,
    revenue: 125430,
  };
  
  const recentRaces = [
    { id: '1', name: 'Prix de Carthage', date: '2025-08-21', status: 'upcoming' },
    { id: '2', name: 'Prix de Tunis', date: '2025-08-20', status: 'finished' },
    { id: '3', name: 'Prix de Kassar Said', date: '2025-08-19', status: 'finished' },
  ];

  return json({ stats, recentRaces });
};

export default function AdminDashboard() {
  const { stats, recentRaces } = useLoaderData<typeof loader>();

  const statsCards = [
    {
      title: "Courses Totales",
      value: stats.totalRaces.toLocaleString(),
      change: "+12%",
      icon: Trophy,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Chevaux Actifs",
      value: stats.activeHorses.toLocaleString(),
      change: "+5%",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers.toLocaleString(),
      change: "+18%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Revenus (TND)",
      value: stats.revenue.toLocaleString(),
      change: "+23%",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de Bord
            </h1>
            <p className="text-gray-600">
              Bienvenue sur votre centre de contrôle TJC
            </p>
          </div>
          
          {/* Live Updates */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div className="text-center">
                <div className="text-lg font-bold">234</div>
                <div className="text-xs text-gray-500">En ligne</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div className="text-center">
                <div className="text-lg font-bold">24</div>
                <div className="text-xs text-gray-500">Courses actives</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 ${card.bgColor} rounded-xl`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{card.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Races */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-blue-600" />
            Prochaines Courses
          </h3>
          <div className="space-y-3">
            {recentRaces.map((race, index) => (
              <motion.div
                key={race.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    R{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{race.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Hippodrome de Kassar Saïd</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    race.status === 'upcoming' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {race.status === 'upcoming' ? 'À venir' : 'Terminée'}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">12 chevaux inscrits</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
