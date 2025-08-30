import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  Trophy, 
  TrendingUp, 
  Star,
  Calendar,
  BarChart3,
  Search,
  Filter,
  Medal,
  Crown
} from "lucide-react";
import { getRatingStatistics, getHorsesPerformanceData } from "../services/rating.server";

export async function loader() {
  try {
    const [horses, ratingData] = await Promise.all([
      getHorsesPerformanceData(),
      getRatingStatistics()
    ]);

    return json({ 
      horses: horses.slice(0, 10), // Top 10 pour le public
      stats: ratingData
    });
  } catch (error) {
    console.error('Erreur rating public:', error);
    
    return json({
      horses: [
        { id: '1', name: 'OUARABI AL WALJD', rating: 92, victories: 12, races: 18, winRate: 66.7, lastRace: '2025-08-25' },
        { id: '2', name: 'EMIR DE TUNISIE', rating: 90, victories: 15, races: 20, winRate: 75.0, lastRace: '2025-08-20' },
        { id: '3', name: 'ROI DE CARTHAGE', rating: 88, victories: 10, races: 16, winRate: 62.5, lastRace: '2025-08-18' },
        { id: '4', name: 'SULTAN DE KAIROUAN', rating: 86, victories: 11, races: 17, winRate: 64.7, lastRace: '2025-08-15' },
        { id: '5', name: 'SALAM TUNIS', rating: 85, victories: 9, races: 15, winRate: 60.0, lastRace: '2025-08-12' }
      ],
      stats: {
        statistics: {
          averageRating: 80,
          totalHorsesRated: 45,
          ratingDistribution: { '90+': 3, '80-89': 12, '70-79': 20, '60-69': 10 }
        }
      }
    });
  }
}

export default function PublicRatings() {
  const { horses, stats } = useLoaderData<typeof loader>();

  const ratingCategories = [
    { range: '90+', label: 'Élite', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Crown },
    { range: '80-89', label: 'Excellent', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Medal },
    { range: '70-79', label: 'Très Bon', color: 'bg-green-100 text-green-800 border-green-200', icon: Trophy },
    { range: '60-69', label: 'Bon', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Star }
  ];

  const getRatingBadge = (rating: number) => {
    if (rating >= 90) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Élite', icon: Crown };
    if (rating >= 80) return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Excellent', icon: Medal };
    if (rating >= 70) return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Très Bon', icon: Trophy };
    return { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Bon', icon: Star };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Classement Rating IFHA
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Système officiel de classement des chevaux de course selon les standards 
          de la Fédération Internationale des Autorités Hippiques
        </p>
      </div>

      {/* Rating Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {ratingCategories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${category.color}`}>
                <category.icon className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${category.color}`}>
                {category.range}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{category.label}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats.statistics?.ratingDistribution?.[category.range] || 0}
            </p>
            <p className="text-sm text-gray-600">chevaux</p>
          </div>
        ))}
      </div>

      {/* Top Horses */}
      <div className="bg-white rounded-lg shadow-md border mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Top 10 des Chevaux
            </h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Search className="w-4 h-4" />
                Rechercher
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cheval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performances
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de Réussite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Course
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {horses.map((horse, index) => {
                const badge = getRatingBadge(horse.rating);
                return (
                  <tr key={horse.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-lg font-medium text-gray-900">{horse.name}</div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                            <badge.icon className="w-3 h-3" />
                            {badge.label}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl font-bold text-gray-900">{horse.rating}</div>
                      <div className="text-sm text-gray-500">pts</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold text-green-600">{horse.victories}</span> victoires
                      </div>
                      <div className="text-sm text-gray-500">
                        sur {horse.races} courses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className={`text-lg font-semibold ${
                            horse.winRate >= 70 ? 'text-green-600' : 
                            horse.winRate >= 50 ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {horse.winRate}%
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {horse.lastRace ? new Date(horse.lastRace).toLocaleDateString('fr-FR') : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <BarChart3 className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              À propos du Rating IFHA
            </h3>
            <p className="text-blue-800 mb-4">
              Le système de rating IFHA (International Federation of Horseracing Authorities) est le standard 
              international pour évaluer les performances des chevaux de course. Il prend en compte la qualité 
              des adversaires, les conditions de course, et la performance relative.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/public/rating-guide"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Guide Complet
              </Link>
              <Link
                to="/public/rating-history"
                className="border border-blue-300 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Historique des Ratings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
