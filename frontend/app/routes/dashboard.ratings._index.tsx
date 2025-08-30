import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { 
  TrendingUp, Star, BarChart3, Activity, Calculator,
  Zap, Target, Award, RefreshCw
} from 'lucide-react';
import { requirePermission, Permission } from '../utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Vérifier les permissions pour accéder aux ratings IFHA
  await requirePermission(request, Permission.RATING);

  try {
    // Récupérer les données de rating depuis le backend
    const ratingsResponse = await fetch('http://localhost:3000/api/rating/ifha/list');
    const statsResponse = await fetch('http://localhost:3000/api/rating/ifha/statistics');

    const ratings = ratingsResponse.ok ? await ratingsResponse.json() : { horses: [] };
    const stats = statsResponse.ok ? await statsResponse.json() : {};

    return json({
      ratings: ratings.horses || [],
      ratingStats: stats,
      recentCalculations: [], // À implémenter
    });
  } catch (error) {
    console.error('Erreur chargement ratings:', error);
    return json({
      ratings: [],
      ratingStats: {},
      recentCalculations: [],
    });
  }
}

export default function DashboardRatings() {
  const { ratings, ratingStats } = useLoaderData<typeof loader>();
  const { permissions } = useOutletContext<{
    permissions: any;
  }>();

  // Données simulées pour le développement
  const sampleRatings = ratings.length > 0 ? ratings : [
    {
      id: 1,
      horseName: 'Thunder Strike',
      currentRating: 95,
      previousRating: 92,
      change: +3,
      lastUpdated: '2025-08-25',
      races: 12,
      consistency: 'High',
      trend: 'up'
    },
    {
      id: 2,
      horseName: 'Desert Rose', 
      currentRating: 88,
      previousRating: 90,
      change: -2,
      lastUpdated: '2025-08-22',
      races: 8,
      consistency: 'Medium',
      trend: 'down'
    },
    {
      id: 3,
      horseName: 'Sahara Wind',
      currentRating: 92,
      previousRating: 89,
      change: +3,
      lastUpdated: '2025-08-20',
      races: 15,
      consistency: 'High',
      trend: 'up'
    },
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-purple-600 bg-purple-100';
    if (rating >= 80) return 'text-blue-600 bg-blue-100';
    if (rating >= 70) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingUp;
      default: return Activity;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="h-6 w-6 text-yellow-600 mr-2" />
            Système de Rating IFHA
          </h1>
          <p className="text-gray-600">
            Calcul et suivi des ratings internationaux des chevaux
          </p>
        </div>
        
        {permissions.canManageRatings && (
          <div className="flex space-x-3">
            <Link
              to="/dashboard/ratings/calculate"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculer ratings</span>
            </Link>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Recalculer tout</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chevaux ratés</p>
              <p className="text-xl font-bold text-blue-600">{sampleRatings.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rating moyen</p>
              <p className="text-xl font-bold text-purple-600">
                {Math.round(sampleRatings.reduce((sum, r) => sum + r.currentRating, 0) / sampleRatings.length)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En progression</p>
              <p className="text-xl font-bold text-green-600">
                {sampleRatings.filter(r => r.change > 0).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top niveau (90+)</p>
              <p className="text-xl font-bold text-yellow-600">
                {sampleRatings.filter(r => r.currentRating >= 90).length}
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      {permissions.canManageRatings && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              to="/dashboard/ratings/calculate"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
            >
              <Calculator className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-gray-900">Calculateur</p>
              <p className="text-sm text-gray-500">Rating individuel</p>
            </Link>
            
            <Link
              to="/dashboard/ratings/bulk-calculate"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center"
            >
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium text-gray-900">Calcul en lot</p>
              <p className="text-sm text-gray-500">Tous les chevaux</p>
            </Link>
            
            <Link
              to="/dashboard/ratings/convert"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center"
            >
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-gray-900">Convertir ratings</p>
              <p className="text-sm text-gray-500">Entre échelles</p>
            </Link>
            
            <Link
              to="/dashboard/ratings/performance"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors text-center"
            >
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="font-medium text-gray-900">Performance</p>
              <p className="text-sm text-gray-500">Métriques système</p>
            </Link>
            
            <Link
              to="/dashboard/ratings/reglementation"
              className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors text-center"
            >
              <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="font-medium text-gray-900">Réglementation</p>
              <p className="text-sm text-gray-500">Standards IFHA</p>
            </Link>
          </div>
        </div>
      )}

      {/* Tableau des ratings */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Rankings actuels</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Rang</th>
                <th className="text-left p-4 font-medium text-gray-900">Cheval</th>
                <th className="text-left p-4 font-medium text-gray-900">Rating actuel</th>
                <th className="text-left p-4 font-medium text-gray-900">Évolution</th>
                <th className="text-left p-4 font-medium text-gray-900">Courses</th>
                <th className="text-left p-4 font-medium text-gray-900">Consistance</th>
                <th className="text-left p-4 font-medium text-gray-900">Dernière MAJ</th>
                <th className="text-left p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleRatings
                .sort((a, b) => b.currentRating - a.currentRating)
                .map((horse, index) => {
                  const TrendIcon = getTrendIcon(horse.trend);
                  return (
                    <tr key={horse.id} className="hover:bg-gray-50">
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
                        <div className="font-medium text-gray-900">{horse.horseName}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRatingColor(horse.currentRating)}`}>
                          {horse.currentRating}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <TrendIcon className={`h-4 w-4 mr-1 ${
                            horse.trend === 'up' ? 'text-green-600' : 
                            horse.trend === 'down' ? 'text-red-600 rotate-180' : 
                            'text-gray-400'
                          }`} />
                          <span className={`font-medium ${getTrendColor(horse.change)}`}>
                            {horse.change > 0 ? '+' : ''}{horse.change}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900">{horse.races}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          horse.consistency === 'High' ? 'bg-green-100 text-green-800' :
                          horse.consistency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {horse.consistency}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(horse.lastUpdated).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/dashboard/ratings/horse/${horse.id}`}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Voir détails"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Link>
                          {permissions.canManageRatings && (
                            <button
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                              title="Recalculer"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution des ratings */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
          Distribution des ratings
        </h3>
        
        <div className="space-y-3">
          {[
            { range: '90+', label: 'Elite', count: sampleRatings.filter(r => r.currentRating >= 90).length, color: 'bg-purple-500' },
            { range: '80-89', label: 'Très bon', count: sampleRatings.filter(r => r.currentRating >= 80 && r.currentRating < 90).length, color: 'bg-blue-500' },
            { range: '70-79', label: 'Bon', count: sampleRatings.filter(r => r.currentRating >= 70 && r.currentRating < 80).length, color: 'bg-green-500' },
            { range: '60-69', label: 'Moyen', count: sampleRatings.filter(r => r.currentRating >= 60 && r.currentRating < 70).length, color: 'bg-yellow-500' },
            { range: '<60', label: 'Débutant', count: sampleRatings.filter(r => r.currentRating < 60).length, color: 'bg-gray-500' }
          ].map((category) => {
            const percentage = sampleRatings.length > 0 ? (category.count / sampleRatings.length) * 100 : 0;
            return (
              <div key={category.range} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-20 text-sm font-medium text-gray-900">{category.range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-600">{category.count}</div>
                  <div className="w-12 text-right text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
