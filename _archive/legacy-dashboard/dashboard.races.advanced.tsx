import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Download,
  Filter,
  Search,
  ChevronDown
} from "lucide-react";

// Types
interface Race {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  prize: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  weather?: string;
  track?: string;
  horses?: Array<{
    id: number;
    name: string;
    jockey: string;
    odds: string;
    position?: number;
  }>;
}

// Loader
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Simuler données avancées de courses
    const races: Race[] = [
      {
        id: 1,
        name: "Grand Prix du Président 2025",
        date: "2025-08-30",
        time: "15:30",
        location: "Hippodrome de Tunis",
        distance: "2400m",
        prize: "50,000 TND",
        status: "upcoming",
        participants: 12,
        maxParticipants: 16,
        weather: "Ensoleillé",
        track: "Bon",
        horses: [
          { id: 101, name: "Thunder Bay", jockey: "Ahmed Ben Ali", odds: "3/1" },
          { id: 102, name: "Desert Storm", jockey: "Mohamed Sassi", odds: "4/1" },
          { id: 103, name: "Golden Arrow", jockey: "Karim Mejri", odds: "5/2" }
        ]
      },
      {
        id: 2,
        name: "Prix de l'Indépendance",
        date: "2025-08-28",
        time: "16:00",
        location: "Hippodrome de Sousse",
        distance: "1800m",
        prize: "30,000 TND",
        status: "live",
        participants: 10,
        maxParticipants: 14,
        weather: "Nuageux",
        track: "Souple",
        horses: [
          { id: 201, name: "Royal Flash", jockey: "Ali Trabelsi", odds: "2/1", position: 1 },
          { id: 202, name: "Swift Wind", jockey: "Nizar Hamdi", odds: "7/2", position: 2 },
          { id: 203, name: "Black Pearl", jockey: "Sofien Ktari", odds: "4/1", position: 3 }
        ]
      },
      {
        id: 3,
        name: "Course des Champions",
        date: "2025-08-25",
        time: "14:30",
        location: "Hippodrome de Tunis",
        distance: "2000m",
        prize: "40,000 TND",
        status: "completed",
        participants: 14,
        maxParticipants: 16,
        weather: "Partiellement nuageux",
        track: "Bon",
        horses: [
          { id: 301, name: "Victory Lap", jockey: "Mohamed Sassi", odds: "3/2", position: 1 },
          { id: 302, name: "Storm Rider", jockey: "Ahmed Ben Ali", odds: "5/2", position: 2 },
          { id: 303, name: "Fire Arrow", jockey: "Karim Mejri", odds: "3/1", position: 3 }
        ]
      }
    ];

    return json({ races });
  } catch (error) {
    return json({ races: [] });
  }
}

// Composants
const RaceStatusBadge = ({ status }: { status: Race['status'] }) => {
  const statusConfig = {
    upcoming: { color: 'bg-blue-100 text-blue-800', label: 'À venir' },
    live: { color: 'bg-green-100 text-green-800 animate-pulse', label: 'En direct' },
    completed: { color: 'bg-gray-100 text-gray-800', label: 'Terminé' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const RaceCard = ({ race }: { race: Race }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="font-bold text-lg text-gray-900">{race.name}</h3>
          <RaceStatusBadge status={race.status} />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{race.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{race.location}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-green-600">{race.prize}</p>
        <p className="text-sm text-gray-500">Prix total</p>
      </div>
    </div>

    {/* Détails de la course */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
        <p className="font-semibold text-gray-900">{race.distance}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Participants</p>
        <p className="font-semibold text-gray-900">{race.participants}/{race.maxParticipants}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Météo</p>
        <p className="font-semibold text-gray-900">{race.weather}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Piste</p>
        <p className="font-semibold text-gray-900">{race.track}</p>
      </div>
    </div>

    {/* Chevaux participants */}
    {race.horses && race.horses.length > 0 && (
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Chevaux participants
        </h4>
        <div className="grid gap-2">
          {race.horses.slice(0, 3).map((horse) => (
            <div key={horse.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-3">
                {horse.position && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    horse.position === 1 ? 'bg-yellow-500 text-white' :
                    horse.position === 2 ? 'bg-gray-400 text-white' :
                    horse.position === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {horse.position}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{horse.name}</p>
                  <p className="text-sm text-gray-600">{horse.jockey}</p>
                </div>
              </div>
              <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {horse.odds}
              </span>
            </div>
          ))}
          {race.horses.length > 3 && (
            <p className="text-sm text-gray-500 text-center py-2">
              +{race.horses.length - 3} autres chevaux...
            </p>
          )}
        </div>
      </div>
    )}

    {/* Actions */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Link
          to={`/dashboard/races/${race.id}`}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          Voir détails
        </Link>
        {race.status === 'upcoming' && (
          <Link
            to={`/dashboard/races/${race.id}/edit`}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Link>
        )}
      </div>
      
      {race.status === 'live' && (
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-sm font-medium">Course en direct</span>
        </div>
      )}
    </div>
  </motion.div>
);

// Composant principal
export default function AdvancedRaces() {
  const { races } = useLoaderData<{ races: Race[] }>();

  const upcomingRaces = races.filter(race => race.status === 'upcoming');
  const liveRaces = races.filter(race => race.status === 'live');
  const completedRaces = races.filter(race => race.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion Avancée des Courses</h1>
              <p className="text-gray-600 mt-2">
                Suivi en temps réel et gestion complète des courses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4" />
                Exporter
              </button>
              <Link
                to="/dashboard/races/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nouvelle Course
              </Link>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une course..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filtres
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Courses</p>
                <p className="text-3xl font-bold">{races.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">En Direct</p>
                <p className="text-3xl font-bold">{liveRaces.length}</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-200 rounded-full animate-ping mr-2"></div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">À Venir</p>
                <p className="text-3xl font-bold">{upcomingRaces.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Participants Total</p>
                <p className="text-3xl font-bold">{races.reduce((acc, race) => acc + race.participants, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </motion.div>
        </div>

        {/* Courses en direct */}
        {liveRaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              Courses En Direct
            </h2>
            {liveRaces.map(race => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        )}

        {/* Courses à venir */}
        {upcomingRaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Courses À Venir
            </h2>
            {upcomingRaces.map(race => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        )}

        {/* Courses terminées */}
        {completedRaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gray-500" />
              Courses Terminées
            </h2>
            {completedRaces.map(race => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 py-8">
          <p>Tunisia Jockey Club - Gestion Avancée des Courses</p>
          <p className="text-sm mt-1">Système de suivi en temps réel • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}
