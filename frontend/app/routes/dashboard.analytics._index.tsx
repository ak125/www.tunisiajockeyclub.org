import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { 
  BarChart3, TrendingUp, Activity, Users, Calendar,
  Target, Award, Clock, DollarSign, Eye, ArrowUp, ArrowDown
} from 'lucide-react';
import { useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Récupérer les données analytics depuis le backend
    const analyticsResponse = await fetch('http://localhost:3000/api/analytics/dashboard');
    const performanceResponse = await fetch('http://localhost:3000/api/analytics/performance');

    const analytics = analyticsResponse.ok ? await analyticsResponse.json() : {};
    const performance = performanceResponse.ok ? await performanceResponse.json() : {};

    return json({
      analytics,
      performance,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur chargement analytics:', error);
    return json({
      analytics: {},
      performance: {},
      generatedAt: new Date().toISOString(),
    });
  }
}

export default function DashboardAnalytics() {
  const { analytics, performance } = useLoaderData<typeof loader>();
  const { permissions } = useOutletContext<{
    permissions: any;
  }>();

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('bar');

  // Données simulées pour le développement
  const sampleMetrics = {
    totalRaces: 45,
    totalParticipants: 1247,
    avgParticipantsPerRace: 28,
    revenue: 125000,
    topPerformers: 12,
    growthRate: 8.5,
    satisfactionScore: 4.2,
    systemUptime: 99.7
  };

  const monthlyData = [
    { month: 'Jan', races: 12, participants: 340, revenue: 28000 },
    { month: 'Fév', races: 15, participants: 420, revenue: 35000 },
    { month: 'Mar', races: 18, participants: 487, revenue: 41000 },
    { month: 'Avr', races: 14, participants: 385, revenue: 32000 },
    { month: 'Mai', races: 20, participants: 560, revenue: 47000 },
    { month: 'Jun', races: 16, participants: 448, revenue: 38000 },
  ];

  const categoryBreakdown = [
    { name: 'Galop', count: 28, percentage: 62 },
    { name: 'Trot', count: 12, percentage: 27 },
    { name: 'Obstacle', count: 5, percentage: 11 }
  ];

  const topJockeys = [
    { name: 'Ahmed Ben Ali', wins: 12, winRate: 35.3, earnings: 18500 },
    { name: 'Fatima Khaldi', wins: 10, winRate: 31.2, earnings: 16200 },
    { name: 'Mohamed Trabelsi', wins: 8, winRate: 28.6, earnings: 14100 },
    { name: 'Leila Mansouri', wins: 7, winRate: 25.9, earnings: 12800 },
  ];

  const recentTrends = [
    { metric: 'Participation', value: '+12%', trend: 'up', color: 'text-green-600' },
    { metric: 'Revenus', value: '+8.5%', trend: 'up', color: 'text-green-600' },
    { metric: 'Courses annulées', value: '-3%', trend: 'down', color: 'text-green-600' },
    { metric: 'Temps de réponse', value: '+2ms', trend: 'up', color: 'text-red-600' },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? ArrowUp : ArrowDown;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
            Analyses et Statistiques
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble des performances et tendances
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="quarter">3 derniers mois</option>
            <option value="year">12 derniers mois</option>
          </select>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Rapport détaillé</span>
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-blue-600">{sampleMetrics.totalRaces}</p>
              <p className="text-xs text-green-600">+8% vs mois dernier</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-green-600">{sampleMetrics.totalParticipants.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% vs mois dernier</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-purple-600">{(sampleMetrics.revenue / 1000).toFixed(0)}K TND</p>
              <p className="text-xs text-green-600">+8.5% vs mois dernier</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de réussite</p>
              <p className="text-2xl font-bold text-orange-600">{sampleMetrics.systemUptime}%</p>
              <p className="text-xs text-green-600">+0.2% vs mois dernier</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tendances récentes */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
          Tendances récentes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentTrends.map((trend, index) => {
            const TrendIcon = getTrendIcon(trend.trend);
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">{trend.metric}</p>
                  <p className={`font-bold ${trend.color}`}>{trend.value}</p>
                </div>
                <TrendIcon className={`h-5 w-5 ${trend.color}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des performances mensuelles */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance mensuelle</h3>
            <div className="flex space-x-2">
              {(['bar', 'line'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 text-sm rounded ${
                    chartType === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type === 'bar' ? 'Barres' : 'Ligne'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {monthlyData.map((data, index) => {
              const maxValue = Math.max(...monthlyData.map(d => d.participants));
              const percentage = (data.participants / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">{data.participants} participants</span>
                      <span className="text-sm text-gray-600">{data.races} courses</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">
                    {(data.revenue / 1000).toFixed(0)}K TND
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h3>
          
          <div className="space-y-4">
            {categoryBreakdown.map((category, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500'];
              const lightColors = ['bg-blue-100', 'bg-green-100', 'bg-orange-100'];
              const textColors = ['text-blue-700', 'text-green-700', 'text-orange-700'];
              
              return (
                <div key={index} className={`p-4 rounded-lg ${lightColors[index]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${textColors[index]}`}>{category.name}</span>
                    <span className={`text-sm ${textColors[index]}`}>{category.percentage}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white rounded-full h-2">
                      <div 
                        className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{category.count} courses</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="h-5 w-5 text-yellow-600 mr-2" />
            Top Jockeys du mois
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Rang</th>
                <th className="text-left p-4 font-medium text-gray-900">Jockey</th>
                <th className="text-left p-4 font-medium text-gray-900">Victoires</th>
                <th className="text-left p-4 font-medium text-gray-900">Taux de réussite</th>
                <th className="text-left p-4 font-medium text-gray-900">Gains</th>
                <th className="text-left p-4 font-medium text-gray-900">Tendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topJockeys.map((jockey, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{jockey.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-blue-600">{jockey.wins}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${jockey.winRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{jockey.winRate}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-green-600">
                      {(jockey.earnings / 1000).toFixed(1)}K TND
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="ml-1 text-sm text-green-600">+{(Math.random() * 10).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activité système */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Activité système</h4>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium text-green-600">{sampleMetrics.systemUptime}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Temps de réponse</span>
              <span className="font-medium text-blue-600">124ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Erreurs</span>
              <span className="font-medium text-red-600">0.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Engagement utilisateurs</h4>
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sessions actives</span>
              <span className="font-medium text-purple-600">1,247</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Durée moyenne</span>
              <span className="font-medium text-blue-600">12m 34s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taux de retour</span>
              <span className="font-medium text-green-600">68%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Satisfaction</h4>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Note moyenne</span>
              <span className="font-medium text-orange-600">{sampleMetrics.satisfactionScore}/5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Recommandations</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plaintes</span>
              <span className="font-medium text-red-600">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
