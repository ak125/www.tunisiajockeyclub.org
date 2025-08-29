import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  Trophy, 
  TrendingUp, 
  Search,
  Plus,
  Star,
  Calendar,
  Filter,
  SortAsc,
  Calculator,
  BarChart3,
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { getRatingStatistics, getHorsesPerformanceData } from "../services/rating.server";

export async function loader() {
  try {
    const [horses, ratingData] = await Promise.all([
      getHorsesPerformanceData(),
      getRatingStatistics()
    ]);

    return json({ 
      horses,
      stats: ratingData
    });
  } catch (error) {
    console.error('Erreur dans le loader rating:', error);
    
    // Fallback data
    return json({
      horses: [
        { id: '1', name: 'OUARABI AL WALJD', rating: 92, victories: 12, races: 18, winRate: 66.7 },
        { id: '2', name: 'EMIR DE TUNISIE', rating: 90, victories: 15, races: 20, winRate: 75.0 },
        { id: '3', name: 'ROI DE CARTHAGE', rating: 88, victories: 10, races: 16, winRate: 62.5 },
        { id: '4', name: 'SULTAN DE KAIROUAN', rating: 86, victories: 11, races: 17, winRate: 64.7 },
        { id: '5', name: 'SALAM TUNIS', rating: 85, victories: 9, races: 15, winRate: 60.0 }
      ],
      stats: {
        statistics: {
          averageRating: 80,
          totalHorsesRated: 45,
          ratingDistribution: {
            '90+': 3,
            '80-89': 12,
            '70-79': 20,
            '60-69': 10,
            '50-59': 0
          },
          topRated: []
        }
      }
    });
  }
}

export default function RatingIndex() {
  const { horses, stats } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "name" | "winRate">("rating");
  const [filterCategory, setFilterCategory] = useState<"all" | "champions" | "good" | "average">("all");

  // Filtrer les chevaux
  const filteredHorses = horses.filter((horse: any) => {
    const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterCategory === "all" ||
      (filterCategory === "champions" && horse.rating >= 85) ||
      (filterCategory === "good" && horse.rating >= 70 && horse.rating < 85) ||
      (filterCategory === "average" && horse.rating < 70);
    return matchesSearch && matchesFilter;
  });

  // Trier les chevaux
  const sortedHorses = [...filteredHorses].sort((a: any, b: any) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "winRate":
        return b.winRate - a.winRate;
      default:
        return b.rating - a.rating;
    }
  });

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 90) return "bg-purple-100 text-purple-800 border-purple-200";
    if (rating >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (rating >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Système de Rating TJC
              </h1>
              <p className="text-gray-600 mt-1">
                Gestion complète des ratings selon la méthode officielle tunisienne
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/rating/calculateur"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Calculer Rating
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Chevaux</p>
                <p className="text-2xl font-bold text-blue-600">{stats.statistics.totalHorsesRated}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Moyen</p>
                <p className="text-2xl font-bold text-green-600">{stats.statistics.averageRating}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Champions (90+)</p>
                <p className="text-2xl font-bold text-purple-600">{stats.statistics.ratingDistribution['90+']}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dernière MAJ</p>
                <p className="text-sm font-bold text-orange-600">Aujourd'hui</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un cheval..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="champions">Champions (85+)</option>
                  <option value="good">Bon niveau (70-84)</option>
                  <option value="average">Moyen (&lt;70)</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Par Rating</option>
                  <option value="name">Par Nom</option>
                  <option value="winRate">Par Taux de Réussite</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Horses Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des Chevaux ({sortedHorses.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cheval
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Victoires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux Réussite
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedHorses.map((horse: any) => (
                  <tr key={horse.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {horse.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRatingBadgeColor(horse.rating)}`}>
                        {horse.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      {horse.victories}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {horse.races}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {horse.winRate.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/rating/${horse.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/rating/calculateur"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <div className="flex items-center">
              <Calculator className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Calculer un Rating</h3>
                <p className="text-blue-100 text-sm">Outil de calcul automatique</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/rating/reglementation"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 hover:from-green-600 hover:to-green-700 transition-all"
          >
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Réglementation</h3>
                <p className="text-green-100 text-sm">Guide officiel complet</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 opacity-75 cursor-not-allowed">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Statistiques</h3>
                <p className="text-purple-100 text-sm">Bientôt disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
