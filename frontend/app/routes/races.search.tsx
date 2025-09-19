import { json } from "@remix-run/node";
import { useLoaderData, Form, useSearchParams, Link } from "@remix-run/react";
import { Search, Filter, Calendar, MapPin, Trophy, Users, Clock, ArrowRight, X } from "lucide-react";
import { useState } from "react";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  // Paramètres de recherche
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const dateFrom = searchParams.get('from') || '';
  const dateTo = searchParams.get('to') || '';
  
  try {
    // Récupérer toutes les courses depuis l'API
    const response = await fetch('http://localhost:3000/api/courses');
    const data = response.ok ? await response.json() : { courses: [] };
    
    let filteredRaces = data.courses || [];
    
    // Filtrer par recherche textuelle
    if (query) {
      filteredRaces = filteredRaces.filter((race: any) => 
        race.name.toLowerCase().includes(query.toLowerCase()) ||
        race.venue.toLowerCase().includes(query.toLowerCase()) ||
        race.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filtrer par catégorie
    if (category) {
      filteredRaces = filteredRaces.filter((race: any) => race.category === category);
    }
    
    // Filtrer par statut
    if (status) {
      filteredRaces = filteredRaces.filter((race: any) => race.status === status);
    }
    
    // Filtrer par date
    if (dateFrom || dateTo) {
      filteredRaces = filteredRaces.filter((race: any) => {
        const raceDate = new Date(race.date);
        const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
        const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
        return raceDate >= fromDate && raceDate <= toDate;
      });
    }
    
    // Extraire les catégories et statuts uniques pour les filtres
    const categories = [...new Set(data.courses?.map((race: any) => race.category).filter(Boolean))];
    const statuses = [...new Set(data.courses?.map((race: any) => race.status).filter(Boolean))];
    
    return json({
      courses: filteredRaces,
      categories,
      statuses,
      searchParams: {
        query,
        category,
        status,
        dateFrom,
        dateTo
      }
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return json({
      courses: [],
      categories: [],
      statuses: [],
      searchParams: { query: '', category: '', status: '', dateFrom: '', dateTo: '' }
    });
  }
}

export default function SearchCoursesPage() {
  const { courses, categories, statuses, searchParams } = useLoaderData<typeof loader>();
  const [searchParamsState] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finished': return 'bg-green-100 text-green-800 border-green-200';
      case 'running': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Groupe II': return 'bg-orange-100 text-orange-800 border-orange-200'; 
      case 'Groupe III': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Listed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pur Sang Arabe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    const url = new URL(window.location.href);
    url.search = '';
    window.location.href = url.toString();
  };

  const hasActiveFilters = searchParams.query || searchParams.category || searchParams.status || 
                          searchParams.dateFrom || searchParams.dateTo;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🏇</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Tunisia Jockey Club</h1>
                  <p className="text-sm text-gray-600">Recherche Avancée</p>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Accueil</Link>
              <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium">Courses</Link>
              <Link to="/courses/search" className="text-blue-600 font-medium">Recherche</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre et intro */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Recherche Avancée de Courses
          </h2>
          <p className="text-xl text-gray-600">
            Trouvez exactement les courses qui vous intéressent
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <Form method="get" className="space-y-4">
            {/* Recherche principale */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchParams.query}
                    placeholder="Rechercher par nom de course ou hippodrome..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres {hasActiveFilters && <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">!</span>}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </button>
              </div>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      defaultValue={searchParams.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      name="status"
                      defaultValue={searchParams.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="scheduled">Programmée</option>
                      <option value="running">En cours</option>
                      <option value="finished">Terminée</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      name="from"
                      defaultValue={searchParams.dateFrom}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      name="to"
                      defaultValue={searchParams.dateTo}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Bouton effacer filtres */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Effacer tous les filtres
                    </button>
                  </div>
                )}
              </div>
            )}
          </Form>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {courses.length} course{courses.length !== 1 ? 's' : ''} trouvée{courses.length !== 1 ? 's' : ''}
            </h3>
            {hasActiveFilters && (
              <div className="text-sm text-gray-600">
                Filtres actifs
              </div>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Aucune course trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou effacez les filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((race: any) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(race.category || '')}`}>
                      {race.category || 'Catégorie'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(race.status)}`}>
                      {race.status === 'finished' ? 'TERMINÉE' : 
                       race.status === 'running' ? 'EN COURS' : 'PROGRAMMÉE'}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {race.name}
                  </h4>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{new Date(race.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{race.racecourse?.name || 'Hippodrome'}</span>
                    </div>
                    {race.maxRunners && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Max {race.maxRunners} participants</span>
                      </div>
                    )}
                  </div>

                  <Link 
                    to={`/courses/${race.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium group"
                  >
                    {race.status === 'finished' ? (
                      <>
                        <Trophy className="inline h-4 w-4 mr-2" />
                        Voir les Résultats
                      </>
                    ) : (
                      <>
                        Voir les Détails
                        <ArrowRight className="inline h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liens utiles */}
        <div className="text-center">
          <Link 
            to="/courses"
            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Retour à toutes les courses
          </Link>
        </div>
      </div>
    </div>
  );
}
