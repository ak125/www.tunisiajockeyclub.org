import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Calendar, Clock, Trophy, Users } from "lucide-react";

export async function loader() {
  // En production, récupérer les données depuis l'API
  const upcomingRaces = [
    { id: '1', name: 'Prix de Carthage', date: '2025-08-30', time: '15:30', participants: 12 },
    { id: '2', name: 'Prix de Tunis', date: '2025-09-02', time: '16:00', participants: 15 },
    { id: '3', name: 'Prix des Oliviers', date: '2025-09-05', time: '14:45', participants: 10 }
  ];

  const recentResults = [
    { race: 'Prix des Jasmins', winner: 'Thunder Strike', jockey: 'M. Ben Ali', date: '2025-08-25' },
    { race: 'Prix de Sidi Bou Said', winner: 'Desert Wind', jockey: 'S. Trabelsi', date: '2025-08-20' },
    { race: 'Prix de La Marsa', winner: 'Golden Arrow', jockey: 'A. Mansouri', date: '2025-08-18' }
  ];

  return json({ upcomingRaces, recentResults });
}

export default function PublicHome() {
  const { upcomingRaces, recentResults } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tunisia Jockey Club
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              L'excellence équestre depuis 1885
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/public/courses" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Voir les Courses
              </Link>
              <Link 
                to="/public/resultats" 
                className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Derniers Résultats
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">140+</h3>
              <p className="text-gray-600">Années d'Histoire</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">52</h3>
              <p className="text-gray-600">Courses par An</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">200+</h3>
              <p className="text-gray-600">Chevaux Enregistrés</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">85+</h3>
              <p className="text-gray-600">Jockeys Actifs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Races */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prochaines Courses</h2>
            <p className="text-gray-600">Ne manquez pas nos événements à venir</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingRaces.map((race, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{race.name}</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {race.participants} chevaux
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{race.time}</span>
                </div>
                <Link 
                  to={`/public/courses/${race.id}`} 
                  className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Voir les Détails
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/public/courses" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voir toutes les courses
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Results */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Derniers Résultats</h2>
            <p className="text-gray-600">Les gagnants des courses récentes</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recentResults.map((result, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{result.race}</h3>
                </div>
                <div className="mb-2">
                  <p className="text-gray-900 font-semibold text-lg">{result.winner}</p>
                  <p className="text-gray-600">Jockey: {result.jockey}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(result.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/public/resultats" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voir tous les résultats
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Une Tradition d'Excellence</h2>
              <p className="text-gray-300 mb-6">
                Fondé en 1885, le Tunisia Jockey Club est le premier club hippique de Tunisie. 
                Situé au cœur de Tunis, nous perpétuons une tradition d'excellence équestre 
                avec des installations modernes et des événements de classe internationale.
              </p>
              <p className="text-gray-300 mb-8">
                Notre piste de 2400 mètres accueille les meilleurs chevaux et jockeys de la région, 
                offrant un spectacle inoubliable aux amateurs de courses hippiques.
              </p>
              <Link 
                to="/login" 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Rejoignez-nous
              </Link>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Informations Pratiques</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-yellow-500" />
                  <span>Courses tous les weekends</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-yellow-500" />
                  <span>Ouverture: 14h00 - 18h00</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>Avenue Jugurtha, Cité Mahrajène</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
