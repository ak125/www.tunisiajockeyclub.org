import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext, Link } from '@remix-run/react';
import { 
  Trophy, Calendar, Users, MapPin, Clock, Plus,
  Eye, Edit, Star, TrendingUp
} from 'lucide-react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Récupérer les courses depuis le backend
    const coursesResponse = await fetch('http://localhost:3000/api/courses', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const coursesData = coursesResponse.ok ? await coursesResponse.json() : { courses: [], stats: {} };

    return json({
      courses: coursesData.courses || [],
      courseStats: coursesData.stats || {},
    });
  } catch (error) {
    console.error('Erreur chargement courses:', error);
    return json({
      courses: [],
      courseStats: { total: 0, upcoming: 0, completed: 0 },
    });
  }
}

export default function DashboardRaces() {
  const { courses, courseStats } = useLoaderData<typeof loader>();
  const { permissions } = useOutletContext<{
    permissions: any;
  }>();

  const sampleRaces = courses.length > 0 ? courses : [
    {
      id: 1,
      name: 'Prix du Président',
      date: '2025-09-15',
      time: '15:30',
      location: 'Hippodrome de Kassar Said',
      distance: 2400,
      prize: 50000,
      participants: 12,
      status: 'upcoming',
      category: 'Groupe I'
    },
    {
      id: 2,
      name: 'Prix de la République',
      date: '2025-09-22',
      time: '16:00',
      location: 'Hippodrome de Kassar Said',
      distance: 2000,
      prize: 35000,
      participants: 10,
      status: 'upcoming',
      category: 'Groupe II'
    },
    {
      id: 3,
      name: 'Prix de Tunis',
      date: '2025-08-20',
      time: '14:45',
      location: 'Hippodrome de Kassar Said',
      distance: 1600,
      prize: 25000,
      participants: 8,
      status: 'completed',
      category: 'Listed',
      winner: 'Thunder Strike'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Groupe II': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Groupe III': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Listed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-6 w-6 text-green-600 mr-2" />
            Gestion des Courses
          </h1>
          <p className="text-gray-600">
            Planification et suivi des courses hippiques
          </p>
        </div>
        
        {permissions.canManageRaces && (
          <Link
            to="/dashboard/races/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle course</span>
          </Link>
        )}
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total courses</p>
              <p className="text-xl font-bold text-green-600">{sampleRaces.length}</p>
            </div>
            <Trophy className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">À venir</p>
              <p className="text-xl font-bold text-blue-600">
                {sampleRaces.filter(r => r.status === 'upcoming').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants total</p>
              <p className="text-xl font-bold text-purple-600">
                {sampleRaces.reduce((sum, r) => sum + r.participants, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prix total</p>
              <p className="text-xl font-bold text-yellow-600">
                {(sampleRaces.reduce((sum, r) => sum + r.prize, 0) / 1000).toFixed(0)}K DT
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap items-center gap-4">
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Tous les statuts</option>
            <option value="upcoming">À venir</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
          </select>
          
          <select className="border rounded-lg px-3 py-2 text-gray-700">
            <option value="">Toutes catégories</option>
            <option value="groupe1">Groupe I</option>
            <option value="groupe2">Groupe II</option>
            <option value="groupe3">Groupe III</option>
            <option value="listed">Listed</option>
          </select>
          
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-gray-700"
            placeholder="Date"
          />
        </div>
      </div>

      {/* Liste des courses */}
      <div className="space-y-4">
        {sampleRaces.map((race) => (
          <div key={race.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{race.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(race.status)}`}>
                    {getStatusLabel(race.status)}
                  </span>
                  <span className={`px-2 py-1 rounded border text-xs font-medium ${getCategoryColor(race.category)}`}>
                    {race.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(race.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    {race.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {race.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {race.participants || 0} participants
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to={`/dashboard/races/${race.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                  title="Voir détails"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                {permissions.canManageRaces && (
                  <Link
                    to={`/dashboard/races/${race.id}/edit`}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-600">Distance</p>
                <p className="font-semibold text-gray-900">{race.distance || 0}m</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Prix</p>
                <p className="font-semibold text-green-600">
                  {race.prize ? `${race.prize.toLocaleString()} DT` : 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {race.status === 'completed' ? 'Vainqueur' : 'Statut'}
                </p>
                <p className="font-semibold text-gray-900">
                  {race.status === 'completed' ? race.winner : getStatusLabel(race.status)}
                </p>
              </div>
            </div>

            {race.status === 'upcoming' && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 p-3 rounded">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Course à venir</span>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {Math.ceil((new Date(race.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours restants
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
