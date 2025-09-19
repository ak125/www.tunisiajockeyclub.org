import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  Zap,
  Clock,
  MapPin,
  Filter,
  Download
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Scatter,
  ScatterChart,
  ZAxis
} from "recharts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Données enrichies avec vrais noms tunisiens et statistiques détaillées
  const currentYear = 2025;
  
  const monthlyData = [
    { 
      month: "Jan", 
      revenue: 285000, 
      races: 28, 
      attendance: 12500,
      horses: 185,
      jockeys: 42,
      avgPrize: 10000,
      weather: 'sunny',
      victories: { local: 18, international: 10 }
    },
    { 
      month: "Fév", 
      revenue: 320000, 
      races: 32, 
      attendance: 14200,
      horses: 192,
      jockeys: 45,
      avgPrize: 10500,
      weather: 'cloudy',
      victories: { local: 22, international: 10 }
    },
    { 
      month: "Mar", 
      revenue: 385000, 
      races: 35, 
      attendance: 16800,
      horses: 205,
      jockeys: 48,
      avgPrize: 11000,
      weather: 'sunny',
      victories: { local: 25, international: 10 }
    },
    { 
      month: "Avr", 
      revenue: 425000, 
      races: 38, 
      attendance: 18500,
      horses: 218,
      jockeys: 52,
      avgPrize: 11200,
      weather: 'rainy',
      victories: { local: 26, international: 12 }
    },
    { 
      month: "Mai", 
      revenue: 480000, 
      races: 42, 
      attendance: 21000,
      horses: 230,
      jockeys: 55,
      avgPrize: 11500,
      weather: 'sunny',
      victories: { local: 30, international: 12 }
    },
    { 
      month: "Jun", 
      revenue: 520000, 
      races: 45, 
      attendance: 23500,
      horses: 242,
      jockeys: 58,
      avgPrize: 11600,
      weather: 'sunny',
      victories: { local: 32, international: 13 }
    },
    { 
      month: "Jul", 
      revenue: 685000, 
      races: 52, 
      attendance: 28500,
      horses: 255,
      jockeys: 62,
      avgPrize: 13200,
      weather: 'hot',
      victories: { local: 38, international: 14 }
    },
    { 
      month: "Aoû", 
      revenue: 745000, 
      races: 48, 
      attendance: 26800,
      horses: 248,
      jockeys: 60,
      avgPrize: 15500,
      weather: 'hot',
      victories: { local: 35, international: 13 }
    }
  ];

  const raceTypes = [
    { name: "Pur-sang Arabe", value: 45, races: 156, prize: 2500000, color: "#3B82F6", growth: 12 },
    { name: "Galop", value: 25, races: 87, prize: 1850000, color: "#10B981", growth: 8 },
    { name: "Trot", value: 15, races: 52, prize: 980000, color: "#F59E0B", growth: -2 },
    { name: "Cross-Country", value: 10, races: 35, prize: 750000, color: "#EF4444", growth: 15 },
    { name: "Obstacle", value: 5, races: 17, prize: 420000, color: "#8B5CF6", growth: 22 }
  ];

  const hippodromes = [
    {
      name: "Carthage",
      location: "Tunis",
      races: 142,
      attendance: 85000,
      revenue: 2800000,
      capacity: 12000,
      rating: 4.8,
      features: ['Piste en sable', 'Éclairage nocturne', 'Paddock VIP'],
      coordinates: { x: 36.8, y: 10.3 },
      monthlyTrends: monthlyData.map(m => ({ month: m.month, revenue: m.revenue * 0.4, races: Math.floor(m.races * 0.45) }))
    },
    {
      name: "Tunis",
      location: "Tunis",
      races: 98,
      attendance: 62000,
      revenue: 2100000,
      capacity: 8000,
      rating: 4.5,
      features: ['Piste en gazon', 'Tribunes modernes'],
      coordinates: { x: 36.8, y: 10.2 },
      monthlyTrends: monthlyData.map(m => ({ month: m.month, revenue: m.revenue * 0.3, races: Math.floor(m.races * 0.35) }))
    },
    {
      name: "Sousse",
      location: "Sahel",
      races: 78,
      attendance: 45000,
      revenue: 1650000,
      capacity: 6000,
      rating: 4.3,
      features: ['Vue sur mer', 'Restaurant panoramique'],
      coordinates: { x: 35.8, y: 10.6 },
      monthlyTrends: monthlyData.map(m => ({ month: m.month, revenue: m.revenue * 0.2, races: Math.floor(m.races * 0.25) }))
    },
    {
      name: "Ben Guerdane",
      location: "Sud",
      races: 32,
      attendance: 18000,
      revenue: 950000,
      capacity: 3000,
      rating: 4.0,
      features: ['Authentique', 'Ambiance traditionnelle'],
      coordinates: { x: 33.1, y: 11.2 },
      monthlyTrends: monthlyData.map(m => ({ month: m.month, revenue: m.revenue * 0.1, races: Math.floor(m.races * 0.15) }))
    }
  ];

  const topPerformers = {
    horses: [
      { name: "Rahib Albadeia", wins: 12, earnings: 185000, winRate: 75, races: 16, trend: "up", specialty: "Distance" },
      { name: "Razane", wins: 9, earnings: 145000, winRate: 64, races: 14, trend: "up", specialty: "Sprint" },
      { name: "Rafaan", wins: 8, earnings: 132000, winRate: 53, races: 15, trend: "stable", specialty: "Mile" },
      { name: "Zahouel", wins: 6, earnings: 98000, winRate: 46, races: 13, trend: "up", specialty: "Galop" },
      { name: "Ramz El Fakhir", wins: 5, earnings: 87000, winRate: 42, races: 12, trend: "down", specialty: "Cross" }
    ],
    jockeys: [
      { name: "Ahmed Ben Salem", wins: 48, earnings: 650000, winRate: 35, races: 137, trend: "up", age: 32 },
      { name: "Fatma Trabelsi", wins: 42, earnings: 580000, winRate: 33, races: 127, trend: "up", age: 28 },
      { name: "Mohamed Karray", wins: 38, earnings: 520000, winRate: 31, races: 123, trend: "stable", age: 38 },
      { name: "Sami Jouini", wins: 28, earnings: 385000, winRate: 29, races: 97, trend: "up", age: 24 },
      { name: "Leila Ben Mahmoud", wins: 25, earnings: 345000, winRate: 28, races: 89, trend: "stable", age: 30 }
    ],
    trainers: [
      { name: "Dhaou Brik", wins: 35, horses: 18, winRate: 38, earnings: 485000, trend: "up" },
      { name: "M'ghorghor", wins: 32, horses: 22, winRate: 35, earnings: 425000, trend: "stable" },
      { name: "Sadoq Triki", wins: 28, horses: 16, winRate: 33, earnings: 385000, trend: "up" },
      { name: "Nasri Ammar", wins: 24, horses: 14, winRate: 31, earnings: 325000, trend: "down" },
      { name: "Faouzi Ali B.", wins: 22, horses: 12, winRate: 29, earnings: 295000, trend: "stable" }
    ]
  };

  const raceDistanceAnalysis = [
    { distance: "1000m", races: 45, avgTime: "58.2s", winMargin: "1.2L", favorites: 68 },
    { distance: "1200m", races: 78, avgTime: "1:09.8", winMargin: "0.8L", favorites: 72 },
    { distance: "1400m", races: 92, avgTime: "1:22.1", winMargin: "1.1L", favorites: 65 },
    { distance: "1600m", races: 68, avgTime: "1:35.4", winMargin: "1.5L", favorites: 63 },
    { distance: "2000m", races: 52, avgTime: "2:02.3", winMargin: "2.1L", favorites: 58 },
    { distance: "2400m", races: 28, avgTime: "2:28.7", winMargin: "3.2L", favorites: 55 }
  ];

  const economicImpact = {
    directRevenue: 4850000,
    betting: 12500000,
    tourism: 3200000,
    employment: 850,
    taxes: 1450000,
    sponsorship: 950000,
    mediaRights: 320000,
    merchandise: 180000
  };

  const weatherImpact = [
    { condition: "Ensoleillé", races: 186, avgAttendance: 2450, winTime: "1:32.1", satisfaction: 92 },
    { condition: "Nuageux", races: 78, avgAttendance: 2180, winTime: "1:33.8", satisfaction: 85 },
    { condition: "Pluvieux", races: 32, avgAttendance: 1650, winTime: "1:38.2", satisfaction: 68 },
    { condition: "Venteux", races: 45, avgAttendance: 2020, winTime: "1:35.4", satisfaction: 78 },
    { condition: "Chaud", races: 89, avgAttendance: 2850, winTime: "1:34.9", satisfaction: 89 }
  ];

  return json({ 
    monthlyData, 
    raceTypes, 
    topPerformers, 
    hippodromes,
    raceDistanceAnalysis,
    economicImpact,
    weatherImpact,
    currentYear
  });
};

export default function StatisticsAdvanced() {
  const { 
    monthlyData, 
    raceTypes, 
    topPerformers, 
    hippodromes,
    raceDistanceAnalysis,
    economicImpact,
    weatherImpact,
    currentYear 
  } = useLoaderData<typeof loader>();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'performance' | 'economics' | 'analysis'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedHippodrome, setSelectedHippodrome] = useState('all');

  const totalRevenue = monthlyData.reduce((acc, month) => acc + month.revenue, 0);
  const totalRaces = monthlyData.reduce((acc, month) => acc + month.races, 0);
  const totalAttendance = monthlyData.reduce((acc, month) => acc + month.attendance, 0);
  const avgRacesPerMonth = totalRaces / monthlyData.length;
  const revenueGrowth = ((monthlyData[monthlyData.length - 1].revenue - monthlyData[0].revenue) / monthlyData[0].revenue * 100);

  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { key: 'performance', label: 'Performances', icon: Trophy },
    { key: 'economics', label: 'Économie', icon: DollarSign },
    { key: 'analysis', label: 'Analyses', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📊 Analytics & Intelligence - Tunisia Jockey Club
            </h1>
            <p className="text-gray-600 text-lg">Données complètes et analyses avancées - Saison {currentYear}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <option value="monthly">Mensuel</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="daily">Quotidien</option>
            </select>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Dashboard principal */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
      >
        {[
          { label: 'Revenus', value: `${(totalRevenue / 1000000).toFixed(1)}M DT`, change: `+${revenueGrowth.toFixed(1)}%`, icon: DollarSign, color: 'green', trend: 'up' },
          { label: 'Courses', value: totalRaces.toString(), change: '+8.3%', icon: Activity, color: 'blue', trend: 'up' },
          { label: 'Spectateurs', value: `${Math.round(totalAttendance / 1000)}k`, change: '+15.2%', icon: Users, color: 'purple', trend: 'up' },
          { label: 'Moy./Mois', value: avgRacesPerMonth.toFixed(1), change: '+6.8%', icon: Calendar, color: 'orange', trend: 'up' },
          { label: 'Chevaux', value: '248', change: '+12.5%', icon: Target, color: 'pink', trend: 'up' },
          { label: 'Jockeys', value: '60', change: '+8.9%', icon: Star, color: 'yellow', trend: 'up' },
          { label: 'Hippodromes', value: '4', change: '0%', icon: MapPin, color: 'red', trend: 'stable' },
          { label: 'Taux Succès', value: '94.2%', change: '+2.1%', icon: Zap, color: 'teal', trend: 'up' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-${stat.color}-400`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                 stat.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : 
                 <Activity className="h-3 w-3 mr-1" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation tabs */}
      <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              selectedTab === tab.key 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des tabs */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Graphique principal des revenus */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Évolution des Revenus {currentYear}</h3>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +{revenueGrowth.toFixed(1)}%
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" fill="#3B82F6" fillOpacity={0.3} />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                      <Bar dataKey="races" fill="#10B981" opacity={0.7} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution par type de course */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Types de Courses - Distribution</h3>
                <div className="h-80 flex">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={raceTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {raceTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-3">
                    {raceTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-800">{type.name}</p>
                            <p className="text-sm text-gray-600">{type.races} courses</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{type.value}%</p>
                          <p className={`text-xs font-medium ${
                            type.growth > 0 ? 'text-green-600' : type.growth < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {type.growth > 0 ? '+' : ''}{type.growth}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance des hippodromes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance par Hippodrome</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {hippodromes.map((hippodrome, index) => (
                  <motion.div
                    key={hippodrome.name}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{hippodrome.name}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.floor(hippodrome.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Courses:</span>
                        <span className="font-medium">{hippodrome.races}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spectateurs:</span>
                        <span className="font-medium">{hippodrome.attendance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenus:</span>
                        <span className="font-medium text-green-600">{(hippodrome.revenue / 1000).toFixed(0)}k DT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacité:</span>
                        <span className="font-medium">{hippodrome.capacity.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-1">Caractéristiques:</p>
                      <div className="flex flex-wrap gap-1">
                        {hippodrome.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Chevaux */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
                  Top Chevaux
                </h3>
                <div className="space-y-3">
                  {topPerformers.horses.map((horse, index) => (
                    <div key={horse.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{horse.name}</p>
                          <p className="text-xs text-gray-600">{horse.specialty} • {horse.races} courses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{horse.wins} V</p>
                        <p className="text-xs text-gray-600">{horse.winRate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Jockeys */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-purple-600 mr-2" />
                  Top Jockeys
                </h3>
                <div className="space-y-3">
                  {topPerformers.jockeys.map((jockey, index) => (
                    <div key={jockey.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{jockey.name}</p>
                          <p className="text-xs text-gray-600">{jockey.age} ans • {jockey.races} courses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{jockey.wins} V</p>
                        <p className="text-xs text-gray-600">{jockey.winRate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Entraîneurs */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-green-600 mr-2" />
                  Top Entraîneurs
                </h3>
                <div className="space-y-3">
                  {topPerformers.trainers.map((trainer, index) => (
                    <div key={trainer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{trainer.name}</p>
                          <p className="text-xs text-gray-600">{trainer.horses} chevaux</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{trainer.wins} V</p>
                        <p className="text-xs text-gray-600">{trainer.winRate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analyse par distance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse par Distance de Course</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={raceDistanceAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="distance" stroke="#64748b" />
                    <YAxis yAxisId="left" stroke="#64748b" />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="races" fill="#3B82F6" name="Nombre de courses" />
                    <Line yAxisId="right" type="monotone" dataKey="favorites" stroke="#10B981" strokeWidth={2} name="% Favoris gagnants" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'economics' && (
          <motion.div
            key="economics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Impact économique */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Impact Économique Total - {currentYear}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(economicImpact).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{(value / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                    <p className="text-xs text-green-600 mt-1">+12.3%</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(economicImpact).map(([key, value]) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        value,
                        percentage: ((value / Object.values(economicImpact).reduce((a, b) => a + b)) * 100).toFixed(1)
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {Object.keys(economicImpact).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}M DT`, 'Montant']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Impact météorologique */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Impact des Conditions Météorologiques</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={weatherImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="avgAttendance" name="Spectateurs moyens" />
                    <YAxis dataKey="satisfaction" name="Satisfaction %" />
                    <ZAxis dataKey="races" range={[50, 400]} name="Nombre de courses" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-semibold">{data.condition}</p>
                              <p>Courses: {data.races}</p>
                              <p>Spectateurs: {data.avgAttendance}</p>
                              <p>Satisfaction: {data.satisfaction}%</p>
                              <p>Temps moyen: {data.winTime}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter dataKey="satisfaction" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tendances avancées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Évolution Spectateurs vs Courses</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area yAxisId="left" type="monotone" dataKey="attendance" fill="#3B82F6" fillOpacity={0.3} />
                      <Line yAxisId="right" type="monotone" dataKey="races" stroke="#10B981" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Corrélation Prix Moyen / Participation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgPrize" stroke="#F59E0B" strokeWidth={2} name="Prix moyen" />
                      <Line type="monotone" dataKey="horses" stroke="#EF4444" strokeWidth={2} name="Chevaux participants" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
