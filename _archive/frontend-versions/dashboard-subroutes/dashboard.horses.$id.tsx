import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { ArrowLeft, Edit, Trophy, Activity, Calendar, Heart, Star, Phone, Mail, MapPin, TrendingUp, Award } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const horseId = params.id;

  // Mock data pour le cheval spécifique
  const horse = {
    id: parseInt(horseId || '1'),
    name: "Thunder Bay",
    breed: "Pur-sang Arabe",
    age: 5,
    gender: "Étalon",
    color: "Bai brun",
    height: "1.65m",
    weight: "480kg",
    owner: "Haras El Ons",
    trainer: "Mohamed Gharbi",
    jockey: "Ahmed Ben Ali",
    totalRaces: 24,
    victories: 8,
    podiums: 16,
    winRate: 33.3,
    earnings: "125,000 TND",
    status: "active",
    lastRace: "2025-08-20",
    nextRace: "2025-08-25",
    form: ["1", "2", "1", "3", "1"],
    specialties: ["Galop", "1200-1600m"],
    photo: "/api/placeholder/128/128",
    condition: "excellent",
    rating: 92,
    birthDate: "2020-04-15",
    registration: "TJC-H-2025-001",
    sire: "Desert King",
    dam: "Golden Mare",
    veterinarian: "Dr. Sami Khelifi",
    lastMedicalCheck: "2025-08-15",
    vaccinations: "À jour",
    insurance: "Assurance Premium Active"
  };

  // Historique récent des courses
  const recentRaces = [
    {
      id: 1,
      date: "2025-08-20",
      raceName: "Prix de Carthage",
      jockey: "Ahmed Ben Ali",
      position: 1,
      participants: 12,
      prize: "25,000 TND",
      earnings: "12,500 TND",
      venue: "Hippodrome de Carthage",
      distance: "1600m",
      time: "1:42.35",
      conditions: "Bon"
    },
    {
      id: 2,
      date: "2025-08-15",
      raceName: "Grand Prix de Tunis",
      jockey: "Mohamed Khalil",
      position: 2,
      participants: 16,
      prize: "50,000 TND",
      earnings: "15,000 TND",
      venue: "Hippodrome de Tunis",
      distance: "2000m",
      time: "2:08.12",
      conditions: "Lourd"
    },
    {
      id: 3,
      date: "2025-08-10",
      raceName: "Course du Belvédère",
      jockey: "Ahmed Ben Ali",
      position: 1,
      participants: 10,
      prize: "18,000 TND",
      earnings: "9,000 TND",
      venue: "Hippodrome de Sousse",
      distance: "1800m",
      time: "1:56.78",
      conditions: "Bon"
    },
    {
      id: 4,
      date: "2025-08-05",
      raceName: "Prix de la République",
      jockey: "Youssef Mansour",
      position: 3,
      participants: 14,
      prize: "30,000 TND",
      earnings: "4,500 TND",
      venue: "Hippodrome de Bizerte",
      distance: "2200m",
      time: "2:28.90",
      conditions: "Souple"
    },
    {
      id: 5,
      date: "2025-07-28",
      raceName: "Course des Oliviers",
      jockey: "Ahmed Ben Ali",
      position: 1,
      participants: 8,
      prize: "15,000 TND",
      earnings: "7,500 TND",
      venue: "Hippodrome de Carthage",
      distance: "1400m",
      time: "1:32.45",
      conditions: "Bon"
    }
  ];

  // Courses à venir
  const upcomingRaces = [
    {
      id: 1,
      date: "2025-08-25",
      raceName: "Prix International",
      jockey: "Ahmed Ben Ali",
      venue: "Hippodrome de Carthage",
      distance: "1600m",
      expectedParticipants: 14,
      prize: "35,000 TND"
    },
    {
      id: 2,
      date: "2025-08-30",
      raceName: "Grand Prix d'Été",
      jockey: "Mohamed Khalil",
      venue: "Hippodrome de Tunis",
      distance: "2000m",
      expectedParticipants: 18,
      prize: "60,000 TND"
    }
  ];

  return json({ horse, recentRaces, upcomingRaces });
};

export default function HorseDetailPage() {
  const { horse, recentRaces, upcomingRaces } = useLoaderData<typeof loader>();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Actif
          </span>
        );
      case 'veteran':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Star className="w-4 h-4 mr-2" />
            Vétéran
          </span>
        );
      case 'rising':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <TrendingUp className="w-4 h-4 mr-2" />
            Prometteur
          </span>
        );
      default:
        return null;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 font-semibold';
      case 'good': return 'text-blue-600 font-medium';
      case 'average': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
          🥇 1er
        </span>
      );
    } else if (position === 2) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
          🥈 2e
        </span>
      );
    } else if (position === 3) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          🥉 3e
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {position}e
        </span>
      );
    }
  };

  const getFormDisplay = (form: string[]) => {
    return form.map((position, index) => (
      <span
        key={index}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
          position === '1' ? 'bg-yellow-100 text-yellow-800' :
          position === '2' ? 'bg-gray-100 text-gray-800' :
          position === '3' ? 'bg-amber-100 text-amber-800' :
          'bg-red-100 text-red-800'
        }`}
      >
        {position}
      </span>
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/horses"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux chevaux</span>
        </Link>
      </div>

      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-8">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                <Activity className="w-16 h-16 text-amber-600" />
              </div>
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{horse.name}</h1>
                {getStatusBadge(horse.status)}
              </div>
              <p className="text-amber-100 mb-4">{horse.breed} • {horse.age} ans • {horse.gender}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-amber-200">Robe</span>
                  <p className="font-semibold">{horse.color}</p>
                </div>
                <div>
                  <span className="text-amber-200">Taille</span>
                  <p className="font-semibold">{horse.height}</p>
                </div>
                <div>
                  <span className="text-amber-200">Poids</span>
                  <p className="font-semibold">{horse.weight}</p>
                </div>
                <div>
                  <span className="text-amber-200">Rating</span>
                  <p className="font-semibold">{horse.rating}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-amber-600">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistiques principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistiques de performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Statistiques de Performance</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{horse.victories}</p>
                <p className="text-sm text-gray-600">Victoires</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{horse.totalRaces}</p>
                <p className="text-sm text-gray-600">Courses</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{horse.winRate}%</p>
                <p className="text-sm text-gray-600">Taux de victoire</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{horse.podiums}</p>
                <p className="text-sm text-gray-600">Podiums</p>
              </div>
            </div>

            {/* Forme récente */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-2">Forme récente (5 dernières courses)</p>
                  <div className="flex space-x-2">
                    {getFormDisplay(horse.form)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Condition physique</p>
                  <p className={`text-lg font-bold ${getConditionColor(horse.condition)}`}>
                    ⚡ {horse.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">TND</span>
                </div>
                <div>
                  <p className="text-sm text-green-700">Gains totaux</p>
                  <p className="text-xl font-bold text-green-900">{horse.earnings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des courses récentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">🏁 Courses Récentes</h3>
            
            <div className="space-y-4">
              {recentRaces.map((race) => (
                <div key={race.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(race.date).toLocaleDateString('fr-FR')}
                      </span>
                      {getPositionBadge(race.position)}
                    </div>
                    <span className="text-green-600 font-medium text-sm">+{race.earnings}</span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{race.raceName}</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">Jockey:</span>
                      <p className="font-medium text-gray-900">{race.jockey}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Distance:</span>
                      <p className="font-medium text-gray-900">{race.distance}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Temps:</span>
                      <p className="font-medium text-gray-900">{race.time}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Participants:</span>
                      <p className="font-medium text-gray-900">{race.participants}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Conditions:</span>
                      <p className="font-medium text-gray-900">{race.conditions}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">{race.venue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Courses à venir */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">📅 Courses à Venir</h3>
            
            <div className="space-y-4">
              {upcomingRaces.map((race) => (
                <div key={race.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {new Date(race.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <span className="text-green-600 font-medium text-sm">Prix: {race.prize}</span>
                  </div>
                  
                  <h4 className="font-semibold text-blue-900 mb-2">{race.raceName}</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Jockey:</span>
                      <p className="font-medium text-blue-900">{race.jockey}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Distance:</span>
                      <p className="font-medium text-blue-900">{race.distance}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Participants:</span>
                      <p className="font-medium text-blue-900">{race.expectedParticipants} attendus</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-blue-700 mt-2">{race.venue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations personnelles et contact */}
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🐎 Informations Générales</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Date de naissance</span>
                <p className="font-medium text-gray-900">
                  {new Date(horse.birthDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Numéro d'enregistrement</span>
                <p className="font-medium text-gray-900">{horse.registration}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Père / Mère</span>
                <p className="font-medium text-gray-900">{horse.sire} / {horse.dam}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Spécialités</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {horse.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Équipe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Équipe</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Propriétaire</span>
                <p className="font-medium text-gray-900">{horse.owner}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Entraîneur</span>
                <p className="font-medium text-gray-900">{horse.trainer}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Jockey principal</span>
                <p className="font-medium text-gray-900">{horse.jockey}</p>
              </div>
            </div>
          </div>

          {/* Informations médicales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏥 Suivi Médical</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Vétérinaire</span>
                <p className="font-medium text-gray-900">{horse.veterinarian}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Dernier contrôle</span>
                <p className="font-medium text-gray-900">
                  {new Date(horse.lastMedicalCheck).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Vaccinations</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="font-medium text-green-600">{horse.vaccinations}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Assurance</span>
                <p className="font-medium text-gray-900">{horse.insurance}</p>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Actions Rapides</h3>
            
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Programmer visite vétérinaire
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Planifier entraînement
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                Inscrire à une course
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
