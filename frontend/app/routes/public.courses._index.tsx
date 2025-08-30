import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Calendar, Clock, MapPin, Users, Trophy, Star } from "lucide-react";

export async function loader() {
  // En production, récupérer les données depuis l'API
  const upcomingRaces = [
    {
      id: '1',
      name: 'Prix de Carthage',
      date: '2025-08-30',
      time: '15:30',
      venue: 'Hippodrome de Tunis',
      category: 'Groupe I',
      distance: '2400m',
      prize: '50,000 TND',
      participants: 12,
      surface: 'Turf',
      weather: 'Ensoleillé',
      description: 'Course prestigieuse ouverte aux chevaux de 4 ans et plus.'
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
      participants: 15,
      surface: 'Turf',
      weather: 'Partiellement nuageux',
      description: 'Course de vitesse pour chevaux de 3 ans.'
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
      participants: 10,
      surface: 'Turf',
      weather: 'Beau temps',
      description: 'Course d\'endurance dans le cadre du festival d\'automne.'
    }
  ];

  const featuredRace = upcomingRaces[0]; // Course à la une

  return json({ upcomingRaces, featuredRace });
}

export default function PublicRaces() {
  const { upcomingRaces, featuredRace } = useLoaderData<typeof loader>();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Groupe II': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Groupe III': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Listed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏇 Programme des Courses
        </h1>
        <p className="text-xl text-gray-600">
          Découvrez les prochaines courses hippiques en Tunisie
        </p>
      </div>

      {/* Course à la une */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-xl">
          <div className="p-8 text-white">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-blue-100">COURSE À LA UNE</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">{featuredRace.name}</h2>
                <p className="text-blue-100 mb-6">{featuredRace.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">Date</div>
                      <div className="font-semibold">{new Date(featuredRace.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">Heure</div>
                      <div className="font-semibold">{featuredRace.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">Lieu</div>
                      <div className="font-semibold">{featuredRace.venue}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">Dotation</div>
                      <div className="font-semibold">{featuredRace.prize}</div>
                    </div>
                  </div>
                </div>
                
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Voir les Détails
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Informations de Course</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Catégorie</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(featuredRace.category).replace('text-', 'text-').replace('bg-', 'bg-white/20 text-')}`}>
                      {featuredRace.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Distance</span>
                    <span className="font-semibold">{featuredRace.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Participants</span>
                    <span className="font-semibold">{featuredRace.participants} chevaux</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Surface</span>
                    <span className="font-semibold">{featuredRace.surface}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Météo</span>
                    <span className="font-semibold">{featuredRace.weather}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des courses */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Prochaines Courses</h2>
        
        <div className="grid gap-6">
          {upcomingRaces.map((race) => (
            <div key={race.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{race.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(race.category)}`}>
                        {race.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{race.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                          <div className="font-medium text-gray-900">{race.participants} chevaux</div>
                          <div>{race.distance}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Trophy className="w-4 h-4 mr-2" />
                        <div className="font-medium text-gray-900">{race.prize}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Link 
                      to={`/public/courses/${race.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Voir Détails
                    </Link>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                      Participants
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Envie de Participer ?</h2>
          <p className="text-gray-600 mb-6">
            Inscrivez vos chevaux aux prochaines courses et rejoignez l'élite hippique tunisienne
          </p>
          <Link 
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Inscription Membre
          </Link>
        </div>
      </div>
    </div>
  );
}
