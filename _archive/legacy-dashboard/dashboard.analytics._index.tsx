import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Trophy, Users, Calendar, DollarSign, Target } from 'lucide-react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Mock data pour les analytics - en production, ceci viendrait de votre base de données
  const racesByMonth = [
    { month: 'Jan', races: 12, participants: 156, revenue: 25000 },
    { month: 'Fév', races: 15, participants: 189, revenue: 32000 },
    { month: 'Mar', races: 18, participants: 234, revenue: 38500 },
    { month: 'Avr', races: 14, participants: 178, revenue: 28900 },
    { month: 'Mai', races: 20, participants: 267, revenue: 45200 },
    { month: 'Jun', races: 22, participants: 298, revenue: 52800 },
  ];

  const horsePerformance = [
    { name: 'Thunder Bolt', victories: 8, participations: 12, winRate: 67 },
    { name: 'Desert Wind', victories: 6, participations: 10, winRate: 60 },
    { name: 'Golden Star', victories: 5, participations: 9, winRate: 56 },
    { name: 'Lightning Fast', victories: 7, participations: 14, winRate: 50 },
    { name: 'Storm Rider', victories: 4, participations: 8, winRate: 50 },
  ];

  const jockeyStats = [
    { name: 'Ahmed Ben Ali', value: 28, color: '#3B82F6' },
    { name: 'Mohamed Khalil', value: 24, color: '#10B981' },
    { name: 'Youssef Mansour', value: 19, color: '#F59E0B' },
    { name: 'Karim Saidi', value: 15, color: '#EF4444' },
    { name: 'Autres', value: 14, color: '#8B5CF6' },
  ];

  const revenueGrowth = [
    { period: 'Q1 2024', revenue: 95000, expenses: 62000, profit: 33000 },
    { period: 'Q2 2024', revenue: 128000, expenses: 74000, profit: 54000 },
    { period: 'Q3 2024', revenue: 156000, expenses: 89000, profit: 67000 },
    { period: 'Q4 2024', revenue: 142000, expenses: 81000, profit: 61000 },
  ];

  return json({
    racesByMonth,
    horsePerformance,
    jockeyStats,
    revenueGrowth,
    kpis: {
      totalRaces: 124,
      totalParticipants: 1847,
      averageAttendance: 342,
      totalRevenue: 285400,
      growthRate: 12.5,
      satisfactionRate: 94
    }
  });
};

export default function AnalyticsPage() {
  const { racesByMonth, horsePerformance, jockeyStats, revenueGrowth, kpis } = useLoaderData<typeof loader>();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics & Rapports</h1>
          <p className="text-gray-600 mt-2">Tableau de bord analytique du Tunisia Jockey Club</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Derniers 6 mois</option>
            <option>Cette année</option>
            <option>Tout</option>
          </select>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalRaces}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalParticipants.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Audience Moy.</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.averageAttendance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus Total</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalRevenue.toLocaleString()} TND</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Croissance</p>
              <p className="text-2xl font-bold text-gray-900">+{kpis.growthRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.satisfactionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses par mois */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏁 Évolution des Courses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={racesByMonth}>
              <defs>
                <linearGradient id="colorRaces" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="races" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorRaces)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance des chevaux */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🐎 Top Chevaux - Taux de Victoire</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={horsePerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="winRate" fill="#10B981">
                {horsePerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des victoires par jockey */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Victoires par Jockey</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jockeyStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, value}) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jockeyStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Évolution des revenus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Revenus et Profits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} TND`, '']} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">📈 Résumé Détaillé</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Croissance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {racesByMonth.map((month, index) => (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month} 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.races} courses
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.participants} participants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.revenue.toLocaleString()} TND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      index > 0 && month.revenue > racesByMonth[index - 1].revenue
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {index > 0 
                        ? `${((month.revenue - racesByMonth[index - 1].revenue) / racesByMonth[index - 1].revenue * 100).toFixed(1)}%`
                        : '--'
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
