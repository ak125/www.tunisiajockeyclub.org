import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Trophy, TrendingUp, Calendar, Activity, Target } from "lucide-react";
import { createSecureLoader } from "../utils/auth.server";

export const loader = createSecureLoader(async ({ context }) => {
  // En production, récupérer les chevaux appartenant à l'utilisateur
  const userHorses = [
    {
      id: '1',
      name: 'Thunder Strike',
      currentRating: 88,
      previousRating: 85,
      trend: '+3',
      confidence: 85,
      lastRace: '2025-08-25',
      nextRace: '2025-09-02',
      raceName: 'Prix de Carthage',
      conversions: {
        france: 79.2,
        uk: 174.4,
        ifha: 75.1
      },
      performances: [
        { date: '2025-08-25', race: 'Prix des Jasmins', position: 1, rating: 88 },
        { date: '2025-08-18', race: 'Prix de La Marsa', position: 2, rating: 85 },
        { date: '2025-08-10', race: 'Prix de Sidi Bou Said', position: 3, rating: 83 }
      ]
    },
    {
      id: '2',
      name: 'Desert Wind',
      currentRating: 82,
      previousRating: 84,
      trend: '-2',
      confidence: 78,
      lastRace: '2025-08-20',
      nextRace: '2025-09-05',
      raceName: 'Prix des Oliviers',
      conversions: {
        france: 73.8,
        uk: 162.4,
        ifha: 69.7
      },
      performances: [
        { date: '2025-08-20', race: 'Prix de Sidi Bou Said', position: 3, rating: 82 },
        { date: '2025-08-15', race: 'Prix de Tunis', position: 2, rating: 84 },
        { date: '2025-08-08', race: 'Prix des Roses', position: 1, rating: 86 }
      ]
    }
  ];

  const memberStats = {
    totalHorses: userHorses.length,
    averageRating: Math.round(userHorses.reduce((sum, horse) => sum + horse.currentRating, 0) / userHorses.length),
    bestRating: Math.max(...userHorses.map(h => h.currentRating)),
    improvingHorses: userHorses.filter(h => h.trend.startsWith('+')).length
  };

  return json({
    user: context.user,
    userHorses,
    memberStats
  });
}, { requireAuth: true, minRole: 'MEMBER' });

export default function MemberHorses() {
  const { user, userHorses, memberStats } = useLoaderData<typeof loader>();

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-yellow-600 bg-yellow-50';
    if (rating >= 85) return 'text-orange-600 bg-orange-50';
    if (rating >= 80) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend.startsWith('-')) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Chevaux et leurs Ratings
        </h1>
        <p className="text-gray-600">
          Suivez les performances et les ratings IFHA de vos chevaux, {user?.name?.split(' ')[0]}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{memberStats.totalHorses}</div>
          <div className="text-sm text-gray-600">Mes Chevaux</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{memberStats.bestRating}</div>
          <div className="text-sm text-gray-600">Meilleur Rating</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{memberStats.averageRating}</div>
          <div className="text-sm text-gray-600">Rating Moyen</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{memberStats.improvingHorses}</div>
          <div className="text-sm text-gray-600">En Progression</div>
        </div>
      </div>

      {/* Liste des Chevaux */}
      <div className="grid gap-8">
        {userHorses.map((horse) => (
          <div key={horse.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
            
            {/* En-tête du Cheval */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{horse.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Dernière course: {new Date(horse.lastRace).toLocaleDateString('fr-FR')}</span>
                    {horse.nextRace && (
                      <>
                        <span>•</span>
                        <span>Prochaine: {new Date(horse.nextRace).toLocaleDateString('fr-FR')}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-3xl font-bold px-3 py-1 rounded ${getRatingColor(horse.currentRating)}`}>
                      {horse.currentRating}
                    </span>
                    {getTrendIcon(horse.trend)}
                    <span className={`text-sm font-medium ${
                      horse.trend.startsWith('+') ? 'text-green-600' : 
                      horse.trend.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {horse.trend}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Précédent: {horse.previousRating}
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-2">Confiance:</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{width: `${horse.confidence}%`}}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{horse.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Conversions IFHA */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Conversions Internationales
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(horse.conversions).map(([scale, rating]) => {
                      const scaleNames = {
                        france: 'France (Handicap)',
                        uk: 'UK (BHA)',
                        ifha: 'IFHA International'
                      };
                      
                      return (
                        <div key={scale} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            {scaleNames[scale as keyof typeof scaleNames]}
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {rating}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Historique des Performances */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Performances Récentes
                  </h3>
                  <div className="space-y-3">
                    {horse.performances.map((perf, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{perf.race}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(perf.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            perf.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                            perf.position === 2 ? 'bg-gray-100 text-gray-800' :
                            perf.position === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {perf.position === 1 ? '1ère' : perf.position === 2 ? '2ème' : perf.position === 3 ? '3ème' : `${perf.position}ème`}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Rating: {perf.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prochaine Course */}
            {horse.nextRace && (
              <div className="px-6 pb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Prochaine Course</span>
                  </div>
                  <div className="text-lg font-semibold text-blue-900">
                    {horse.raceName}
                  </div>
                  <div className="text-sm text-blue-700">
                    {new Date(horse.nextRace).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Information */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 À Propos des Ratings IFHA
        </h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Les ratings IFHA sont calculés selon les standards internationaux et permettent de comparer 
            les performances de vos chevaux avec ceux du monde entier.
          </p>
          <p>
            <strong>Niveaux de Rating:</strong> Elite (90+) • Excellent (85-89) • Très Bon (80-84) • Bon (75-79) • Standard (&lt;75)
          </p>
          <p>
            Les conversions vous permettent de voir comment vos chevaux se classent selon différents systèmes internationaux.
          </p>
        </div>
      </div>
    </div>
  );
}
