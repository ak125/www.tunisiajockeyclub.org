import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { 
  Activity, Search, Plus, Filter, TrendingUp, Eye,
  Calendar, Award, MapPin
} from 'lucide-react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Récupérer la liste des chevaux depuis le backend
    const horsesResponse = await fetch('http://localhost:3000/api/horses', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const horsesData = horsesResponse.ok ? await horsesResponse.json() : { horses: [], stats: {} };

    return json({
      horses: horsesData.horses || [],
      horseStats: horsesData.stats || {},
      filters: {
        ages: ['2 ans', '3 ans', '4 ans', '5+ ans'],
        sexes: ['Mâle', 'Femelle', 'Hongre'],
        origins: ['Tunisie', 'France', 'Maroc', 'Algérie'],
      },
    });
  } catch (error) {
    console.error('Erreur chargement chevaux:', error);
    return json({
      horses: [],
      horseStats: { total: 0, active: 0, retired: 0 },
      filters: {
        ages: ['2 ans', '3 ans', '4 ans', '5+ ans'],
        sexes: ['Mâle', 'Femelle', 'Hongre'],
        origins: ['Tunisie', 'France', 'Maroc', 'Algérie'],
      },
    });
  }
}

export default function DashboardHorses() {
  const { horses, horseStats, filters } = useLoaderData<typeof loader>();
  const { user, permissions } = useOutletContext<{
    user: any;
    permissions: any;
  }>();

  const sampleHorses = horses.length > 0 ? horses : [
    {
      id: 1,
      name: 'Thunder Strike',
      age: 4,
      sex: 'Mâle',
      origin: 'Tunisie',
      rating: 95,
      races: 12,
      wins: 5,
      lastRace: '2025-08-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Desert Rose',
      age: 3,
      sex: 'Femelle', 
      origin: 'France',
      rating: 88,
      races: 8,
      wins: 3,
      lastRace: '2025-08-22',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sahara Wind',
      age: 5,
      sex: 'Hongre',
      origin: 'Maroc',
      rating: 92,
      races: 18,
      wins: 8,
      lastRace: '2025-08-10',
      status: 'active'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="h-6 w-6 text-blue-600 mr-2" />
            Gestion des Chevaux
          </h1>
          <p className="text-gray-600">
            Base de données complète des chevaux du club
          </p>
        </div>
        
        {permissions.canManageHorses && (
          <Link
            to="/dashboard/horses/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau cheval</span>
          </Link>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total chevaux</p>
              <p className="text-xl font-bold text-blue-600">{sampleHorses.length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En activité</p>
              <p className="text-xl font-bold text-green-600">
                {sampleHorses.filter(h => h.status === 'active').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Victoires totales</p>
              <p className="text-xl font-bold text-yellow-600">
                {sampleHorses.reduce((sum, h) => sum + h.wins, 0)}
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rating moyen</p>
              <p className="text-xl font-bold text-purple-600">
                {Math.round(sampleHorses.reduce((sum, h) => sum + h.rating, 0) / sampleHorses.length)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un cheval..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Tous les âges</option>
            {filters.ages.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Tous les sexes</option>
            {filters.sexes.map(sex => (
              <option key={sex} value={sex}>{sex}</option>
            ))}
          </select>
          
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Toutes origines</option>
            {filters.origins.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Plus de filtres</span>
          </button>
        </div>
      </div>

      {/* Liste des chevaux */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Cheval</th>
                <th className="text-left p-4 font-medium text-gray-900">Âge/Sexe</th>
                <th className="text-left p-4 font-medium text-gray-900">Origine</th>
                <th className="text-left p-4 font-medium text-gray-900">Rating</th>
                <th className="text-left p-4 font-medium text-gray-900">Performances</th>
                <th className="text-left p-4 font-medium text-gray-900">Dernière course</th>
                <th className="text-left p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sampleHorses.map((horse) => (
                <tr key={horse.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{horse.name}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          horse.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-gray-500 capitalize">{horse.status}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-900">{horse.age} ans, {horse.sex}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-900">{horse.origin}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      horse.rating >= 90 ? 'bg-green-100 text-green-800' :
                      horse.rating >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {horse.rating}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{horse.wins}/{horse.races}</div>
                      <div className="text-gray-500">
                        {Math.round((horse.wins / horse.races) * 100)}% victoires
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(horse.lastRace).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/dashboard/horses/${horse.id}`}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {permissions.canManageHorses && (
                        <Link
                          to={`/dashboard/horses/${horse.id}/edit`}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Modifier"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de 1 à {sampleHorses.length} sur {sampleHorses.length} chevaux
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm hover:bg-white">Précédent</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border rounded text-sm hover:bg-white">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
