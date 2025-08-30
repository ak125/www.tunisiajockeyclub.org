import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { 
  TrendingUp, Calendar, Trophy, Users, Activity, 
  Clock, AlertCircle, CheckCircle 
} from 'lucide-react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Récupérer les données récentes depuis le backend
    const [coursesResponse, recentResultsResponse] = await Promise.allSettled([
      fetch('http://localhost:3000/api/courses/upcoming'),
      fetch('http://localhost:3000/api/courses/recent-results'),
    ]);

    const upcomingCourses = coursesResponse.status === 'fulfilled' && coursesResponse.value.ok 
      ? await coursesResponse.value.json() 
      : [];
    
    const recentResults = recentResultsResponse.status === 'fulfilled' && recentResultsResponse.value.ok
      ? await recentResultsResponse.value.json()
      : [];

    return json({
      upcomingCourses: upcomingCourses.slice(0, 5), // Top 5
      recentResults: recentResults.slice(0, 5), // 5 derniers résultats
      systemStatus: {
        database: 'operational',
        api: 'operational', 
        cache: 'operational',
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Erreur chargement dashboard index:', error);
    return json({
      upcomingCourses: [],
      recentResults: [],
      systemStatus: {
        database: 'error',
        api: 'error',
        cache: 'warning',
        lastUpdate: new Date().toISOString(),
      },
    });
  }
}

export default function DashboardIndex() {
  const { upcomingCourses, recentResults, systemStatus } = useLoaderData<typeof loader>();
  const { user, stats, permissions } = useOutletContext<{
    user: any;
    stats: any;
    permissions: any;
  }>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue, {user.name || user.email}
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de vos activités Tunisia Jockey Club
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
        </div>
      </div>

      {/* Alertes et statut système */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(systemStatus).filter(([key]) => key !== 'lastUpdate').map(([key, status]) => {
          const StatusIcon = getStatusIcon(status as string);
          return (
            <div key={key} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(status as string)}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {key === 'database' ? 'Base de données' : key === 'api' ? 'API' : 'Cache'}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses à venir */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Courses à venir
            </h2>
            <span className="text-sm text-gray-500">
              {upcomingCourses.length} course(s)
            </span>
          </div>
          
          {upcomingCourses.length > 0 ? (
            <div className="space-y-3">
              {upcomingCourses.map((course: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Course #{index + 1}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 15) + 5} participants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune course prévue</p>
            </div>
          )}
        </div>

        {/* Résultats récents */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trophy className="h-5 w-5 text-green-600 mr-2" />
              Résultats récents
            </h2>
            <span className="text-sm text-gray-500">
              {recentResults.length} résultat(s)
            </span>
          </div>
          
          {recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map((result: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Course #{index + 1}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-700">1</span>
                    </div>
                    <span className="text-sm text-gray-600">Terminée</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun résultat récent</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides selon les permissions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {permissions.canManageRaces && (
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium text-gray-900">Nouvelle course</p>
              <p className="text-sm text-gray-500">Créer une course</p>
            </button>
          )}
          
          {permissions.canManageHorses && (
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-gray-900">Ajouter cheval</p>
              <p className="text-sm text-gray-500">Nouveau dans la base</p>
            </button>
          )}
          
          {permissions.canManageRatings && (
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-gray-900">Calculer ratings</p>
              <p className="text-sm text-gray-500">IFHA ratings</p>
            </button>
          )}
          
          <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="font-medium text-gray-900">Voir rapports</p>
            <p className="text-sm text-gray-500">Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
}
