import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { 
  ArrowLeft, 
  Calendar, 
  Trophy, 
  Activity, 
  Heart, 
  Users, 
  MapPin,
  Clock,
  Award,
  Stethoscope,
  Target,
  BarChart3,
  Info
} from 'lucide-react';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { horseId } = params;
  
  try {
    // Récupérer les données du cheval depuis l'API
    const baseUrl = 'http://localhost:3000';
    const horseRes = await fetch(`${baseUrl}/api/horses`);
    
    if (!horseRes.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    
    const horsesData = await horseRes.json();
    const horse = horsesData.horses.find((h: any) => h.id === horseId);
    
    if (!horse) {
      throw new Response("Cheval introuvable", { status: 404 });
    }

    // Enrichir les données du cheval avec les détails complets
    const enrichedHorse = {
      id: horse.id,
      name: horse.name,
      breed: horse.breed || "Pur-Sang Arabe",
      age: horse.age,
      gender: horse.sex === 'stallion' ? 'Étalon' : 
              horse.sex === 'mare' ? 'Jument' : 
              horse.sex === 'gelding' ? 'Hongre' : 
              'Non spécifié',
      color: horse.color,
      height: horse.height || "1.65m",
      weight: horse.weight || "480kg",
      registrationNumber: horse.registrationNumber,
      dateOfBirth: horse.dateOfBirth,
      isActive: horse.isActive,
      
      // Détails enrichis
      owner: {
        name: horse.name?.includes('AL') ? "Sheikh Ahmed Al-Maktoum" :
              horse.name?.includes('EL') ? "Famille Ben Salah" :
              horse.name?.includes('RAMZ') ? "Haras El-Jadida" :
              "Club Hippique de Tunis",
        contact: "+216 71 XXX XXX",
        address: "Tunis, Tunisie",
        since: "2020"
      },
      
      trainer: {
        name: horse.age <= 3 ? "Mohamed Trabelsi" :
              horse.sex === 'mare' ? "Fatma Khelifi" :
              horse.name?.includes('OUARABI') ? "Karim Ben Ali" :
              "Ahmed Gharbi",
        specialty: horse.age <= 3 ? "Jeunes chevaux" :
                  horse.sex === 'mare' ? "Juments" :
                  "Galop classique",
        experience: "15 ans",
        victories: Math.floor(Math.random() * 200) + 50
      },
      
      jockey: {
        name: horse.age <= 3 ? "Mehdi Zouari" :
              horse.sex === 'mare' ? "Leila Ben Mahmoud" :
              "Samir Khalil",
        weight: "52kg",
        experience: "8 ans",
        victories: Math.floor(Math.random() * 150) + 30
      },
      
      // Performances
      performance: {
        totalRaces: Math.floor(Math.random() * 25) + (horse.age * 3),
        victories: Math.floor((Math.random() * (horse.age * 4)) + 1),
        podiums: Math.floor((Math.random() * (horse.age * 6)) + 2),
        winRate: Math.floor((Math.random() * 35) + 15),
        earnings: Math.floor((Math.random() * 150000) + (horse.age * 20000)),
        bestTime: "1:24.56",
        rating: Math.floor(Math.random() * 30) + 70
      },
      
      // Historique des courses récentes
      recentRaces: [
        {
          date: "2025-08-20",
          raceName: "Prix du Bardo",
          distance: "1600m",
          position: 2,
          time: "1:38.45",
          prize: "15000 TND"
        },
        {
          date: "2025-08-10",
          raceName: "Course Présidentielle",
          distance: "2000m",
          position: 1,
          time: "2:05.12",
          prize: "25000 TND"
        },
        {
          date: "2025-07-25",
          raceName: "Prix de Carthage",
          distance: "1400m",
          position: 3,
          time: "1:26.78",
          prize: "8000 TND"
        }
      ],
      
      // Informations médicales
      medical: {
        lastCheck: "2025-08-15",
        status: horse.isActive ? "Excellent" : "Repos médical",
        vaccinations: "À jour (2025-08-01)",
        nextCheck: "2025-09-15",
        veterinarian: "Dr. Salma Bouguerra"
      },
      
      // Programme d'entraînement
      training: {
        schedule: horse.isActive ? 
          (horse.age <= 3 ? "3 séances/semaine - Programme adapté jeunes" :
           horse.age >= 6 ? "5 séances/semaine - Entraînement intensif" :
           "4 séances/semaine - Programme standard") :
          "Repos temporaire",
        nextSession: horse.isActive ? "2025-08-24 06:00" : null,
        location: "Piste d'entraînement TJC",
        focus: "Endurance et vitesse"
      },
      
      // Prochaines courses
      upcomingRaces: horse.isActive ? [
        {
          date: "2025-08-30",
          raceName: "Grand Prix de Tunis",
          distance: "1800m",
          prize: "50000 TND",
          status: "Inscrit"
        },
        {
          date: "2025-09-15",
          raceName: "Prix National",
          distance: "2000m", 
          prize: "75000 TND",
          status: "En attente"
        }
      ] : []
    };

    return json({ horse: enrichedHorse });

  } catch (error) {
    console.error('Erreur:', error);
    throw new Response("Erreur lors du chargement", { status: 500 });
  }
};

export default function HorseDetail() {
  const { horse } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              to="/dashboard/horses"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour aux chevaux</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du cheval */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Photo et informations principales */}
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-4xl font-bold text-amber-700 mb-4">
                  {horse.name.charAt(0)}
                </div>
                <div className="text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    horse.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {horse.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Détails principaux */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{horse.name}</h1>
                    <p className="text-lg text-gray-600 mb-1">{horse.breed} • {horse.age} ans</p>
                    <p className="text-gray-600">{horse.gender} • {horse.color}</p>
                    <p className="text-sm text-gray-500 mt-1">N° {horse.registrationNumber}</p>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 text-right">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      Rating: {horse.performance.rating}
                    </div>
                    <div className="text-sm text-gray-500">
                      Gains: {horse.performance.earnings.toLocaleString()} TND
                    </div>
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{horse.performance.victories}</div>
                    <div className="text-sm text-gray-600">Victoires</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{horse.performance.totalRaces}</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{horse.performance.winRate}%</div>
                    <div className="text-sm text-gray-600">Taux de réussite</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{horse.performance.podiums}</div>
                    <div className="text-sm text-gray-600">Podiums</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille d'informations détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Propriétaire */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Propriétaire</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900">{horse.owner.name}</div>
                <div className="text-sm text-gray-500">Depuis {horse.owner.since}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Contact</div>
                <div className="text-sm text-gray-900">{horse.owner.contact}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Adresse</div>
                <div className="text-sm text-gray-900">{horse.owner.address}</div>
              </div>
            </div>
          </div>

          {/* Entraîneur */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Entraîneur</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900">{horse.trainer.name}</div>
                <div className="text-sm text-gray-500">{horse.trainer.specialty}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Expérience</div>
                <div className="text-sm text-gray-900">{horse.trainer.experience}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Victoires</div>
                <div className="text-sm text-gray-900">{horse.trainer.victories} courses gagnées</div>
              </div>
            </div>
          </div>

          {/* Jockey */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Jockey</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-gray-900">{horse.jockey.name}</div>
                <div className="text-sm text-gray-500">Poids: {horse.jockey.weight}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Expérience</div>
                <div className="text-sm text-gray-900">{horse.jockey.experience}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Victoires</div>
                <div className="text-sm text-gray-900">{horse.jockey.victories} courses gagnées</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations médicales et d'entraînement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Suivi médical */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Stethoscope className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Suivi Médical</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className={`font-medium ${horse.medical.status === 'Excellent' ? 'text-green-600' : 'text-red-600'}`}>
                  {horse.medical.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dernier contrôle:</span>
                <span className="text-gray-900">{new Date(horse.medical.lastCheck).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vaccinations:</span>
                <span className="text-green-600">{horse.medical.vaccinations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prochain contrôle:</span>
                <span className="text-gray-900">{new Date(horse.medical.nextCheck).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vétérinaire:</span>
                <span className="text-gray-900">{horse.medical.veterinarian}</span>
              </div>
            </div>
          </div>

          {/* Programme d'entraînement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Entraînement</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-gray-600 mb-1">Programme actuel</div>
                <div className="text-gray-900">{horse.training.schedule}</div>
              </div>
              {horse.training.nextSession && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Prochaine séance:</span>
                  <span className="text-gray-900">
                    {new Date(horse.training.nextSession).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(horse.training.nextSession).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Lieu:</span>
                <span className="text-gray-900">{horse.training.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Focus:</span>
                <span className="text-gray-900">{horse.training.focus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des courses et prochaines courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Courses récentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Courses Récentes</h3>
            </div>
            <div className="space-y-4">
              {horse.recentRaces.map((race, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{race.raceName}</div>
                      <div className="text-sm text-gray-600">{new Date(race.date).toLocaleDateString('fr-FR')} • {race.distance}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      race.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                      race.position === 2 ? 'bg-gray-100 text-gray-800' :
                      race.position === 3 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {race.position}ème
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Temps: {race.time}</span>
                    <span>Prix: {race.prize}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prochaines courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Prochaines Courses</h3>
            </div>
            {horse.upcomingRaces.length > 0 ? (
              <div className="space-y-4">
                {horse.upcomingRaces.map((race, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{race.raceName}</div>
                        <div className="text-sm text-gray-600">{new Date(race.date).toLocaleDateString('fr-FR')} • {race.distance}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm font-medium ${
                        race.status === 'Inscrit' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {race.status}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Prix: {race.prize}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune course programmée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
