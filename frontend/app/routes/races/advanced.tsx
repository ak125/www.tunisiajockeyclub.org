import { Link } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts";

interface Race {
  id: string;
  name: string;
  date: string;
  time: string;
  distance: number;
  surface: string;
  category: string;
  participants: number;
  prize: number;
  weather: string;
  status: "En cours" | "Terminée" | "Programmée";
  results?: {
    position: number;
    horse: string;
    jockey: string;
    time: string;
    odds: number;
  }[];
  analytics: {
    averageSpeed: number;
    competitiveness: number;
    excitement: number;
    predictability: number;
    attendance: number;
    revenue: number;
  };
}

const tunisianRaces: Race[] = [
  {
    id: "prix-president-2024",
    name: "Prix du Président de la République",
    date: "2024-11-15",
    time: "15:30",
    distance: 2000,
    surface: "Turf",
    category: "Groupe I",
    participants: 14,
    prize: 150000,
    weather: "Ensoleillé",
    status: "Terminée",
    results: [
      { position: 1, horse: "Rahib Albadeia", jockey: "Khalil Ben Ali", time: "2:02.45", odds: 3.2 },
      { position: 2, horse: "Razane", jockey: "Mohamed Bouazizi", time: "2:02.78", odds: 4.1 },
      { position: 3, horse: "Zahouel", jockey: "Slim Karray", time: "2:03.12", odds: 8.5 }
    ],
    analytics: {
      averageSpeed: 59.8,
      competitiveness: 95,
      excitement: 92,
      predictability: 68,
      attendance: 8500,
      revenue: 245000
    }
  },
  {
    id: "coupe-tunisie-2024",
    name: "Coupe de Tunisie des Pur-Sang",
    date: "2024-10-28",
    time: "14:15",
    distance: 1600,
    surface: "Turf",
    category: "Groupe II",
    participants: 16,
    prize: 80000,
    weather: "Nuageux",
    status: "Terminée",
    results: [
      { position: 1, horse: "Rafaan", jockey: "Nizar Mejri", time: "1:38.92", odds: 2.8 },
      { position: 2, horse: "Salam El Donia", jockey: "Ahmed Trabelsi", time: "1:39.23", odds: 5.2 }
    ],
    analytics: {
      averageSpeed: 58.3,
      competitiveness: 88,
      excitement: 85,
      predictability: 72,
      attendance: 6200,
      revenue: 168000
    }
  },
  {
    id: "derby-kasserine-2024",
    name: "Derby de Kasserine",
    date: "2024-12-08",
    time: "16:00",
    distance: 2400,
    surface: "Turf",
    category: "Groupe III",
    participants: 12,
    prize: 60000,
    weather: "Pluvieux",
    status: "Programmée",
    analytics: {
      averageSpeed: 0,
      competitiveness: 82,
      excitement: 78,
      predictability: 65,
      attendance: 0,
      revenue: 0
    }
  },
  {
    id: "prix-carthage-2024",
    name: "Prix de Carthage International",
    date: "2024-12-22",
    time: "15:45",
    distance: 1800,
    surface: "Turf",
    category: "International",
    participants: 18,
    prize: 200000,
    weather: "Prévu ensoleillé",
    status: "Programmée",
    analytics: {
      averageSpeed: 0,
      competitiveness: 96,
      excitement: 94,
      predictability: 58,
      attendance: 0,
      revenue: 0
    }
  }
];

const monthlyRaceData = [
  { month: "Jan", races: 8, revenue: 180000, attendance: 12500 },
  { month: "Fév", races: 6, revenue: 140000, attendance: 9800 },
  { month: "Mar", races: 10, revenue: 280000, attendance: 18500 },
  { month: "Avr", races: 12, revenue: 320000, attendance: 22000 },
  { month: "Mai", races: 14, revenue: 380000, attendance: 26500 },
  { month: "Jun", races: 16, revenue: 450000, attendance: 31000 },
  { month: "Jul", races: 18, revenue: 520000, attendance: 35500 },
  { month: "Aoû", races: 20, revenue: 580000, attendance: 38000 },
  { month: "Sep", races: 16, revenue: 460000, attendance: 32500 },
  { month: "Oct", races: 14, revenue: 390000, attendance: 28000 },
  { month: "Nov", races: 12, revenue: 350000, attendance: 24500 },
  { month: "Déc", races: 10, revenue: 280000, attendance: 20000 }
];

const categoriesData = [
  { name: "Groupe I", value: 12, color: "#FF6B6B" },
  { name: "Groupe II", value: 28, color: "#4ECDC4" },
  { name: "Groupe III", value: 45, color: "#45B7D1" },
  { name: "Handicap", value: 62, color: "#FFA07A" },
  { name: "Conditions", value: 38, color: "#98D8C8" }
];

const performanceByDistance = [
  { distance: "1200m", avgTime: "1:12.45", races: 25, excitement: 78 },
  { distance: "1400m", avgTime: "1:24.32", races: 35, excitement: 82 },
  { distance: "1600m", avgTime: "1:38.76", races: 42, excitement: 86 },
  { distance: "1800m", avgTime: "1:51.23", races: 28, excitement: 84 },
  { distance: "2000m", avgTime: "2:04.58", races: 22, excitement: 88 },
  { distance: "2400m", avgTime: "2:28.91", races: 15, excitement: 90 }
];

export default function RacesAdvanced() {
  const [selectedView, setSelectedView] = useState<"overview" | "calendar" | "analytics" | "results">("overview");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const getStatusColor = (status: Race["status"]) => {
    switch (status) {
      case "Terminée": return "bg-green-100 text-green-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "Programmée": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = tunisianRaces.reduce((sum, race) => sum + race.analytics.revenue, 0);
  const totalAttendance = tunisianRaces.reduce((sum, race) => sum + race.analytics.attendance, 0);
  const avgCompetitiveness = tunisianRaces.reduce((sum, race) => sum + race.analytics.competitiveness, 0) / tunisianRaces.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium mb-2 inline-block">
              ← Retour à l'accueil
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🏃‍♂️ Courses Avancées
            </h1>
            <p className="text-gray-600">Gestion complète et analytics des courses hippiques</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-orange-600">{tunisianRaces.length}</div>
              <div className="text-sm text-gray-600">Courses totales</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600">{(totalRevenue / 1000).toFixed(0)}K DT</div>
              <div className="text-sm text-gray-600">Revenus</div>
            </div>
          </div>
        </div>

        {/* Navigation secondaire */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: "📊" },
              { id: "calendar", label: "Calendrier", icon: "📅" },
              { id: "analytics", label: "Analytics", icon: "📈" },
              { id: "results", label: "Résultats", icon: "🏆" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  selectedView === tab.id
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedView === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* KPIs Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                      <p className="text-2xl font-bold text-green-600">{(totalRevenue / 1000).toFixed(0)}K DT</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-green-600">
                      <span>+12.5% vs mois dernier</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Affluence</p>
                      <p className="text-2xl font-bold text-blue-600">{(totalAttendance / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👥</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-blue-600">
                      <span>+8.3% vs mois dernier</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Compétitivité</p>
                      <p className="text-2xl font-bold text-purple-600">{avgCompetitiveness.toFixed(1)}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚡</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-purple-600">
                      <span>Excellent niveau</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
                      <p className="text-2xl font-bold text-orange-600">{(tunisianRaces.reduce((sum, race) => sum + race.prize, 0) / tunisianRaces.length / 1000).toFixed(0)}K DT</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🏆</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-orange-600">
                      <span>Par course</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphiques côte à côte */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Évolution mensuelle */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Évolution Mensuelle</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRaceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="races" fill="#FF6B6B" name="Nombre de courses" />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#4ECDC4" strokeWidth={3} name="Revenus (DT)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Répartition par catégorie */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Répartition par Catégorie</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoriesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance par distance */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance par Distance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={performanceByDistance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="distance" />
                    <YAxis dataKey="excitement" />
                    <Tooltip 
                      formatter={(value, name) => [value, name === "excitement" ? "Niveau d'excitation" : name]}
                      labelFormatter={(label) => `Distance: ${label}`}
                    />
                    <Scatter dataKey="excitement" fill="#FF6B6B" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {selectedView === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Calendrier des Courses 2024</h3>
              <div className="space-y-4">
                {tunisianRaces.map((race) => (
                  <motion.div
                    key={race.id}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedRace(race)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900">{race.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                          <span>📅 {race.date}</span>
                          <span>⏰ {race.time}</span>
                          <span>📏 {race.distance}m</span>
                          <span>🏇 {race.participants} participants</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(race.status)}`}>
                          {race.status}
                        </span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{(race.prize / 1000).toFixed(0)}K DT</div>
                          <div className="text-sm text-gray-500">Prix</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedView === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar des métriques */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Analyse Radar des Courses</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={tunisianRaces.map(race => ({
                      name: race.name.split(' ').slice(0, 2).join(' '),
                      competitiveness: race.analytics.competitiveness,
                      excitement: race.analytics.excitement,
                      predictability: race.analytics.predictability,
                      attendance: (race.analytics.attendance / 100),
                      revenue: (race.analytics.revenue / 10000)
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        dataKey="competitiveness"
                        stroke="#FF6B6B"
                        fill="#FF6B6B"
                        fillOpacity={0.3}
                        name="Compétitivité"
                      />
                      <Radar
                        dataKey="excitement"
                        stroke="#4ECDC4"
                        fill="#4ECDC4"
                        fillOpacity={0.3}
                        name="Excitation"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Corrélation météo-performance */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Météorologique</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">☀️ Temps Ensoleillé</h4>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>• Vitesse moyenne: +3.2%</p>
                        <p>• Affluence: +15.8%</p>
                        <p>• Niveau d'excitation: 92/100</p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">☁️ Temps Nuageux</h4>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>• Vitesse moyenne: -1.1%</p>
                        <p>• Affluence: -5.2%</p>
                        <p>• Niveau d'excitation: 85/100</p>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">🌧️ Temps Pluvieux</h4>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>• Vitesse moyenne: -8.5%</p>
                        <p>• Affluence: -22.3%</p>
                        <p>• Niveau d'excitation: 78/100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyse comparative */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analyse Comparative</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={tunisianRaces.map(race => ({
                    name: race.name.split(' ').slice(0, 3).join(' '),
                    competitiveness: race.analytics.competitiveness,
                    excitement: race.analytics.excitement,
                    predictability: race.analytics.predictability,
                    participants: race.participants * 5 // Normalisation pour l'affichage
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="competitiveness" fill="#FF6B6B" name="Compétitivité" />
                    <Bar dataKey="excitement" fill="#4ECDC4" name="Excitation" />
                    <Bar dataKey="predictability" fill="#45B7D1" name="Prévisibilité" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {selectedView === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {tunisianRaces.filter(race => race.results).map((race) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                    <div className="text-sm text-gray-600">
                      {race.date} • {race.distance}m • {race.surface}
                    </div>
                  </div>
                  
                  {race.results && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-2 px-4">Position</th>
                            <th className="text-left py-2 px-4">Cheval</th>
                            <th className="text-left py-2 px-4">Jockey</th>
                            <th className="text-left py-2 px-4">Temps</th>
                            <th className="text-left py-2 px-4">Cote</th>
                          </tr>
                        </thead>
                        <tbody>
                          {race.results.map((result) => (
                            <tr key={result.position} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold
                                  ${result.position === 1 ? 'bg-yellow-500' : 
                                    result.position === 2 ? 'bg-gray-400' : 
                                    result.position === 3 ? 'bg-orange-400' : 'bg-gray-300'}`}>
                                  {result.position}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-medium">{result.horse}</td>
                              <td className="py-3 px-4">{result.jockey}</td>
                              <td className="py-3 px-4 font-mono">{result.time}</td>
                              <td className="py-3 px-4">{result.odds}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{race.analytics.averageSpeed.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">km/h moyen</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{race.analytics.competitiveness}%</div>
                      <div className="text-sm text-gray-600">Compétitivité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{race.analytics.excitement}%</div>
                      <div className="text-sm text-gray-600">Excitation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{race.analytics.attendance.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Spectateurs</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal détail course */}
        <AnimatePresence>
          {selectedRace && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedRace(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedRace.name}</h3>
                  <button
                    onClick={() => setSelectedRace(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date & Heure</p>
                      <p className="font-medium">{selectedRace.date} à {selectedRace.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-medium">{selectedRace.distance}m sur {selectedRace.surface}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Catégorie</p>
                      <p className="font-medium">{selectedRace.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix</p>
                      <p className="font-medium text-green-600">{selectedRace.prize.toLocaleString()} DT</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-2">Analytics de Performance</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Compétitivité</p>
                        <p className="text-lg font-bold text-purple-600">{selectedRace.analytics.competitiveness}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Excitation</p>
                        <p className="text-lg font-bold text-blue-600">{selectedRace.analytics.excitement}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prévisibilité</p>
                        <p className="text-lg font-bold text-orange-600">{selectedRace.analytics.predictability}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
