import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Trophy, 
  Users, 
  TrendingUp, 
  Calendar,
  Star,
  ChevronRight,
  Menu,
  Bell,
  Search
} from "lucide-react";

// Types
interface DashboardData {
  horses: number;
  users: number;
  races: number;
  jockeys: number;
  totalHorses: number;
  ratingsEnabled: boolean;
  recentRaces?: Array<{
    id: number;
    name: string;
    date: string;
    status: string;
  }>;
  topJockeys?: Array<{
    id: number;
    name: string;
    rating: number;
    wins: number;
  }>;
}

// Loader pour récupérer les données
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log('🔄 Mobile Dashboard - Chargement des données...');
    
    const response = await fetch('http://localhost:3000/api/dashboard/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ Erreur API:', response.status, response.statusText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Mobile Dashboard - Données chargées:', data);

    return json(data);
  } catch (error) {
    console.error('❌ Mobile Dashboard - Erreur:', error);
    
    // Données de fallback pour mobile
    return json({
      horses: 12,
      users: 8,
      races: 3,
      jockeys: 6,
      totalHorses: 45,
      ratingsEnabled: true,
      recentRaces: [
        { id: 1, name: "Prix du Président", date: "2024-08-25", status: "En cours" },
        { id: 2, name: "Grand Prix", date: "2024-08-24", status: "Terminé" },
        { id: 3, name: "Prix d'Été", date: "2024-08-23", status: "Terminé" }
      ],
      topJockeys: [
        { id: 1, name: "Ahmed Ben Ali", rating: 98, wins: 24 },
        { id: 2, name: "Mohamed Sassi", rating: 95, wins: 21 },
        { id: 3, name: "Karim Mejri", rating: 92, wins: 18 }
      ]
    } as DashboardData);
  }
}

// Composants Mobile
const MobileHeader = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-3">
        <Menu className="h-6 w-6" />
        <h1 className="text-xl font-bold">TJC Mobile</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        <Search className="h-5 w-5" />
      </div>
    </div>
    <p className="text-blue-100 text-sm">Tunisia Jockey Club Dashboard</p>
  </div>
);

const MobileStatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = "bg-white" 
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`${color} rounded-xl p-4 shadow-sm border border-gray-100`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
        )}
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-full">
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const MobileRaceCard = ({ race }: { race: any }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-2"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm">{race.name}</h4>
        <p className="text-xs text-gray-500">{race.date}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          race.status === 'En cours' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {race.status}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  </motion.div>
);

const MobileJockeyCard = ({ jockey }: { jockey: any }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-2"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full">
          <Star className="h-4 w-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{jockey.name}</h4>
          <p className="text-xs text-gray-500">{jockey.wins} victoires</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-gray-900">{jockey.rating}</p>
        <p className="text-xs text-gray-500">Rating</p>
      </div>
    </div>
  </motion.div>
);

// Composant principal
export default function MobileDashboard() {
  const data = useLoaderData<DashboardData>();

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <MobileHeader />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MobileStatCard
          icon={Zap}
          title="Chevaux"
          value={data.totalHorses}
          subtitle="Actifs"
        />
        <MobileStatCard
          icon={Users}
          title="Jockeys"
          value={data.jockeys}
          subtitle="Licenciés"
        />
        <MobileStatCard
          icon={Trophy}
          title="Courses"
          value={data.races}
          subtitle="Ce mois"
        />
        <MobileStatCard
          icon={TrendingUp}
          title="Ratings"
          value={data.ratingsEnabled ? "ON" : "OFF"}
          subtitle="Système"
        />
      </div>

      {/* Courses Récentes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Courses Récentes</h2>
          <Link 
            to="/dashboard/races" 
            className="text-blue-600 text-sm font-medium"
          >
            Voir tout
          </Link>
        </div>
        <div className="space-y-2">
          {(data.recentRaces || []).map((race, index) => (
            <MobileRaceCard key={race.id || index} race={race} />
          ))}
        </div>
      </div>

      {/* Top Jockeys */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Top Jockeys</h2>
          <Link 
            to="/dashboard/jockeys" 
            className="text-blue-600 text-sm font-medium"
          >
            Classement
          </Link>
        </div>
        <div className="space-y-2">
          {(data.topJockeys || []).map((jockey, index) => (
            <MobileJockeyCard key={jockey.id || index} jockey={jockey} />
          ))}
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          to="/dashboard/races/new"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-4 text-center shadow-sm"
        >
          <Calendar className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Nouvelle Course</p>
        </Link>
        <Link
          to="/dashboard/horses"
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-4 text-center shadow-sm"
        >
          <Zap className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Gérer Chevaux</p>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs py-4">
        <p>Tunisia Jockey Club Mobile Dashboard</p>
        <p className="mt-1">Données en temps réel • Version {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}