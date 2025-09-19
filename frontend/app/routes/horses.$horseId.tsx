import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, Trophy, Calendar, MapPin, Activity, 
  TrendingUp, Award, Users, Clock, Target, Heart, Share2,
  Eye, BarChart3, DollarSign, Zap, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export async function loader({ params }: LoaderFunctionArgs) {
  const horseId = params.horseId;
  
  // Données détaillées d'un cheval tunisien (Rahib Albadeia)
  const horseData = {
    id: 1,
    name: 'Rahib Albadeia',
    arabicName: 'راهب البادية',
    nickname: 'Le Prince du Désert',
    
    // Informations de base
    basicInfo: {
      age: 4,
      birthDate: '2021-04-15',
      sex: 'Étalon',
      breed: 'Pur-sang Arabe',
      color: 'Bai foncé',
      height: '158cm',
      weight: '480kg',
      origin: 'Ben Guerdane, Tunisie',
      registration: 'TJC-PSA-2021-001',
      microchip: 'TN982000123456789'
    },

    // Connexions
    connections: {
      owner: {
        name: 'Kamel Mosrati',
        company: 'Haras Ben Guerdane',
        phone: '+216 75 123 456',
        since: '2021-06-01'
      },
      trainer: {
        name: 'Dhaou Brik',
        experience: 15,
        wins: 285,
        rating: 94,
        since: '2022-01-15'
      },
      currentJockey: {
        name: 'S. Seif Daas',
        age: 29,
        weight: '52kg',
        experience: 8,
        partnershipSince: '2023-03-01'
      },
      veterinarian: {
        name: 'Dr. Sami Khelifi',
        clinic: 'Clinique Vétérinaire Carthage',
        phone: '+216 71 234 567'
      },
      breeder: {
        name: 'Élevage Ben Guerdane',
        location: 'Ben Guerdane, Medenine',
        reputation: 'Excellence'
      }
    },

    // Généalogie
    pedigree: {
      sire: {
        name: 'Hacher Al Badr',
        arabicName: 'هاشر البدر',
        achievements: ['Prix International 2018', 'Champion de Tunisie 2017']
      },
      dam: {
        name: 'Ghayrabib',
        arabicName: 'غيربيب',
        achievements: ['Poulinière de l\'année 2020']
      },
      grandsire_paternal: 'Muneer Al Arab',
      grandsire_maternal: 'Bader El Nour',
      bloodlines: ['Al Badr 25%', 'Muneer 18.75%', 'Bader 12.5%', 'Autres 43.75%']
    },

    // Performances détaillées
    career: {
      summary: {
        totalRaces: 18,
        wins: 12,
        seconds: 4,
        thirds: 2,
        winRate: 66.7,
        placeRate: 100.0,
        earnings: 185000,
        averageMargin: '1.8L',
        bestTime: '1:32.12',
        rating: 95,
        lastRace: '2025-08-25'
      },
      
      form: [
        { position: '1', race: 'Prix de Ben Guerdane', date: '2025-08-25', margin: '2.5L' },
        { position: '1', race: 'Prix de Choucha', date: '2025-08-15', margin: '1.2L' },
        { position: '2', race: 'Prix International', date: '2025-08-05', margin: '-0.8L' },
        { position: '1', race: 'Prix du Bardo', date: '2025-07-25', margin: '3.1L' },
        { position: '1', race: 'Prix de Carthage', date: '2025-07-15', margin: '1.5L' }
      ],

      raceHistory: [
        {
          date: '2025-08-25',
          race: 'Prix de Ben Guerdane',
          hippodrome: 'Ben Guerdane',
          distance: '2000m',
          surface: 'Sable',
          position: 1,
          time: '2:04.12',
          jockey: 'S. Seif Daas',
          weight: '55kg',
          margin: '2.5L',
          prize: 15000,
          participants: 12,
          weather: 'Ensoleillé',
          goingDescription: 'Bon',
          speed: 58.8 // km/h
        },
        {
          date: '2025-08-15',
          race: 'Prix de Choucha',
          hippodrome: 'Carthage',
          distance: '1700m',
          surface: 'Gazon',
          position: 1,
          time: '1:38.45',
          jockey: 'S. Seif Daas',
          weight: '54kg',
          margin: '1.2L',
          prize: 12000,
          participants: 10,
          weather: 'Couvert',
          goingDescription: 'Souple',
          speed: 62.1
        },
        {
          date: '2025-08-05',
          race: 'Prix International',
          hippodrome: 'Carthage',
          distance: '1600m',
          surface: 'Gazon',
          position: 2,
          time: '1:35.30',
          jockey: 'S. Seif Daas',
          weight: '56kg',
          margin: '-0.8L',
          prize: 8000,
          participants: 14,
          weather: 'Pluvieux',
          goingDescription: 'Lourd',
          speed: 60.3
        }
      ],

      byDistance: {
        sprint: { races: 5, wins: 3, winRate: 60, avgTime: '1:12.5' },
        mile: { races: 8, wins: 6, winRate: 75, avgTime: '1:35.8' },
        distance: { races: 5, wins: 3, winRate: 60, avgTime: '2:08.3' }
      },

      bySurface: {
        sable: { races: 10, wins: 7, winRate: 70 },
        gazon: { races: 8, wins: 5, winRate: 62.5 }
      },

      byHippodrome: {
        carthage: { races: 8, wins: 5, winRate: 62.5 },
        benGuerdane: { races: 6, wins: 4, winRate: 66.7 },
        tunis: { races: 4, wins: 3, winRate: 75 }
      }
    },

    // Caractéristiques physiques et mentales
    attributes: {
      physical: {
        speed: 92,
        endurance: 88,
        agility: 85,
        strength: 90,
        balance: 87
      },
      mental: {
        courage: 95,
        intelligence: 88,
        docility: 82,
        concentration: 90,
        competitiveness: 94
      },
      technical: {
        acceleration: 90,
        topSpeed: 92,
        stamina: 88,
        recovery: 85,
        consistency: 90
      }
    },

    // Santé et condition
    medical: {
      status: 'excellent',
      lastCheck: '2025-08-20',
      vaccinations: {
        tetanus: '2025-04-15',
        flu: '2025-06-01',
        herpes: '2025-07-01',
        status: 'À jour'
      },
      treatments: [
        { date: '2025-08-10', type: 'Ostéopathie', notes: 'Séance de routine' },
        { date: '2025-07-15', type: 'Dentaire', notes: 'Contrôle annuel' }
      ],
      injuries: [
        { date: '2024-12-10', type: 'Entorse antérieur droit', recovery: '21 jours', status: 'Guéri' }
      ],
      fitness: 95,
      nextCheck: '2025-09-20'
    },

    // Achievements et records
    achievements: [
      {
        title: 'Prix de Ben Guerdane 2025',
        date: '2025-08-25',
        type: 'victory',
        significance: 'high',
        notes: 'Performance exceptionnelle, nouveau record de piste'
      },
      {
        title: 'Prix du Bardo 2025',
        date: '2025-07-25',
        type: 'victory',
        significance: 'medium',
        notes: 'Victoire facile de 3 longueurs'
      },
      {
        title: 'Champion Jeunes 2024',
        date: '2024-11-15',
        type: 'championship',
        significance: 'high',
        notes: 'Premier titre national'
      }
    ],

    // Prochaines courses
    upcomingRaces: [
      {
        date: '2025-09-05',
        race: 'Grand Prix d\'Automne',
        hippodrome: 'Carthage',
        distance: '1800m',
        prize: 25000,
        estimatedOdds: '2/1 favori',
        preparation: 'Excellente'
      },
      {
        date: '2025-09-20',
        race: 'Prix de la République',
        hippodrome: 'Tunis',
        distance: '2000m',
        prize: 35000,
        estimatedOdds: '3/1',
        preparation: 'En cours'
      }
    ],

    // Analyses avancées
    analytics: {
      trackRecord: 'Excellent sur sable, très bon sur gazon',
      preferredDistance: '1400-2000m',
      seasonalPerformance: 'Meilleur au printemps et automne',
      weatherPreference: 'Toutes conditions',
      competitionLevel: 'Elite nationale, International émergent',
      marketValue: 750000,
      retirementPlan: 'Reproduction prévue à 8 ans'
    }
  };

  return json({ horse: horseData });
}

export default function HorseDetail() {
  const { horse } = useLoaderData<typeof loader>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Navigation */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Link 
          to="/horses/advanced"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux chevaux</span>
        </Link>
      </motion.div>

      {/* Header principal */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-xl p-8 mb-8"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{horse.name}</h1>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            <p className="text-xl text-gray-600 mb-2">{horse.arabicName}</p>
            <p className="text-lg italic text-purple-600 mb-4">"{horse.nickname}"</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{horse.basicInfo.age} ans</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{horse.basicInfo.sex}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{horse.basicInfo.origin}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Rating {horse.career.summary.rating}</span>
              </div>
            </div>

            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(horse.medical.status)}`}>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Condition: {horse.medical.status}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Favoris</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </button>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{horse.career.summary.wins}</p>
            <p className="text-sm text-gray-600">Victoires</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{horse.career.summary.totalRaces}</p>
            <p className="text-sm text-gray-600">Courses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{horse.career.summary.winRate}%</p>
            <p className="text-sm text-gray-600">Taux victoires</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{horse.career.summary.earnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Gains (DT)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{horse.career.summary.bestTime}</p>
            <p className="text-sm text-gray-600">Meilleur temps</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{horse.analytics.marketValue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Valeur (DT)</p>
          </div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performances récentes */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              Historique des Courses
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Course</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Distance</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700">Position</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Temps</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Écart</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-700">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {horse.career.raceHistory.slice(0, 5).map((race, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm text-gray-900">
                        {new Date(race.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{race.race}</p>
                          <p className="text-xs text-gray-500">{race.hippodrome}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-900">{race.distance}</td>
                      <td className="py-3 px-2 text-center">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                          race.position === 1 ? 'bg-yellow-500 text-white' :
                          race.position === 2 ? 'bg-gray-400 text-white' :
                          race.position === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {race.position}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-900">{race.time}</td>
                      <td className="py-3 px-2 text-sm">
                        <span className={race.position === 1 ? 'text-green-600' : 'text-gray-600'}>
                          {race.margin}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-sm font-medium text-green-600">
                        {race.prize.toLocaleString()} DT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Analyses de performance */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analyses de Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar des attributs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attributs Physiques</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={Object.entries(horse.attributes.physical).map(([key, value]) => ({ 
                      attribute: key, 
                      value 
                    }))}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="attribute" fontSize={12} />
                      <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                      <Radar dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance par distance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance par Distance</h3>
                <div className="space-y-3">
                  {Object.entries(horse.career.byDistance).map(([distance, stats]) => (
                    <div key={distance} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{distance}</p>
                        <p className="text-sm text-gray-600">{stats.races} courses</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{stats.winRate}%</p>
                        <p className="text-sm text-gray-600">{stats.wins}/{stats.races}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations générales */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations Détaillées</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date de naissance:</span>
                <span className="font-medium">{new Date(horse.basicInfo.birthDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Race:</span>
                <span className="font-medium">{horse.basicInfo.breed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Couleur:</span>
                <span className="font-medium">{horse.basicInfo.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taille:</span>
                <span className="font-medium">{horse.basicInfo.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Poids:</span>
                <span className="font-medium">{horse.basicInfo.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Immatriculation:</span>
                <span className="font-medium text-xs">{horse.basicInfo.registration}</span>
              </div>
            </div>
          </motion.div>

          {/* Équipe */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Équipe</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{horse.connections.owner.name}</p>
                  <p className="text-sm text-gray-600">Propriétaire</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{horse.connections.trainer.name}</p>
                  <p className="text-sm text-gray-600">Entraîneur</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{horse.connections.currentJockey.name}</p>
                  <p className="text-sm text-gray-600">Jockey</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prochaines courses */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-2" />
              Prochaines Courses
            </h3>
            
            <div className="space-y-4">
              {horse.upcomingRaces.map((race, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{race.race}</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {race.estimatedOdds}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📅 {new Date(race.date).toLocaleDateString('fr-FR')}</p>
                    <p>🏟️ {race.hippodrome}</p>
                    <p>📏 {race.distance}</p>
                    <p>💰 {race.prize.toLocaleString()} DT</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Santé */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              État de Santé
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">État général:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(horse.medical.status)}`}>
                  {horse.medical.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Fitness:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${horse.medical.fitness}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{horse.medical.fitness}%</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Dernier contrôle: {new Date(horse.medical.lastCheck).toLocaleDateString('fr-FR')}</p>
                <p>Prochain: {new Date(horse.medical.nextCheck).toLocaleDateString('fr-FR')}</p>
                <p>Vétérinaire: {horse.connections.veterinarian.name}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
