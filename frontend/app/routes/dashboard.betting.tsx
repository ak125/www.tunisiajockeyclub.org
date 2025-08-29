import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Trophy, 
  Calendar,
  Clock,
  Target,
  BarChart3,
  PlusCircle,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download
} from "lucide-react";

// Types pour le système de paris
interface Bet {
  id: string;
  raceId: string;
  raceName: string;
  horseId: string;
  horseName: string;
  jockeyName: string;
  userId: string;
  userName: string;
  amount: number;
  odds: string;
  betType: 'win' | 'place' | 'show' | 'exacta' | 'trifecta';
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  placedAt: string;
  payout?: number;
}

interface BetStats {
  totalBets: number;
  totalAmount: number;
  totalPayout: number;
  winRate: number;
  activeUsers: number;
  popularHorses: Array<{
    horseName: string;
    totalBets: number;
    totalAmount: number;
  }>;
}

// Loader pour récupérer les données de paris
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Simulation de données de paris (à remplacer par vraie API)
    const bets: Bet[] = [
      {
        id: '1',
        raceId: 'race-1',
        raceName: 'Prix du Président 2025',
        horseId: 'horse-1',
        horseName: 'Thunder Bay',
        jockeyName: 'Ahmed Ben Ali',
        userId: 'user-1',
        userName: 'Mohamed Sassi',
        amount: 50,
        odds: '3/1',
        betType: 'win',
        status: 'pending',
        placedAt: '2025-08-25T10:30:00Z'
      },
      {
        id: '2',
        raceId: 'race-1',
        raceName: 'Prix du Président 2025',
        horseId: 'horse-2',
        horseName: 'Desert Storm',
        jockeyName: 'Karim Mejri',
        userId: 'user-2',
        userName: 'Ali Trabelsi',
        amount: 100,
        odds: '5/2',
        betType: 'place',
        status: 'won',
        placedAt: '2025-08-25T09:15:00Z',
        payout: 250
      },
      {
        id: '3',
        raceId: 'race-2',
        raceName: 'Grand Prix d\'Été',
        horseId: 'horse-3',
        horseName: 'Golden Arrow',
        jockeyName: 'Sofien Ktari',
        userId: 'user-3',
        userName: 'Nizar Hamdi',
        amount: 75,
        odds: '4/1',
        betType: 'win',
        status: 'lost',
        placedAt: '2025-08-24T14:20:00Z'
      }
    ];

    const stats: BetStats = {
      totalBets: bets.length,
      totalAmount: bets.reduce((sum, bet) => sum + bet.amount, 0),
      totalPayout: bets.filter(b => b.payout).reduce((sum, bet) => sum + (bet.payout || 0), 0),
      winRate: (bets.filter(b => b.status === 'won').length / bets.length) * 100,
      activeUsers: new Set(bets.map(b => b.userId)).size,
      popularHorses: [
        { horseName: 'Thunder Bay', totalBets: 5, totalAmount: 250 },
        { horseName: 'Desert Storm', totalBets: 3, totalAmount: 180 },
        { horseName: 'Golden Arrow', totalBets: 4, totalAmount: 200 }
      ]
    };

    return json({ bets, stats });
  } catch (error) {
    console.error('Erreur chargement paris:', error);
    return json({ bets: [], stats: { totalBets: 0, totalAmount: 0, totalPayout: 0, winRate: 0, activeUsers: 0, popularHorses: [] } });
  }
}

// Action pour gérer les actions sur les paris
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');
  
  switch (action) {
    case 'cancel_bet':
      const betId = formData.get('betId');
      // Logique d'annulation de pari
      console.log(`Annulation du pari: ${betId}`);
      return json({ success: true, message: 'Pari annulé avec succès' });
    
    case 'approve_payout':
      const payoutBetId = formData.get('betId');
      // Logique d'approbation de paiement
      console.log(`Paiement approuvé pour: ${payoutBetId}`);
      return json({ success: true, message: 'Paiement approuvé' });
    
    default:
      return json({ success: false, message: 'Action non reconnue' });
  }
}

// Composants
const BetStatusBadge = ({ status }: { status: Bet['status'] }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En attente' },
    won: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Gagné' },
    lost: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Perdu' },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Annulé' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const BetTypeTag = ({ type }: { type: Bet['betType'] }) => {
  const typeConfig = {
    win: { color: 'bg-blue-100 text-blue-800', label: 'Gagnant' },
    place: { color: 'bg-purple-100 text-purple-800', label: 'Placé' },
    show: { color: 'bg-orange-100 text-orange-800', label: 'Show' },
    exacta: { color: 'bg-pink-100 text-pink-800', label: 'Exacta' },
    trifecta: { color: 'bg-indigo-100 text-indigo-800', label: 'Triféca' }
  };

  const config = typeConfig[type];
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, trend }: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${
        trend === 'up' ? 'bg-green-100' : 
        trend === 'down' ? 'bg-red-100' : 
        'bg-blue-100'
      }`}>
        <Icon className={`h-6 w-6 ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-blue-600'
        }`} />
      </div>
      {trend && (
        <TrendingUp className={`h-4 w-4 ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500 rotate-180' : 
          'text-gray-400'
        }`} />
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  </motion.div>
);

const BetCard = ({ bet, onAction }: { bet: Bet; onAction: (action: string, betId: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="font-bold text-lg text-gray-900">{bet.raceName}</h3>
          <BetStatusBadge status={bet.status} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Cheval:</span>
            <p className="font-semibold text-gray-900">{bet.horseName}</p>
          </div>
          <div>
            <span className="text-gray-500">Jockey:</span>
            <p className="font-semibold text-gray-900">{bet.jockeyName}</p>
          </div>
          <div>
            <span className="text-gray-500">Parieur:</span>
            <p className="font-semibold text-gray-900">{bet.userName}</p>
          </div>
          <div>
            <span className="text-gray-500">Placé le:</span>
            <p className="font-semibold text-gray-900">
              {new Date(bet.placedAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Mise</p>
          <p className="text-xl font-bold text-gray-900">{bet.amount} TND</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Cote</p>
          <p className="text-lg font-bold text-blue-600">{bet.odds}</p>
        </div>
        <BetTypeTag type={bet.betType} />
        {bet.payout && (
          <div className="text-center">
            <p className="text-sm text-gray-500">Gain</p>
            <p className="text-xl font-bold text-green-600">{bet.payout} TND</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/dashboard/races/${bet.raceId}`}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          Voir course
        </Link>
        {bet.status === 'pending' && (
          <button
            onClick={() => onAction('cancel_bet', bet.id)}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            <XCircle className="h-4 w-4" />
            Annuler
          </button>
        )}
        {bet.status === 'won' && !bet.payout && (
          <button
            onClick={() => onAction('approve_payout', bet.id)}
            className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4" />
            Approuver
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

// Composant principal
export default function BettingSystem() {
  const { bets, stats } = useLoaderData<{ bets: Bet[]; stats: BetStats }>();
  const fetcher = useFetcher();

  const handleBetAction = (action: string, betId: string) => {
    fetcher.submit(
      { action, betId },
      { method: 'post' }
    );
  };

  const pendingBets = bets.filter(bet => bet.status === 'pending');
  const completedBets = bets.filter(bet => bet.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Système de Paris</h1>
              <p className="text-gray-600 mt-2">
                Gestion complète des paris hippiques en temps réel
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4" />
                Exporter
              </button>
              <Link
                to="/dashboard/betting/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Nouveau Pari
              </Link>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <Filter className="h-5 w-5 text-gray-400" />
            <select className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tous les statuts</option>
              <option>En attente</option>
              <option>Gagnés</option>
              <option>Perdus</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tous les types</option>
              <option>Gagnant</option>
              <option>Placé</option>
              <option>Show</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={BarChart3}
            title="Total Paris"
            value={stats.totalBets}
            subtitle="Cette semaine"
            trend="up"
          />
          <StatCard
            icon={DollarSign}
            title="Volume Total"
            value={`${stats.totalAmount.toLocaleString()} TND`}
            subtitle="Mises cumulées"
            trend="up"
          />
          <StatCard
            icon={Target}
            title="Gains Payés"
            value={`${stats.totalPayout.toLocaleString()} TND`}
            subtitle="Payouts effectués"
          />
          <StatCard
            icon={TrendingUp}
            title="Taux Réussite"
            value={`${stats.winRate.toFixed(1)}%`}
            subtitle="Wins/Total"
            trend={stats.winRate > 50 ? 'up' : 'down'}
          />
          <StatCard
            icon={Users}
            title="Parieurs Actifs"
            value={stats.activeUsers}
            subtitle="Utilisateurs uniques"
          />
        </div>

        {/* Paris en attente */}
        {pendingBets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Paris en Attente ({pendingBets.length})
            </h2>
            {pendingBets.map(bet => (
              <BetCard key={bet.id} bet={bet} onAction={handleBetAction} />
            ))}
          </div>
        )}

        {/* Historique */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            Historique des Paris ({completedBets.length})
          </h2>
          {completedBets.map(bet => (
            <BetCard key={bet.id} bet={bet} onAction={handleBetAction} />
          ))}
        </div>

        {/* Message si pas de paris */}
        {bets.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun pari enregistré</h3>
            <p className="text-gray-500 mb-6">Commencez par créer votre premier pari</p>
            <Link
              to="/dashboard/betting/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Créer un pari
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
