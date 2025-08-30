import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  BarChart3, PieChart, Activity, 
  Calendar, Users, Trophy, Target, Clock,
  ArrowRight, Filter, Download, RefreshCw
} from "lucide-react";

// Types pour les analytics
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface AnalyticsData {
  horsesPerformance: ChartData;
  racesTrends: ChartData;
  jockeysStats: ChartData;
  monthlyStats: {
    total_races: number;
    total_horses: number;
    avg_race_time: number;
    fastest_time: number;
  };
  topPerformers: {
    horses: Array<{ name: string; wins: number; avg_time: number }>;
    jockeys: Array<{ name: string; wins: number; races: number }>;
  };
  raceDistribution: ChartData;
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Données simulées pour les analytics
    const mockData: AnalyticsData = {
      horsesPerformance: {
        labels: ['Thunder Bolt', 'Desert Storm', 'Golden Arrow', 'Silver Wind', 'Fire Spirit'],
        datasets: [{
          label: 'Victoires',
          data: [15, 12, 10, 8, 6],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          borderColor: '#374151',
          borderWidth: 1
        }]
      },
      racesTrends: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Nombre de courses',
          data: [12, 15, 18, 22, 19, 25],
          backgroundColor: ['#3B82F6'],
          borderColor: '#1D4ED8',
          borderWidth: 2
        }]
      },
      jockeysStats: {
        labels: ['Ahmed Ben Ali', 'Fatma Trabelsi', 'Mohamed Sassi', 'Leila Hamdi', 'Karim Touati'],
        datasets: [{
          label: 'Taux de réussite (%)',
          data: [85, 78, 72, 65, 58],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderColor: '#374151',
          borderWidth: 1
        }]
      },
      raceDistribution: {
        labels: ['Sprint', 'Mile', 'Distance', 'Steeple'],
        datasets: [{
          label: 'Répartition des courses',
          data: [35, 28, 22, 15],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
          borderColor: '#FFFFFF',
          borderWidth: 2
        }]
      },
      monthlyStats: {
        total_races: 156,
        total_horses: 45,
        avg_race_time: 125.3,
        fastest_time: 98.7
      },
      topPerformers: {
        horses: [
          { name: 'Thunder Bolt', wins: 15, avg_time: 102.5 },
          { name: 'Desert Storm', wins: 12, avg_time: 104.2 },
          { name: 'Golden Arrow', wins: 10, avg_time: 105.8 },
          { name: 'Silver Wind', wins: 8, avg_time: 107.1 },
          { name: 'Fire Spirit', wins: 6, avg_time: 109.3 }
        ],
        jockeys: [
          { name: 'Ahmed Ben Ali', wins: 25, races: 45 },
          { name: 'Fatma Trabelsi', wins: 22, races: 42 },
          { name: 'Mohamed Sassi', wins: 18, races: 38 },
          { name: 'Leila Hamdi', wins: 15, races: 35 },
          { name: 'Karim Touati', wins: 12, races: 30 }
        ]
      }
    };

    return json(mockData);
  } catch (error) {
    console.error("Erreur lors du chargement des analytics:", error);
    return json({
      horsesPerformance: { labels: [], datasets: [] },
      racesTrends: { labels: [], datasets: [] },
      jockeysStats: { labels: [], datasets: [] },
      raceDistribution: { labels: [], datasets: [] },
      monthlyStats: {
        total_races: 0,
        total_horses: 0,
        avg_race_time: 0,
        fastest_time: 0
      },
      topPerformers: {
        horses: [],
        jockeys: []
      }
    });
  }
}

// Composant pour les graphiques en barres simple
function SimpleBarChart({ data, title, color = "#3B82F6" }: { 
  data: ChartData; 
  title: string; 
  color?: string; 
}) {
  const maxValue = Math.max(...(data.datasets[0]?.data || [0]));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" style={{ color }} />
        {title}
      </h3>
      <div className="space-y-3">
        {data.labels.map((label, index) => {
          const value = data.datasets[0]?.data[index] || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div key={label} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600 truncate">{label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-900 text-right">
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Composant pour les graphiques en secteurs simple
function SimplePieChart({ data, title }: { data: ChartData; title: string }) {
  const total = (data.datasets[0]?.data || []).reduce((sum, value) => sum + value, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-purple-600" />
        {title}
      </h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.labels.map((label, index) => {
              const value = data.datasets[0]?.data[index] || 0;
              const percentage = total > 0 ? (value / total) * 100 : 0;
              const strokeDasharray = `${percentage * 3.14159} ${314.159}`;
              const strokeDashoffset = index === 0 ? 0 : 
                -(data.datasets[0]?.data.slice(0, index).reduce((sum, v) => sum + v, 0) || 0) / total * 314.159;
              
              return (
                <motion.circle
                  key={label}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={data.datasets[0]?.backgroundColor?.[index] || '#3B82F6'}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  initial={{ strokeDasharray: "0 314.159" }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              );
            })}
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.labels.map((label, index) => {
          const value = data.datasets[0]?.data[index] || 0;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          
          return (
            <div key={label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: data.datasets[0]?.backgroundColor?.[index] || '#3B82F6' }}
                />
                <span className="text-gray-600">{label}</span>
              </div>
              <span className="font-medium text-gray-900">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const data = useLoaderData<AnalyticsData>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm border-b border-gray-200"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-8 h-8 text-indigo-600" />
                Analytics & Statistiques
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Analysez les performances et tendances en temps réel
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/dashboard-main"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Dashboard
              </Link>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{data.monthlyStats.total_races}</p>
                <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chevaux Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{data.monthlyStats.total_horses}</p>
                <p className="text-xs text-green-600 mt-1">+5 nouveaux</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{data.monthlyStats.avg_race_time}s</p>
                <p className="text-xs text-red-600 mt-1">-2.1s amélioration</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meilleur Temps</p>
                <p className="text-2xl font-bold text-gray-900">{data.monthlyStats.fastest_time}s</p>
                <p className="text-xs text-green-600 mt-1">Record battu!</p>
              </div>
              <Target className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div variants={itemVariants}>
            <SimpleBarChart
              data={data.horsesPerformance}
              title="Performance des Chevaux"
              color="#3B82F6"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SimpleBarChart
              data={data.racesTrends}
              title="Tendances des Courses"
              color="#10B981"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SimpleBarChart
              data={data.jockeysStats}
              title="Statistiques des Jockeys"
              color="#F59E0B"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SimplePieChart
              data={data.raceDistribution}
              title="Répartition par Type"
            />
          </motion.div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Top Chevaux
              </h3>
              <div className="space-y-3">
                {data.topPerformers.horses.map((horse, index) => (
                  <motion.div
                    key={horse.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${
                        index < 3 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{horse.name}</p>
                        <p className="text-sm text-gray-600">{horse.wins} victoires</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{horse.avg_time}s</p>
                      <p className="text-xs text-gray-500">temps moyen</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Top Jockeys
              </h3>
              <div className="space-y-3">
                {data.topPerformers.jockeys.map((jockey, index) => (
                  <motion.div
                    key={jockey.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index < 3 ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${
                        index < 3 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">{jockey.name}</p>
                        <p className="text-sm text-gray-600">{jockey.races} courses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{jockey.wins}</p>
                      <p className="text-xs text-gray-500">victoires</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
