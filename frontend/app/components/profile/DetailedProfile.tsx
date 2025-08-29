import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Award, 
  TrendingUp, 
  MapPin, 
  User, 
  Star,
  Trophy,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

interface ProfileData {
  id: string;
  type: 'horse' | 'jockey' | 'trainer' | 'owner';
  name: string;
  image?: string;
  basicInfo: Record<string, any>;
  statistics: {
    totalRaces: number;
    wins: number;
    places: number;
    shows: number;
    winRate: number;
    placeRate: number;
    earnings: number;
  };
  recentPerformances: Array<{
    date: string;
    race: string;
    position: number;
    distance: number;
    track: string;
    prize?: number;
  }>;
  careerChart: Array<{
    period: string;
    wins: number;
    races: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    icon: string;
  }>;
  connections?: {
    trainer?: string;
    jockey?: string;
    owner?: string;
    horses?: string[];
  };
}

interface DetailedProfileProps {
  profileId: string;
  profileType: 'horse' | 'jockey' | 'trainer' | 'owner';
  onClose: () => void;
}

export function DetailedProfile({ profileId, profileType, onClose }: DetailedProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfileData();
  }, [profileId, profileType]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Données mockées selon le type de profil
      let mockProfile: ProfileData;
      
      if (profileType === 'horse') {
        mockProfile = {
          id: profileId,
          type: 'horse',
          name: 'NOUR EL HOUDA',
          image: '/api/placeholder/200/200',
          basicInfo: {
            age: 4,
            sex: 'Jument',
            breed: 'Pur-sang Arabe',
            sire: 'MASSOUD AL ARAB',
            dam: 'SABRINA',
            owner: 'Élevage Al Waha',
            trainer: 'Habib Bouazizi',
            jockey: 'Ahmed Ben Ali',
            foaled: '2021-03-15',
            colors: 'Casaque jaune, toque noire'
          },
          statistics: {
            totalRaces: 12,
            wins: 4,
            places: 3,
            shows: 2,
            winRate: 33.3,
            placeRate: 58.3,
            earnings: 18500
          },
          recentPerformances: [
            { date: '2025-08-02', race: 'Prix DE CHIKRBEN', position: 1, distance: 2000, track: 'Ben Guerdane', prize: 4250 },
            { date: '2025-07-15', race: 'Prix D\'ÉTÉ', position: 3, distance: 1800, track: 'Tunis', prize: 1200 },
            { date: '2025-06-28', race: 'Prix DU PRINTEMPS', position: 2, distance: 1600, track: 'Sousse', prize: 2100 },
            { date: '2025-06-10', race: 'Prix DE JUIN', position: 1, distance: 1400, track: 'Ben Guerdane', prize: 3800 }
          ],
          careerChart: [
            { period: '2023', wins: 1, races: 3 },
            { period: '2024', wins: 2, races: 6 },
            { period: '2025', wins: 4, races: 8 }
          ],
          achievements: [
            { title: 'Première victoire', description: 'Victoire dans le Prix DE CHIKRBEN', date: '2025-08-02', icon: '🏆' },
            { title: 'Meilleur temps', description: 'Record personnel sur 1600m', date: '2025-06-28', icon: '⏱️' },
            { title: 'Série de victoires', description: 'Trois podiums consécutifs', date: '2025-07-15', icon: '🔥' }
          ],
          connections: {
            trainer: 'Habib Bouazizi',
            jockey: 'Ahmed Ben Ali',
            owner: 'Élevage Al Waha'
          }
        };
      } else if (profileType === 'jockey') {
        mockProfile = {
          id: profileId,
          type: 'jockey',
          name: 'Ahmed Ben Ali',
          image: '/api/placeholder/200/200',
          basicInfo: {
            age: 28,
            weight: '52 kg',
            height: '1.65 m',
            license: 'JOC-TUN-2018-142',
            debut: '2018-05-12',
            nationality: 'Tunisienne',
            colors: 'Casaque bleue et or',
            style: 'Spécialiste des finishs serrés'
          },
          statistics: {
            totalRaces: 185,
            wins: 42,
            places: 38,
            shows: 31,
            winRate: 22.7,
            placeRate: 43.2,
            earnings: 125000
          },
          recentPerformances: [
            { date: '2025-08-02', race: 'Prix DE CHIKRBEN', position: 1, distance: 2000, track: 'Ben Guerdane' },
            { date: '2025-08-02', race: 'Prix DE JEKITIS', position: 2, distance: 1400, track: 'Ben Guerdane' },
            { date: '2025-07-28', race: 'Prix D\'ÉTÉ', position: 1, distance: 1800, track: 'Tunis' },
            { date: '2025-07-20', race: 'Prix DE JUILLET', position: 3, distance: 2200, track: 'Sousse' }
          ],
          careerChart: [
            { period: '2023', wins: 15, races: 68 },
            { period: '2024', wins: 18, races: 72 },
            { period: '2025', wins: 9, races: 45 }
          ],
          achievements: [
            { title: 'Jockey de l\'année', description: 'Meilleur jockey tunisien 2024', date: '2024-12-31', icon: '👑' },
            { title: 'Record de victoires', description: '18 victoires en une saison', date: '2024-11-15', icon: '📈' },
            { title: 'Course prestigieuse', description: 'Victoire dans le Grand Prix de Tunis', date: '2024-09-22', icon: '🏆' }
          ],
          connections: {
            horses: ['NOUR EL HOUDA', 'FAROUK', 'SAHARA DU GOLFE']
          }
        };
      } else {
        // Trainer ou Owner - structure similaire adaptée
        mockProfile = {
          id: profileId,
          type: profileType,
          name: profileType === 'trainer' ? 'Habib Bouazizi' : 'Élevage Al Waha',
          image: '/api/placeholder/200/200',
          basicInfo: {
            founded: '1995',
            location: 'Ben Guerdane',
            speciality: 'Pur-sang Arabes',
            license: 'TR-TUN-1995-028'
          },
          statistics: {
            totalRaces: 280,
            wins: 65,
            places: 58,
            shows: 42,
            winRate: 23.2,
            placeRate: 44.6,
            earnings: 285000
          },
          recentPerformances: [
            { date: '2025-08-02', race: 'Prix DE CHIKRBEN', position: 1, distance: 2000, track: 'Ben Guerdane' },
            { date: '2025-07-28', race: 'Prix D\'ÉTÉ', position: 2, distance: 1800, track: 'Tunis' },
            { date: '2025-07-15', race: 'Prix DE JUILLET', position: 1, distance: 1600, track: 'Sousse' }
          ],
          careerChart: [
            { period: '2023', wins: 22, races: 95 },
            { period: '2024', wins: 25, races: 108 },
            { period: '2025', wins: 18, races: 77 }
          ],
          achievements: [
            { title: 'Entraîneur champion', description: 'Meilleur entraîneur 2024', date: '2024-12-31', icon: '🥇' },
            { title: 'Écurie performante', description: '25 victoires en une saison', date: '2024-11-30', icon: '🏆' }
          ],
          connections: {
            horses: ['NOUR EL HOUDA', 'FAROUK', 'PRINCE ARABE']
          }
        };
      }

      // Simule un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      setProfile(mockProfile);
      toast.success('Profil chargé avec succès');
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-lg p-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Chargement du profil...</p>
        </motion.div>
      </div>
    );
  }

  if (!profile) return null;

  const getTypeIcon = () => {
    switch (profile.type) {
      case 'horse': return '🐎';
      case 'jockey': return '🏇';
      case 'trainer': return '👨‍🏫';
      case 'owner': return '👑';
      default: return '📄';
    }
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-600 bg-yellow-100';
    if (position === 2) return 'text-gray-600 bg-gray-100';
    if (position === 3) return 'text-orange-600 bg-orange-100';
    return 'text-gray-500 bg-gray-50';
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'performance', label: 'Performances', icon: TrendingUp },
    { id: 'achievements', label: 'Palmarès', icon: Trophy },
    { id: 'connections', label: 'Relations', icon: User }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du profil */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getTypeIcon()}</div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-yellow-100 capitalize">
                  {profile.type === 'horse' ? 'Cheval' : 
                   profile.type === 'jockey' ? 'Jockey' : 
                   profile.type === 'trainer' ? 'Entraîneur' : 'Propriétaire'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.statistics.totalRaces}</div>
              <div className="text-sm text-yellow-100">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.statistics.wins}</div>
              <div className="text-sm text-yellow-100">Victoires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.statistics.winRate.toFixed(1)}%</div>
              <div className="text-sm text-yellow-100">Réussite</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.statistics.earnings.toLocaleString()}</div>
              <div className="text-sm text-yellow-100">DT gagnés</div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de base */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Informations générales</h3>
                  <div className="space-y-2">
                    {Object.entries(profile.basicInfo).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Graphique de carrière */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Évolution de carrière</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={profile.careerChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="wins" stroke="#D4AF37" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Dernières performances</h3>
              <div className="space-y-3">
                {profile.recentPerformances.map((perf, index) => (
                  <motion.div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(perf.position)}`}>
                          {perf.position}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{perf.race}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(perf.date).toLocaleDateString('fr-FR')} • {perf.distance}m • {perf.track}
                          </p>
                        </div>
                      </div>
                      {perf.prize && (
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{perf.prize.toLocaleString()} DT</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Réalisations et records</h3>
              {profile.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-r-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(achievement.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Connexions</h3>
              {profile.connections && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profile.connections).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 capitalize">
                        {key === 'horses' ? 'Chevaux' : key}
                      </h4>
                      {Array.isArray(value) ? (
                        <ul className="space-y-1">
                          {value.map((item, index) => (
                            <li key={index} className="text-gray-600 hover:text-yellow-600 cursor-pointer">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 hover:text-yellow-600 cursor-pointer">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DetailedProfile;
