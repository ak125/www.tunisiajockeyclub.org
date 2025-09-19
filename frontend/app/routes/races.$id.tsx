import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Calendar, Clock, MapPin, Users, Trophy, Medal, Target } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const courseId = params.id;
    
    // Récupérer les détails de la course
    const courseResponse = await fetch(`http://localhost:3000/api/courses/${courseId}`);
    const courseData = courseResponse.ok ? await courseResponse.json() : null;
    
    // Pour les courses Ben Guerdane, récupérer aussi les résultats via notre système
    let results = [];
    if (courseData && courseData.status === 'finished') {
      try {
        // Simuler des résultats basés sur nos données injectées
        if (courseId === '5cad9ca2-a417-4b5d-8500-d4636e0f8e55' || courseId === 'bg-001') {
          // Course JEKITIS
          results = [
            { position: 1, horseName: "RITEL", jockeyName: "Non spécifié", time: "1'37''", gap: "Gagnant" },
            { position: 2, horseName: "RAGHEB", jockeyName: "Non spécifié", time: null, gap: "3L" },
            { position: 3, horseName: "REMETH NAGHAM", jockeyName: "Non spécifié", time: null, gap: "5L" },
            { position: 4, horseName: "REMETT CHARGUI", jockeyName: "Non spécifié", time: null, gap: "Loin" },
            { position: 5, horseName: "RIGEB", jockeyName: "M. Jallagi", time: null, gap: "6L" },
            { position: 6, horseName: "RIJOU", jockeyName: "Non spécifié", time: null, gap: "1L" }
          ];
        } else if (courseId === '7e55a3a9-90c2-41c3-b411-4494b9b519af' || courseId === 'bg-002') {
          // Course CHOUCHA
          results = [
            { position: 1, horseName: "Rahib Albadeia", jockeyName: "S. Khaouar", time: "2'10''", gap: "Gagnant" },
            { position: 2, horseName: "Razane", jockeyName: "Seif Daas", time: null, gap: "Loin" },
            { position: 3, horseName: "Rafaan", jockeyName: "MOU. Mechi", time: null, gap: "4L" },
            { position: 4, horseName: "Ragouj", jockeyName: "W.B. Kraiem", time: null, gap: "Loin" },
            { position: 5, horseName: "Ramaz Al Hosn", jockeyName: "M.A. Bouchnib", time: null, gap: "6L" },
            { position: 6, horseName: "Rabeb El Ezz", jockeyName: "M. Am Allagui", time: null, gap: "Loin" }
          ];
        }
      } catch (error) {
        console.error('Erreur lors du chargement des résultats:', error);
      }
    }
    
    return json({
      course: courseData,
      results: results
    });
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la course:', error);
    throw new Response("Course non trouvée", { status: 404 });
  }
}

export default function CourseDetail() {
  const { course, results } = useLoaderData<typeof loader>();

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course non trouvée</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Retour aux courses
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Groupe I': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Groupe II': return 'bg-orange-100 text-orange-800 border-orange-200'; 
      case 'Groupe III': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Listed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pur Sang Arabe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'finished': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionMedal = (position: number) => {
    switch (position) {
      case 1: return <Medal className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-yellow-600" />;
      default: return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🏇</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Tunisia Jockey Club</h1>
                  <p className="text-sm text-gray-600">Détails de la course</p>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Accueil</Link>
              <Link to="/courses" className="text-blue-600 font-medium">Courses</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/courses" className="text-blue-600 hover:underline">
            ← Retour aux courses
          </Link>
        </nav>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(course.category || '')}`}>
                  {course.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                  {course.status === 'scheduled' ? 'Programmée' : 
                   course.status === 'finished' ? 'Terminée' : 
                   course.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.name}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(course.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {new Date(course.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {course.racecourse?.name}
                </span>
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {course.participantCount || course.maxRunners || 0} participants
                </span>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {course.prizeMoney ? `${course.prizeMoney.toLocaleString()} TND` : 'Prix non défini'}
              </div>
              <p className="text-gray-600">Prix total</p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Informations de la course
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Distance:</span>
                  <span className="text-gray-900">{course.distance || course.distanceMeters}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Hippodrome:</span>
                  <span className="text-gray-900">{course.racecourse?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Localisation:</span>
                  <span className="text-gray-900">{course.racecourse?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Type de course:</span>
                  <span className="text-gray-900">{course.raceType || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Numéro de course:</span>
                  <span className="text-gray-900">Course {course.raceNumber}</span>
                </div>
                {course.conditions && (
                  <div className="pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Conditions:</span>
                    <p className="text-gray-900 mt-2">{course.conditions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📊 Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants max:</span>
                  <span className="font-bold text-gray-900">{course.maxRunners || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inscrits:</span>
                  <span className="font-bold text-green-600">{course.participantCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dotation:</span>
                  <span className="font-bold text-green-600">{course.prizeMoney?.toLocaleString() || 'TBD'} TND</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🏆 Résultats Officiels
            </h2>
            
            {/* Podium */}
            {results.length >= 3 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🥇 Podium</h3>
                <div className="flex justify-center items-end space-x-4 mb-8">
                  {/* 2e place */}
                  <div className="text-center">
                    <div className="bg-gray-100 h-24 w-32 rounded-t-lg flex items-end justify-center pb-2">
                      <Medal className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="bg-gray-200 p-3 rounded-b-lg">
                      <div className="text-lg font-bold text-gray-900">{results[1].horseName}</div>
                      <div className="text-sm text-gray-600">{results[1].jockeyName}</div>
                      <div className="text-xs text-gray-500">{results[1].gap}</div>
                    </div>
                  </div>
                  
                  {/* 1ère place */}
                  <div className="text-center">
                    <div className="bg-yellow-100 h-32 w-36 rounded-t-lg flex items-end justify-center pb-2">
                      <Medal className="h-10 w-10 text-yellow-500" />
                    </div>
                    <div className="bg-yellow-200 p-4 rounded-b-lg">
                      <div className="text-xl font-bold text-gray-900">{results[0].horseName}</div>
                      <div className="text-sm text-gray-600">{results[0].jockeyName}</div>
                      <div className="text-lg font-bold text-green-600">{results[0].time || 'Gagnant'}</div>
                    </div>
                  </div>
                  
                  {/* 3e place */}
                  <div className="text-center">
                    <div className="bg-orange-100 h-20 w-32 rounded-t-lg flex items-end justify-center pb-2">
                      <Medal className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="bg-orange-200 p-3 rounded-b-lg">
                      <div className="text-lg font-bold text-gray-900">{results[2].horseName}</div>
                      <div className="text-sm text-gray-600">{results[2].jockeyName}</div>
                      <div className="text-xs text-gray-500">{results[2].gap}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Full Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Position</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cheval</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Jockey</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Temps</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Écart</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className={`border-b hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getPositionMedal(result.position)}
                          <span className="font-bold text-lg">{result.position}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{result.horseName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-700">{result.jockeyName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono text-green-600 font-bold">
                          {result.time || '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600">{result.gap}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {course.status === 'scheduled' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Course programmée</h3>
            <p className="text-gray-600">Les résultats seront disponibles après la course.</p>
          </div>
        )}
      </div>
    </div>
  );
}
