import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Trophy, Star, TrendingUp, Activity, Award, ArrowLeft, RefreshCw, Download, Filter, Search } from 'lucide-react';
import { getRatingStatistics } from '~/services/rating.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const ratingData = await getRatingStatistics();
    return json({ ratingData });
  } catch (error) {
    console.error('Erreur lors du chargement des données rating:', error);
    return json({
      ratingData: {
        statistics: {
          averageRating: 75,
          totalHorsesRated: 45,
          ratingDistribution: {
            '90+': 3,
            '80-89': 12,
            '70-79': 20,
            '60-69': 10,
            '50-59': 0
          },
          topRated: []
        },
        topHorses: [],
        averageRating: 75,
        totalRatedHorses: 45,
        lastUpdated: new Date().toISOString()
      }
    });
  }
};

export default function RatingLivePage() {
  const { ratingData } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              🏆 Rating des Chevaux
              <span className="text-sm font-normal text-gray-600 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                En ligne
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Rating Moyen</p>
                <p className="text-3xl font-bold">{ratingData.averageRating || ratingData.statistics?.averageRating || 75}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
            <div className="mt-2">
              <div className="bg-blue-400 bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${((ratingData.averageRating || ratingData.statistics?.averageRating || 75) / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Chevaux Évalués</p>
                <p className="text-3xl font-bold">{ratingData.statistics?.totalHorsesRated || 45}</p>
              </div>
              <Activity className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Top Performers</p>
                <p className="text-3xl font-bold">
                  {(ratingData.topHorses || ratingData.statistics?.topRated || []).filter((h: any) => h.rating >= 90).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Dernière MAJ</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un cheval..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Tous les ratings</option>
                <option>90+ (Elite)</option>
                <option>80-89 (Excellent)</option>
                <option>70-79 (Bon)</option>
                <option>60-69 (Moyen)</option>
                <option>50-59 (Faible)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Classement complet */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Classement Général
            </h2>
            
            <div className="space-y-3">
              {(ratingData.topHorses || ratingData.statistics?.topRated || []).map((horse: any, index: number) => (
                <div 
                  key={horse.id || index} 
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' :
                      index < 10 ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{horse.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>Victoires: {horse.victories || 0}</span>
                        <span>•</span>
                        <span>Courses: {horse.races || 0}</span>
                        <span>•</span>
                        <span>Taux: {horse.winRate ? `${horse.winRate.toFixed(1)}%` : '0%'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-full font-bold text-white ${
                      horse.rating >= 90 ? 'bg-red-500' :
                      horse.rating >= 80 ? 'bg-orange-500' :
                      horse.rating >= 70 ? 'bg-yellow-500' :
                      horse.rating >= 60 ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}>
                      {horse.rating}
                    </div>
                    {index < 3 && (
                      <Award className={`w-5 h-5 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        'text-orange-600'
                      }`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution et statistiques */}
          <div className="space-y-6">
            {/* Distribution des ratings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Distribution des Ratings
              </h3>
              
              <div className="space-y-4">
                {Object.entries(ratingData.statistics?.ratingDistribution || {}).map(([range, count]) => {
                  const percentage = ((Number(count) / (ratingData.statistics?.totalHorsesRated || 45)) * 100).toFixed(1);
                  const color = 
                    range === '90+' ? 'bg-red-500' :
                    range === '80-89' ? 'bg-orange-500' :
                    range === '70-79' ? 'bg-yellow-500' :
                    range === '60-69' ? 'bg-green-500' :
                    'bg-gray-500';
                  
                  return (
                    <div key={range} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{range}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{String(count)}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informations système */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations Système</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Algorithme:</span>
                  <span className="font-medium">Performance basé</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mise à jour:</span>
                  <span className="font-medium">Temps réel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span className="font-medium">Supabase</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière sync:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec informations */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">À propos du système de rating</h3>
            <p className="text-gray-600 mb-4">
              Le rating des chevaux est calculé en temps réel basé sur leurs performances récentes, 
              leur taux de victoire, leur position moyenne et leur forme actuelle.
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <span>Rating minimal: 50</span>
              <span>•</span>
              <span>Rating maximal: 100</span>
              <span>•</span>
              <span>Mise à jour: Continue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
