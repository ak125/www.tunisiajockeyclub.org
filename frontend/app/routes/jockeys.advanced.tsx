import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Award, TrendingUp, TrendingDown, Star, Eye, 
  Trophy, Target, Activity, BarChart3, Calendar, Clock,
  Zap, Heart, Filter, Search, MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export async function loader({ request }: LoaderFunctionArgs) {
  // Données enrichies des jockeys tunisiens
  const jockeysData = [
    {
      id: 1,
      name: 'Ahmed Ben Salem',
      arabicName: 'أحمد بن سالم',
      age: 32,
      weight: '52kg',
      height: '165cm',
      experience: 12,
      origin: 'Tunis',
      totalRaces: 580,
      wins: 187,
      seconds: 142,
      thirds: 98,
      winRate: 32.2,
      placeRate: 73.6,
      earnings: 850000,
      lastRace: '2025-08-25',
      status: 'elite',
      specialties: ['Sprint', 'Mile', 'Galop'],
      rating: 96,
      form: ['1', '1', '2', '1', '3'],
      license: 'TJC-J-2015-001',
      achievements: [
        'Champion Jockey 2024',
        'Prix International 2024',
        'Grand Prix de Tunis 2023'
      ],
      statistics: {
        byDistance: {
          sprint: { races: 220, wins: 85, winRate: 38.6 },
          mile: { races: 180, wins: 62, winRate: 34.4 },
          distance: { races: 180, wins: 40, winRate: 22.2 }
        },
        byTrack: {
          carthage: { races: 280, wins: 95, winRate: 33.9 },
          tunis: { races: 180, wins: 58, winRate: 32.2 },
          sousse: { races: 120, wins: 34, winRate: 28.3 }
        },
        monthly: [
          { month: 'Jan', wins: 15, races: 42 },
          { month: 'Fév', wins: 18, races: 45 },
          { month: 'Mar', wins: 22, races: 50 },
          { month: 'Avr', wins: 19, races: 48 },
          { month: 'Mai', wins: 25, races: 55 },
          { month: 'Jun', wins: 28, races: 60 },
          { month: 'Jul', wins: 32, races: 65 },
          { month: 'Aoû', wins: 28, races: 58 }
        ]
      },
      skills: {
        speed: 95,
        tactical: 92,
        endurance: 88,
        experience: 96,
        horsemanship: 94,
        consistency: 90
      },
      medicalStatus: 'excellent',
      contracts: ['Écurie Ben Mahmoud', 'Haras de Carthage']
    },
    {
      id: 2,
      name: 'Fatma Trabelsi',
      arabicName: 'فاطمة الطرابلسي',
      age: 28,
      weight: '48kg',
      height: '158cm',
      experience: 8,
      origin: 'Sfax',
      totalRaces: 420,
      wins: 145,
      seconds: 108,
      thirds: 72,
      winRate: 34.5,
      placeRate: 77.4,
      earnings: 680000,
      lastRace: '2025-08-23',
      status: 'rising',
      specialties: ['Distance', 'Cross', 'Obstacle'],
      rating: 91,
      form: ['1', '2', '1', '1', '2'],
      license: 'TJC-J-2018-008',
      achievements: [
        'Prix des Femmes Jockeys 2024',
        'Champion Cross-Country 2023',
        'Meilleur Espoir 2019'
      ],
      statistics: {
        byDistance: {
          sprint: { races: 120, wins: 38, winRate: 31.7 },
          mile: { races: 150, wins: 52, winRate: 34.7 },
          distance: { races: 150, wins: 55, winRate: 36.7 }
        },
        byTrack: {
          carthage: { races: 200, wins: 68, winRate: 34.0 },
          tunis: { races: 120, wins: 42, winRate: 35.0 },
          sousse: { races: 100, wins: 35, winRate: 35.0 }
        },
        monthly: [
          { month: 'Jan', wins: 12, races: 35 },
          { month: 'Fév', wins: 15, races: 38 },
          { month: 'Mar', wins: 18, races: 42 },
          { month: 'Avr', wins: 16, races: 40 },
          { month: 'Mai', wins: 20, races: 45 },
          { month: 'Jun', wins: 22, races: 48 },
          { month: 'Jul', wins: 25, races: 52 },
          { month: 'Aoû', wins: 17, races: 43 }
        ]
      },
      skills: {
        speed: 88,
        tactical: 94,
        endurance: 96,
        experience: 85,
        horsemanship: 92,
        consistency: 93
      },
      medicalStatus: 'excellent',
      contracts: ['Haras du Sud', 'Écurie Sfax Racing']
    },
    {
      id: 3,
      name: 'Mohamed Karray',
      arabicName: 'محمد الكراي',
      age: 38,
      weight: '54kg',
      height: '170cm',
      experience: 18,
      origin: 'Monastir',
      totalRaces: 750,
      wins: 245,
      seconds: 168,
      thirds: 125,
      winRate: 32.7,
      placeRate: 71.7,
      earnings: 1200000,
      lastRace: '2025-08-20',
      status: 'veteran',
      specialties: ['Mile', 'Distance', 'Handicap'],
      rating: 93,
      form: ['2', '1', '3', '1', '1'],
      license: 'TJC-J-2008-003',
      achievements: [
        'Champion Vétéran 2024',
        'Grand Prix du Sahel 2022',
        'Prix de la République 2021',
        '500 Victoires (2023)'
      ],
      statistics: {
        byDistance: {
          sprint: { races: 180, wins: 52, winRate: 28.9 },
          mile: { races: 320, wins: 118, winRate: 36.9 },
          distance: { races: 250, wins: 75, winRate: 30.0 }
        },
        byTrack: {
          carthage: { races: 350, wins: 120, winRate: 34.3 },
          tunis: { races: 220, wins: 72, winRate: 32.7 },
          sousse: { races: 180, wins: 53, winRate: 29.4 }
        },
        monthly: [
          { month: 'Jan', wins: 18, races: 48 },
          { month: 'Fév', wins: 20, races: 52 },
          { month: 'Mar', wins: 22, races: 55 },
          { month: 'Avr', wins: 25, races: 58 },
          { month: 'Mai', wins: 28, races: 62 },
          { month: 'Jun', wins: 30, races: 65 },
          { month: 'Jul', wins: 35, races: 72 },
          { month: 'Aoû', wins: 32, races: 68 }
        ]
      },
      skills: {
        speed: 85,
        tactical: 98,
        endurance: 92,
        experience: 99,
        horsemanship: 97,
        consistency: 95
      },
      medicalStatus: 'good',
      contracts: ['Écurie Monastir', 'Haras Royal']
    },
    {
      id: 4,
      name: 'Sami Jouini',
      arabicName: 'سامي الجويني',
      age: 24,
      weight: '50kg',
      height: '162cm',
      experience: 4,
      origin: 'Ben Guerdane',
      totalRaces: 180,
      wins: 52,
      seconds: 38,
      thirds: 28,
      winRate: 28.9,
      placeRate: 65.6,
      earnings: 280000,
      lastRace: '2025-08-24',
      status: 'promising',
      specialties: ['Sprint', 'Galop'],
      rating: 82,
      form: ['1', '3', '1', '2', '1'],
      license: 'TJC-J-2022-015',
      achievements: [
        'Prix des Apprentis 2024',
        'Révélation de l\'année 2023'
      ],
      statistics: {
        byDistance: {
          sprint: { races: 95, wins: 32, winRate: 33.7 },
          mile: { races: 55, wins: 15, winRate: 27.3 },
          distance: { races: 30, wins: 5, winRate: 16.7 }
        },
        byTrack: {
          carthage: { races: 80, wins: 25, winRate: 31.3 },
          tunis: { races: 60, wins: 16, winRate: 26.7 },
          sousse: { races: 40, wins: 11, winRate: 27.5 }
        },
        monthly: [
          { month: 'Jan', wins: 4, races: 15 },
          { month: 'Fév', wins: 6, races: 18 },
          { month: 'Mar', wins: 7, races: 20 },
          { month: 'Avr', wins: 8, races: 22 },
          { month: 'Mai', wins: 9, races: 25 },
          { month: 'Jun', wins: 12, races: 28 },
          { month: 'Jul', wins: 15, races: 32 },
          { month: 'Aoû', wins: 11, races: 28 }
        ]
      },
      skills: {
        speed: 92,
        tactical: 78,
        endurance: 85,
        experience: 72,
        horsemanship: 88,
        consistency: 80
      },
      medicalStatus: 'excellent',
      contracts: ['Écurie du Sud', 'Ben Guerdane Racing']
    }
  ];

  const stats = {
    totalJockeys: jockeysData.length,
    elite: jockeysData.filter(j => j.status === 'elite').length,
    rising: jockeysData.filter(j => j.status === 'rising').length,
    veterans: jockeysData.filter(j => j.status === 'veteran').length,
    promising: jockeysData.filter(j => j.status === 'promising').length,
    totalWins: jockeysData.reduce((sum, j) => sum + j.wins, 0),
    totalRaces: jockeysData.reduce((sum, j) => sum + j.totalRaces, 0),
    totalEarnings: jockeysData.reduce((sum, j) => sum + j.earnings, 0),
    averageWinRate: Number((jockeysData.reduce((sum, j) => sum + j.winRate, 0) / jockeysData.length).toFixed(1))
  };

  return json({ jockeys: jockeysData, stats });
}

export default function JockeysAdvanced() {
  const { jockeys, stats } = useLoaderData<typeof loader>();
  const [selectedJockey, setSelectedJockey] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'elite': return 'bg-red-100 text-red-800 border-red-200';
      case 'rising': return 'bg-green-100 text-green-800 border-green-200';
      case 'veteran': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'promising': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 95) return 'text-red-600 bg-red-50';
    if (rating >= 90) return 'text-orange-600 bg-orange-50';
    if (rating >= 85) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  const filteredJockeys = jockeys
    .filter(jockey => {
      const matchesSearch = jockey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           jockey.arabicName.includes(searchTerm) ||
                           jockey.origin.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'all') return matchesSearch;
      return matchesSearch && jockey.status === selectedFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'wins': return b.wins - a.wins;
        case 'winRate': return b.winRate - a.winRate;
        case 'earnings': return b.earnings - a.earnings;
        case 'experience': return b.experience - a.experience;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🏇 Jockeys d'Elite - Tunisia Jockey Club
            </h1>
            <p className="text-gray-600 text-lg">Profils et analyses des champions tunisiens</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Grille</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Liste</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                viewMode === 'analytics' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques KPI */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
      >
        {[
          { label: 'Total', value: stats.totalJockeys, icon: Users, color: 'blue' },
          { label: 'Elite', value: stats.elite, icon: Trophy, color: 'red' },
          { label: 'Montants', value: stats.rising, icon: TrendingUp, color: 'green' },
          { label: 'Vétérans', value: stats.veterans, icon: Star, color: 'blue' },
          { label: 'Prometteurs', value: stats.promising, icon: Zap, color: 'purple' },
          { label: 'Victoires', value: stats.totalWins, icon: Award, color: 'yellow' },
          { label: 'Courses', value: stats.totalRaces, icon: Activity, color: 'orange' },
          { label: '% Moy', value: `${stats.averageWinRate}%`, icon: Target, color: 'pink' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-${stat.color}-400`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
              <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, origine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="elite">Elite</option>
            <option value="rising">Montants</option>
            <option value="veteran">Vétérans</option>
            <option value="promising">Prometteurs</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500"
          >
            <option value="rating">Par Rating</option>
            <option value="wins">Par Victoires</option>
            <option value="winRate">Par % Victoires</option>
            <option value="earnings">Par Gains</option>
            <option value="experience">Par Expérience</option>
            <option value="name">Par Nom</option>
          </select>
          
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Plus</span>
          </button>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredJockeys.map((jockey, index) => (
              <motion.div
                key={jockey.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header de la carte */}
                <div className="relative p-6 bg-gradient-to-r from-purple-500 to-pink-600">
                  <div className="flex justify-between items-start">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{jockey.name}</h3>
                      <p className="text-purple-100 text-sm">{jockey.arabicName}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{jockey.age} ans</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{jockey.weight}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{jockey.experience}a exp.</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRatingColor(jockey.rating)}`}>
                      {jockey.rating}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Statut et spécialités */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(jockey.status)}`}>
                      {jockey.status.charAt(0).toUpperCase() + jockey.status.slice(1)}
                    </span>
                    {jockey.specialties.slice(0, 2).map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Performances principales */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">{jockey.wins}</p>
                      <p className="text-xs text-gray-600">Victoires</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{jockey.totalRaces}</p>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{jockey.winRate}%</p>
                      <p className="text-xs text-gray-600">Taux</p>
                    </div>
                  </div>

                  {/* Radar des compétences */}
                  <div className="mb-4 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={Object.entries(jockey.skills).map(([key, value]) => ({ skill: key, value }))}>
                        <PolarGrid gridType="polygon" />
                        <PolarAngleAxis dataKey="skill" fontSize={10} />
                        <PolarRadiusAxis domain={[0, 100]} fontSize={8} />
                        <Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Forme récente */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Forme récente:</p>
                    <div className="flex space-x-1">
                      {jockey.form.map((pos, idx) => (
                        <div 
                          key={idx}
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                            pos === '1' ? 'bg-yellow-500' :
                            pos === '2' ? 'bg-gray-400' :
                            pos === '3' ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        >
                          {pos}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{jockey.origin}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Licence: {jockey.license}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Dernière: {new Date(jockey.lastRace).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Gains */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Gains totaux</span>
                    <span className="font-bold text-green-600">{jockey.earnings.toLocaleString()} DT</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/jockeys/${jockey.id}`}
                      className="flex-1 bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewMode === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredJockeys.map((jockey) => (
              <div key={jockey.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{jockey.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(jockey.status)}`}>
                    {jockey.status}
                  </span>
                </div>
                
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={jockey.statistics.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="wins" stroke="#8B5CF6" strokeWidth={2} />
                      <Line type="monotone" dataKey="races" stroke="#E5E7EB" strokeWidth={1} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {Object.entries(jockey.statistics.byDistance).map(([distance, stats]) => (
                    <div key={distance} className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 capitalize">{distance}</p>
                      <p className="font-bold text-sm">{stats.winRate.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classement des performances */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
          Classement Elite - Taux de Victoires
        </h3>
        
        <div className="space-y-3">
          {filteredJockeys.sort((a, b) => b.winRate - a.winRate).slice(0, 5).map((jockey, index) => (
            <div key={jockey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{jockey.name}</p>
                  <p className="text-sm text-gray-600">{jockey.origin} • {jockey.age} ans • {jockey.experience}a exp.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-right">
                <div>
                  <p className="font-bold text-green-600">{jockey.winRate}%</p>
                  <p className="text-xs text-gray-500">Taux victoires</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{jockey.wins}/{jockey.totalRaces}</p>
                  <p className="text-xs text-gray-500">V/Courses</p>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${getRatingColor(jockey.rating)}`}>
                  {jockey.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
