import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Users, Star, CheckCircle, AlertCircle, Info } from "lucide-react";

type Horse = {
  id: string;
  name: string;
  rating: number;
  age: number;
  color: string;
  trainer: string;
  jockey: string;
  owner: string;
};

type Race = {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  distance: string;
  prize: string;
  maxParticipants: number;
  currentParticipants: number;
  surface: string;
  description: string;
  status: 'open' | 'closed' | 'completed';
  registrationDeadline: string;
  isRegistered?: boolean;
  registeredHorse?: Horse;
};

export async function loader({ request }: LoaderFunctionArgs) {
  // En production, vérifier l'authentification membre et récupérer ses chevaux
  const userHorses: Horse[] = [
    {
      id: '1',
      name: 'Al Sahel',
      rating: 95,
      age: 4,
      color: 'Bai',
      trainer: 'Ahmed Ben Salem',
      jockey: 'Mohamed Gharbi',
      owner: 'Utilisateur Actuel'
    },
    {
      id: '2',
      name: 'Carthage Star',
      rating: 88,
      age: 3,
      color: 'Alezan',
      trainer: 'Fatima Khaldi',
      jockey: 'Youssef Mejri',
      owner: 'Utilisateur Actuel'
    }
  ];

  // Courses disponibles avec statut d'inscription
  const availableRaces: Race[] = [
    {
      id: '1',
      name: 'Prix de Carthage',
      date: '2025-08-30',
      time: '15:30',
      venue: 'Hippodrome de Tunis',
      category: 'Groupe I',
      distance: '2400m',
      prize: '50,000 TND',
      maxParticipants: 12,
      currentParticipants: 8,
      surface: 'Turf',
      description: 'Course prestigieuse ouverte aux chevaux de 4 ans et plus.',
      status: 'open',
      registrationDeadline: '2025-08-28',
      isRegistered: true,
      registeredHorse: userHorses[0]
    },
    {
      id: '2',
      name: 'Prix de Tunis',
      date: '2025-09-02',
      time: '16:00',
      venue: 'Hippodrome de Tunis',
      category: 'Groupe II',
      distance: '1600m',
      prize: '35,000 TND',
      maxParticipants: 15,
      currentParticipants: 12,
      surface: 'Turf',
      description: 'Course de vitesse pour chevaux de 3 ans.',
      status: 'open',
      registrationDeadline: '2025-08-31',
      isRegistered: false
    },
    {
      id: '3',
      name: 'Prix des Oliviers',
      date: '2025-09-05',
      time: '14:45',
      venue: 'Hippodrome de Sousse',
      category: 'Listed',
      distance: '2000m',
      prize: '25,000 TND',
      maxParticipants: 10,
      currentParticipants: 7,
      surface: 'Turf',
      description: 'Course d\'endurance dans le cadre du festival d\'automne.',
      status: 'open',
      registrationDeadline: '2025-09-03',
      isRegistered: false
    }
  ];

  return json({ userHorses, availableRaces });
}

export default function MemberRaces() {
  const { userHorses, availableRaces } = useLoaderData<typeof loader>();
  const [selectedTab, setSelectedTab] = useState<'available' | 'registered'>('available');

  const registeredRaces = availableRaces.filter(race => race.isRegistered);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Groupe II': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Groupe III': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Listed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 100) return 'text-purple-600 bg-purple-100';
    if (rating >= 90) return 'text-blue-600 bg-blue-100';
    if (rating >= 80) return 'text-green-600 bg-green-100';
    if (rating >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const isEligible = (race: Race, horse: Horse) => {
    // Logique d'éligibilité basée sur l'âge, le rating, etc.
    if (race.category === 'Groupe I' && horse.rating < 85) return false;
    if (race.category === 'Groupe II' && horse.rating < 75) return false;
    return true;
  };

  const daysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🏇 Mes Courses</h1>
        <p className="text-gray-600 mt-1">Gérez les inscriptions de vos chevaux aux courses</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Mes Chevaux</p>
              <p className="text-2xl font-bold">{userHorses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Inscriptions</p>
              <p className="text-2xl font-bold">{registeredRaces.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Courses Ouvertes</p>
              <p className="text-2xl font-bold">{availableRaces.filter(r => r.status === 'open').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mes Chevaux */}
      <div className="bg-white rounded-lg shadow border mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🐎 Mes Chevaux</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userHorses.map((horse) => (
              <div key={horse.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{horse.name}</h3>
                    <p className="text-sm text-gray-600">{horse.color} • {horse.age} ans</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm font-medium ${getRatingColor(horse.rating)}`}>
                    Rating: {horse.rating}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Entraîneur:</span> <span className="font-medium">{horse.trainer}</span></p>
                  <p><span className="text-gray-600">Jockey:</span> <span className="font-medium">{horse.jockey}</span></p>
                </div>
                
                <Link 
                  to={`/member/horses/${horse.id}`}
                  className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Voir le profil →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('available')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'available'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Courses Disponibles ({availableRaces.filter(r => !r.isRegistered).length})
            </button>
            <button
              onClick={() => setSelectedTab('registered')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'registered'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes Inscriptions ({registeredRaces.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab === 'available' && (
            <div className="space-y-4">
              {availableRaces
                .filter(race => !race.isRegistered && race.status === 'open')
                .map((race) => (
                  <div key={race.id} className="bg-white rounded-lg shadow border p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(race.category)}`}>
                            {race.category}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(race.status)}`}>
                            Ouvert
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{race.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium text-gray-900">{new Date(race.date).toLocaleDateString('fr-FR')}</div>
                              <div>{race.time}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <div className="font-medium text-gray-900">{race.venue}</div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {race.currentParticipants}/{race.maxParticipants}
                              </div>
                              <div>{race.distance}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Trophy className="w-4 h-4 mr-2" />
                            <div className="font-medium text-gray-900">{race.prize}</div>
                          </div>
                        </div>

                        {/* Date limite d'inscription */}
                        <div className="flex items-center text-sm mb-4">
                          <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-gray-600">
                            Inscription jusqu'au {new Date(race.registrationDeadline).toLocaleDateString('fr-FR')}
                            <span className="font-medium text-orange-600 ml-1">
                              ({daysUntilDeadline(race.registrationDeadline)} jours restants)
                            </span>
                          </span>
                        </div>

                        {/* Chevaux éligibles */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Chevaux éligibles:</h4>
                          <div className="flex flex-wrap gap-2">
                            {userHorses
                              .filter(horse => isEligible(race, horse))
                              .map(horse => (
                                <span key={horse.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {horse.name} (Rating: {horse.rating})
                                </span>
                              ))
                            }
                            {userHorses.filter(horse => isEligible(race, horse)).length === 0 && (
                              <span className="text-sm text-gray-500">Aucun cheval éligible</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        {userHorses.some(horse => isEligible(race, horse)) ? (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                            S'inscrire
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                          >
                            Non éligible
                          </button>
                        )}
                        <Link 
                          to={`/public/courses/${race.id}`}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-center"
                        >
                          Détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {selectedTab === 'registered' && (
            <div className="space-y-4">
              {registeredRaces.length > 0 ? (
                registeredRaces.map((race) => (
                  <div key={race.id} className="bg-white rounded-lg shadow border p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(race.category)}`}>
                            {race.category}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Inscrit
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium text-gray-900">{new Date(race.date).toLocaleDateString('fr-FR')}</div>
                              <div>{race.time}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <div className="font-medium text-gray-900">{race.venue}</div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <div className="font-medium text-gray-900">{race.distance}</div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Trophy className="w-4 h-4 mr-2" />
                            <div className="font-medium text-gray-900">{race.prize}</div>
                          </div>
                        </div>

                        {/* Cheval inscrit */}
                        {race.registeredHorse && (
                          <div className="border rounded-lg p-3 bg-blue-50">
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-blue-600 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">Cheval inscrit: {race.registeredHorse.name}</p>
                                <p className="text-sm text-gray-600">
                                  Jockey: {race.registeredHorse.jockey} • Rating: {race.registeredHorse.rating}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <button className="border border-red-300 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 transition-colors text-sm font-medium">
                          Annuler
                        </button>
                        <Link 
                          to={`/public/courses/${race.id}`}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-center"
                        >
                          Détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune inscription</h3>
                  <p className="text-gray-600">Vous n'êtes actuellement inscrit à aucune course.</p>
                  <button
                    onClick={() => setSelectedTab('available')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Voir les courses disponibles
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
