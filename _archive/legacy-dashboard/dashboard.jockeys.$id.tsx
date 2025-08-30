import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { ArrowLeft, Edit, Trophy, TrendingUp, Calendar, Users, Star, Phone, Mail, MapPin, Activity, Award } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const jockeyId = params.id;

  // Mock data pour le jockey spécifique
  const jockey = {
    id: parseInt(jockeyId || '1'),
    firstName: "Ahmed",
    lastName: "Ben Ali",
    age: 28,
    nationality: "Tunisienne",
    weight: "52kg",
    height: "1.65m",
    experience: 8,
    totalRaces: 245,
    victories: 67,
    podiums: 134,
    winRate: 27.3,
    earnings: "485,000 TND",
    status: "active",
    lastRace: "2025-08-20",
    nextRace: "2025-08-25",
    specialties: ["Galop", "Obstacles"],
    photo: "/api/placeholder/128/128",
    club: "Tunisia Jockey Club",
    license: "TJC-2025-001",
    phone: "+216 98 123 456",
    email: "ahmed.benali@tjc.com",
    address: "Tunis, Tunisie",
    joinDate: "2017-03-15",
    trainer: "Mohamed Gharbi",
    medicalStatus: "Apte",
    lastMedicalCheck: "2025-08-10",
    emergencyContact: "Fatima Ben Ali - +216 98 654 321"
  };

  // Historique récent des courses
  const recentRaces = [
    {
      id: 1,
      date: "2025-08-20",
      raceName: "Prix de Carthage",
      horse: "Thunder Bay",
      position: 1,
      participants: 12,
      prize: "25,000 TND",
      earnings: "12,500 TND",
      venue: "Hippodrome de Carthage",
      distance: "1600m",
      time: "1:42.35"
    },
    {
      id: 2,
      date: "2025-08-15",
      raceName: "Grand Prix de Tunis",
      horse: "Desert Storm",
      position: 2,
      participants: 16,
      prize: "50,000 TND",
      earnings: "15,000 TND",
      venue: "Hippodrome de Tunis",
      distance: "2000m",
      time: "2:08.12"
    },
    {
      id: 3,
      date: "2025-08-10",
      raceName: "Course du Belvédère",
      horse: "Sahara Prince",
      position: 1,
      participants: 10,
      prize: "18,000 TND",
      earnings: "9,000 TND",
      venue: "Hippodrome de Sousse",
      distance: "1800m",
      time: "1:56.78"
    },
    {
      id: 4,
      date: "2025-08-05",
      raceName: "Prix de la République",
      horse: "Atlas Runner",
      position: 3,
      participants: 14,
      prize: "30,000 TND",
      earnings: "4,500 TND",
      venue: "Hippodrome de Bizerte",
      distance: "2200m",
      time: "2:28.90"
    },
    {
      id: 5,
      date: "2025-07-28",
      raceName: "Course des Oliviers",
      horse: "Thunder Bay",
      position: 1,
      participants: 8,
      prize: "15,000 TND",
      earnings: "7,500 TND",
      venue: "Hippodrome de Carthage",
      distance: "1400m",
      time: "1:32.45"
    }
  ];

  // Courses à venir
  const upcomingRaces = [
    {
      id: 1,
      date: "2025-08-25",
      raceName: "Prix International",
      horse: "Thunder Bay",
      venue: "Hippodrome de Carthage",
      distance: "1600m",
      expectedParticipants: 14,
      prize: "35,000 TND"
    },
    {
      id: 2,
      date: "2025-08-30",
      raceName: "Grand Prix d'Été",
      horse: "Desert Storm",
      venue: "Hippodrome de Tunis",
      distance: "2000m",
      expectedParticipants: 18,
      prize: "60,000 TND"
    }
  ];

  return json({ jockey, recentRaces, upcomingRaces });
};

export default function JockeyDetailPage() {
  const { jockey, recentRaces, upcomingRaces } = useLoaderData<typeof loader>();

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
      case 'rookie':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <TrendingUp className="w-4 h-4 mr-2" />
            Débutant
          </span>
        );
      default:
        return null;
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

  return (
    <div className="p-6 space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/jockeys"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux jockeys</span>
        </Link>
      </div>

      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {jockey.firstName} {jockey.lastName}
                </h1>
                {getStatusBadge(jockey.status)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-200">Âge</span>
                  <p className="font-semibold">{jockey.age} ans</p>
                </div>
                <div>
                  <span className="text-blue-200">Expérience</span>
                  <p className="font-semibold">{jockey.experience} ans</p>
                </div>
                <div>
                  <span className="text-blue-200">Poids</span>
                  <p className="font-semibold">{jockey.weight}</p>
                </div>
                <div>
                  <span className="text-blue-200">Licence</span>
                  <p className="font-semibold">#{jockey.license}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
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
                <p className="text-2xl font-bold text-gray-900">{jockey.victories}</p>
                <p className="text-sm text-gray-600">Victoires</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{jockey.totalRaces}</p>
                <p className="text-sm text-gray-600">Courses</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{jockey.winRate}%</p>
                <p className="text-sm text-gray-600">Taux de victoire</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{jockey.podiums}</p>
                <p className="text-sm text-gray-600">Podiums</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">TND</span>
                </div>
                <div>
                  <p className="text-sm text-green-700">Gains totaux</p>
                  <p className="text-xl font-bold text-green-900">{jockey.earnings}</p>
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">Cheval:</span>
                      <p className="font-medium text-gray-900">{race.horse}</p>
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
                      <span className="text-blue-600">Cheval:</span>
                      <p className="font-medium text-blue-900">{race.horse}</p>
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
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Informations Personnelles</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Nationalité</span>
                <p className="font-medium text-gray-900">{jockey.nationality}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Taille / Poids</span>
                <p className="font-medium text-gray-900">{jockey.height} / {jockey.weight}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Spécialités</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {jockey.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Club</span>
                <p className="font-medium text-gray-900">{jockey.club}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Date d'inscription</span>
                <p className="font-medium text-gray-900">
                  {new Date(jockey.joinDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Contact</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Téléphone</span>
                  <p className="font-medium text-gray-900">{jockey.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium text-gray-900">{jockey.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">Adresse</span>
                  <p className="font-medium text-gray-900">{jockey.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations médicales et professionnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏥 Informations Médicales</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Statut médical</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="font-medium text-green-600">{jockey.medicalStatus}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Dernier contrôle</span>
                <p className="font-medium text-gray-900">
                  {new Date(jockey.lastMedicalCheck).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Entraîneur</span>
                <p className="font-medium text-gray-900">{jockey.trainer}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Contact d'urgence</span>
                <p className="font-medium text-gray-900 text-sm">{jockey.emergencyContact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
