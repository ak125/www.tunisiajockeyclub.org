import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Eye, TrendingUp, Award, 
  MapPin, Star, Heart, Activity, BarChart3, Trophy,
  Users, Target, Zap
} from 'lucide-react';
import { useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  // Données enrichies des chevaux avec vrais noms tunisiens
  const horsesData = [
    {
      id: 1,
      name: 'Rahib Albadeia',
      arabicName: 'راهب البادية',
      age: 4,
      sex: 'Étalon',
      breed: 'Pur-sang Arabe',
      color: 'Bai',
      origin: 'Ben Guerdane',
      owner: 'Kamel Mosrati',
      trainer: 'Dhaou Brik',
      jockey: 'S. Seif Daas',
      rating: 95,
      form: ['1', '1', '2', '1', '1'],
      totalRaces: 18,
      wins: 12,
      places: 15,
      winRate: 66.7,
      earnings: 185000,
      lastRace: '2025-08-25',
      nextRace: '2025-09-05',
      status: 'champion',
      specialties: ['Distance', 'Galop'],
      medicalStatus: 'excellent',
      weight: '480kg',
      height: '1.58m',
      sire: 'Hacher Al Badr',
      dam: 'Ghayrabib',
      breeding: 'Élevage Ben Guerdane',
      achievements: ['Prix de Ben Guerdane 2025', 'Prix du Bardo 2024'],
      performance: {
        speed: 92,
        endurance: 88,
        agility: 85,
        consistency: 90
      },
      recentForm: [
        { date: '2025-08-25', race: 'Prix de Ben Guerdane', position: 1, time: '2:04.12' },
        { date: '2025-08-15', race: 'Prix de Choucha', position: 1, time: '1:38.45' },
        { date: '2025-08-05', race: 'Prix International', position: 2, time: '1:42.30' }
      ]
    },
    {
      id: 2,
      name: 'Razane',
      arabicName: 'رزان',
      age: 3,
      sex: 'Jument',
      breed: 'Pur-sang Arabe',
      color: 'Alezan',
      origin: 'Carthage',
      owner: 'Kamel Mosrati',
      trainer: 'Dhaou Brik',
      jockey: 'F. Jallagi',
      rating: 88,
      form: ['2', '1', '3', '2', '1'],
      totalRaces: 12,
      wins: 6,
      places: 9,
      winRate: 50.0,
      earnings: 125000,
      lastRace: '2025-08-20',
      nextRace: '2025-09-02',
      status: 'rising',
      specialties: ['Sprint', 'Mile'],
      medicalStatus: 'excellent',
      weight: '445kg',
      height: '1.55m',
      sire: 'Bader El Nour',
      dam: 'Samira Al Arab',
      breeding: 'Haras de Carthage',
      achievements: ['Prix des Pouliches 2025'],
      performance: {
        speed: 95,
        endurance: 82,
        agility: 92,
        consistency: 85
      },
      recentForm: [
        { date: '2025-08-20', race: 'Prix des Roses', position: 2, time: '1:26.78' },
        { date: '2025-08-10', race: 'Prix de Tunis', position: 1, time: '1:24.56' },
        { date: '2025-07-30', race: 'Prix de Sidi Bou Said', position: 3, time: '1:28.90' }
      ]
    },
    {
      id: 3,
      name: 'Rafaan',
      arabicName: 'رفعان',
      age: 5,
      sex: 'Étalon',
      breed: 'Pur-sang Arabe',
      color: 'Gris',
      origin: 'Sousse',
      owner: 'Ahmed Regai',
      trainer: 'M\'ghorghor',
      jockey: 'A. Mabrouk',
      rating: 91,
      form: ['3', '2', '1', '1', '2'],
      totalRaces: 22,
      wins: 9,
      places: 16,
      winRate: 40.9,
      earnings: 165000,
      lastRace: '2025-08-18',
      nextRace: '2025-08-30',
      status: 'veteran',
      specialties: ['Distance', 'Cross'],
      medicalStatus: 'good',
      weight: '495kg',
      height: '1.60m',
      sire: 'Muneer Al Chark',
      dam: 'Zeradallah',
      breeding: 'Haras de Sousse',
      achievements: ['Prix du Sahel 2024', 'Grand Prix de Sousse 2023'],
      performance: {
        speed: 87,
        endurance: 95,
        agility: 80,
        consistency: 93
      },
      recentForm: [
        { date: '2025-08-18', race: 'Prix du Sahel', position: 3, time: '2:08.45' },
        { date: '2025-08-08', race: 'Prix de Monastir', position: 2, time: '1:45.20' },
        { date: '2025-07-28', race: 'Prix de Mahdia', position: 1, time: '1:42.10' }
      ]
    },
    {
      id: 4,
      name: 'Zahouel',
      arabicName: 'زاهول',
      age: 3,
      sex: 'Jument',
      breed: 'Pur-sang Arabe',
      color: 'Bai brun',
      origin: 'Sfax',
      owner: 'Jouini Mounir',
      trainer: 'Sadoq Triki',
      jockey: 'H. Mabrouk',
      rating: 84,
      form: ['1', '3', '2', '4', '2'],
      totalRaces: 10,
      wins: 4,
      places: 7,
      winRate: 40.0,
      earnings: 98000,
      lastRace: '2025-08-22',
      nextRace: '2025-09-08',
      status: 'promising',
      specialties: ['Mile', 'Galop'],
      medicalStatus: 'excellent',
      weight: '440kg',
      height: '1.54m',
      sire: 'Sanadik HH',
      dam: 'Nisbahat',
      breeding: 'Élevage Sfax',
      achievements: ['Prix des Jeunes 2025'],
      performance: {
        speed: 88,
        endurance: 80,
        agility: 87,
        consistency: 78
      },
      recentForm: [
        { date: '2025-08-22', race: 'Prix de Sfax', position: 1, time: '1:35.20' },
        { date: '2025-08-12', race: 'Prix du Sud', position: 3, time: '1:38.75' },
        { date: '2025-08-02', race: 'Prix de Gafsa', position: 2, time: '1:41.30' }
      ]
    }
  ];

  const stats = {
    totalHorses: horsesData.length,
    champions: horsesData.filter(h => h.status === 'champion').length,
    rising: horsesData.filter(h => h.status === 'rising').length,
    veterans: horsesData.filter(h => h.status === 'veteran').length,
    totalWins: horsesData.reduce((sum, h) => sum + h.wins, 0),
    totalEarnings: horsesData.reduce((sum, h) => sum + h.earnings, 0),
    averageRating: Math.round(horsesData.reduce((sum, h) => sum + h.rating, 0) / horsesData.length)
  };

  return json({ horses: horsesData, stats });
}

export default function HorsesAdvanced() {
  const { horses, stats } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'champion': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rising': return 'bg-green-100 text-green-800 border-green-200';
      case 'veteran': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'promising': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-red-600 bg-red-50';
    if (rating >= 85) return 'text-orange-600 bg-orange-50';
    if (rating >= 80) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  const filteredHorses = horses
    .filter(horse => {
      const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           horse.arabicName.includes(searchTerm) ||
                           horse.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           horse.trainer.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'all') return matchesSearch;
      return matchesSearch && horse.status === selectedFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'wins': return b.wins - a.wins;
        case 'winRate': return b.winRate - a.winRate;
        case 'earnings': return b.earnings - a.earnings;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      {/* Header avec animation */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🐎 Chevaux d'Elite - Tunisia Jockey Club
            </h1>
            <p className="text-gray-600 text-lg">Base de données complète des champions tunisiens</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{viewMode === 'grid' ? 'Liste' : 'Grille'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques KPI */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
      >
        {[
          { label: 'Total', value: stats.totalHorses, icon: Activity, color: 'blue' },
          { label: 'Champions', value: stats.champions, icon: Trophy, color: 'yellow' },
          { label: 'Montants', value: stats.rising, icon: TrendingUp, color: 'green' },
          { label: 'Vétérans', value: stats.veterans, icon: Star, color: 'purple' },
          { label: 'Victoires', value: stats.totalWins, icon: Award, color: 'red' },
          { label: 'Gains', value: `${Math.round(stats.totalEarnings / 1000)}k`, icon: Target, color: 'orange' },
          { label: 'Rating Moy', value: stats.averageRating, icon: Zap, color: 'pink' }
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

      {/* Filtres et recherche avancés */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, propriétaire, entraîneur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          {/* Filtre par statut */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="champion">Champions</option>
            <option value="rising">Montants</option>
            <option value="veteran">Vétérans</option>
            <option value="promising">Prometteurs</option>
          </select>
          
          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Par Rating</option>
            <option value="wins">Par Victoires</option>
            <option value="winRate">Par % Victoires</option>
            <option value="earnings">Par Gains</option>
            <option value="name">Par Nom</option>
          </select>
          
          {/* Filtres avancés */}
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </motion.div>

      {/* Liste/Grille des chevaux */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredHorses.map((horse, index) => (
              <motion.div
                key={horse.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Header de la carte */}
                <div className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="flex justify-between items-start">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{horse.name}</h3>
                      <p className="text-blue-100 text-sm">{horse.arabicName}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{horse.age} ans</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{horse.sex}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{horse.color}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRatingColor(horse.rating)}`}>
                      {horse.rating}
                    </div>
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="p-6">
                  {/* Statut et spécialités */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(horse.status)}`}>
                      {horse.status.charAt(0).toUpperCase() + horse.status.slice(1)}
                    </span>
                    {horse.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Performances */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">{horse.wins}</p>
                      <p className="text-xs text-gray-600">Victoires</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{horse.totalRaces}</p>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{horse.winRate}%</p>
                      <p className="text-xs text-gray-600">Taux</p>
                    </div>
                  </div>

                  {/* Forme récente */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Forme récente:</p>
                    <div className="flex space-x-1">
                      {horse.form.map((pos, idx) => (
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

                  {/* Propriétaire et entraîneur */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Prop.: {horse.owner}</span>
                    </div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      <span>Entr.: {horse.trainer}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{horse.origin}</span>
                    </div>
                  </div>

                  {/* Gains */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Gains totaux</span>
                    <span className="font-bold text-green-600">{horse.earnings.toLocaleString()} DT</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/horses/${horse.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Détails</span>
                    </Link>
                    <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Cheval</th>
                    <th className="text-left p-4 font-medium text-gray-900">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-900">Rating</th>
                    <th className="text-left p-4 font-medium text-gray-900">Performances</th>
                    <th className="text-left p-4 font-medium text-gray-900">Gains</th>
                    <th className="text-left p-4 font-medium text-gray-900">Forme</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHorses.map((horse) => (
                    <motion.tr
                      key={horse.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{horse.name}</p>
                          <p className="text-sm text-gray-500">{horse.arabicName}</p>
                          <div className="flex items-center mt-1 space-x-1">
                            <span className="text-xs text-gray-500">{horse.age}a {horse.sex}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{horse.origin}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(horse.status)}`}>
                          {horse.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getRatingColor(horse.rating)}`}>
                          {horse.rating}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-gray-900 font-medium">{horse.wins}/{horse.totalRaces}</div>
                          <div className="text-gray-500">{horse.winRate}% victoires</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-green-600">
                          {horse.earnings.toLocaleString()} DT
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-1">
                          {horse.form.slice(0, 3).map((pos, idx) => (
                            <div 
                              key={idx}
                              className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                                pos === '1' ? 'bg-yellow-500' :
                                pos === '2' ? 'bg-gray-400' :
                                pos === '3' ? 'bg-orange-500' : 'bg-gray-300'
                              }`}
                            >
                              {pos}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/horses/${horse.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex items-center justify-between bg-white p-4 rounded-xl shadow-lg"
      >
        <div className="text-sm text-gray-700">
          Affichage de {filteredHorses.length} chevaux
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 transition-colors">
            Précédent
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50 transition-colors">
            Suivant
          </button>
        </div>
      </motion.div>
    </div>
  );
}
