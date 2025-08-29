import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Trophy, Users, Calendar, Award, Clock, Target,
  TrendingUp, Medal, Star, ArrowRight, Plus,
  Filter, Search, Timer
} from "lucide-react";

// Types pour les tournois
interface Tournament {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  rules: any;
}

interface Participant {
  id: string;
  horse_name: string;
  jockey_name: string;
  total_points: number;
  races_participated: number;
  wins: number;
  podium_finishes: number;
  rank: number;
  best_time: number;
}

interface LoaderData {
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  leaderboard: Participant[];
  stats: {
    total_tournaments: number;
    active_tournaments: number;
    total_participants: number;
    total_prize_pool: number;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Simuler les données des tournois en attendant l'API
    const mockData: LoaderData = {
      tournaments: [
        {
          id: "1",
          name: "Tournoi de Printemps 2025",
          description: "Grand tournoi de début de saison avec les meilleurs chevaux",
          start_date: "2025-03-01T10:00:00Z",
          end_date: "2025-03-15T18:00:00Z",
          status: "upcoming",
          prize_pool: 50000,
          max_participants: 20,
          current_participants: 15,
          rules: {}
        },
        {
          id: "2", 
          name: "Coupe d'Été 2025",
          description: "Compétition estivale intensive sur 3 semaines",
          start_date: "2025-06-01T09:00:00Z",
          end_date: "2025-06-21T19:00:00Z",
          status: "active",
          prize_pool: 75000,
          max_participants: 24,
          current_participants: 22,
          rules: {}
        },
        {
          id: "3",
          name: "Championship d'Automne",
          description: "Le championnat le plus prestigieux de l'année",
          start_date: "2025-09-10T08:00:00Z",
          end_date: "2025-10-05T20:00:00Z",
          status: "upcoming",
          prize_pool: 100000,
          max_participants: 16,
          current_participants: 8,
          rules: {}
        }
      ],
      activeTournament: null,
      leaderboard: [
        {
          id: "1",
          horse_name: "Thunder Bolt",
          jockey_name: "Ahmed Ben Ali",
          total_points: 145,
          races_participated: 5,
          wins: 3,
          podium_finishes: 4,
          rank: 1,
          best_time: 123.45
        },
        {
          id: "2",
          horse_name: "Desert Storm",
          jockey_name: "Fatma Trabelsi",
          total_points: 132,
          races_participated: 5,
          wins: 2,
          podium_finishes: 3,
          rank: 2,
          best_time: 125.67
        },
        {
          id: "3",
          horse_name: "Golden Arrow",
          jockey_name: "Mohamed Sassi",
          total_points: 118,
          races_participated: 4,
          wins: 1,
          podium_finishes: 3,
          rank: 3,
          best_time: 124.12
        }
      ],
      stats: {
        total_tournaments: 3,
        active_tournaments: 1,
        total_participants: 45,
        total_prize_pool: 225000
      }
    };

    return json(mockData);
  } catch (error) {
    console.error("Erreur lors du chargement des tournois:", error);
    return json({
      tournaments: [],
      activeTournament: null,
      leaderboard: [],
      stats: {
        total_tournaments: 0,
        active_tournaments: 0,
        total_participants: 0,
        total_prize_pool: 0
      }
    });
  }
}

export default function TournamentsPage() {
  const { tournaments, leaderboard, stats } = useLoaderData<LoaderData>();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Target className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <Trophy className="w-4 h-4" />;
      case 'cancelled': return <Timer className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <Star className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm border-b border-gray-200"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                Tournois & Compétitions
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Gérez vos tournois et suivez les classements en temps réel
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/dashboard-main"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Dashboard
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Tournoi
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tournois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_tournaments}</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active_tournaments}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total_participants}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prix Total</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.total_prize_pool.toLocaleString()} TND</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tournois List */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Tournois</h2>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {tournaments.map((tournament, index) => (
                  <motion.div
                    key={tournament.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tournament.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                            {getStatusIcon(tournament.status)}
                            {tournament.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{tournament.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(tournament.start_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {tournament.current_participants}/{tournament.max_participants}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {tournament.prize_pool.toLocaleString()} TND
                          </span>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Participants</span>
                        <span>{Math.round((tournament.current_participants / tournament.max_participants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(tournament.current_participants / tournament.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Classement Général</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {leaderboard.slice(0, 5).map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        participant.rank <= 3 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                          : 'bg-gray-50'
                      }`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(participant.rank)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            participant.rank <= 3 ? 'text-yellow-700' : 'text-gray-700'
                          }`}>
                            #{participant.rank}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {participant.horse_name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{participant.jockey_name}</p>
                        
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {participant.total_points} pts
                          </span>
                          <span>{participant.wins} victoires</span>
                          <span>{participant.best_time}s</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mx-auto">
                    Voir le classement complet
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
