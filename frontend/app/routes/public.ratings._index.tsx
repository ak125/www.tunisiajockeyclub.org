import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Trophy, TrendingUp, Star, Calendar } from "lucide-react";

export async function loader() {
  // En production, récupérer les données depuis l'API
  const topRatedHorses = [
    { id: '1', name: 'OUARABI AL WALJD', rating: 92, trend: '+3', country: 'Tunisia', lastRace: '2024-03-15' },
    { id: '2', name: 'EMIR DE TUNISIE', rating: 88, trend: '+1', country: 'Tunisia', lastRace: '2024-03-10' },
    { id: '3', name: 'ROI DE CARTHAGE', rating: 85, trend: '0', country: 'Tunisia', lastRace: '2024-03-20' },
    { id: '4', name: 'DESERT CHAMPION', rating: 82, trend: '-2', country: 'Tunisia', lastRace: '2024-03-18' },
    { id: '5', name: 'GOLDEN ARROW', rating: 80, trend: '+4', country: 'Tunisia', lastRace: '2024-03-22' }
  ];

  const ratingStats = {
    totalHorses: 156,
    averageRating: 74.5,
    topRating: 92,
    activeRaces: 8
  };

  const ifhaInfo = {
    description: "L'International Federation of Horseracing Authorities (IFHA) établit les standards mondiaux pour l'évaluation des performances des chevaux de course.",
    scales: [
      { name: "IFHA International", range: "40-140", description: "Standard mondial unifié" },
      { name: "France (Handicap)", range: "20-120", description: "Système français traditionnel" },
      { name: "UK (BHA)", range: "80-180", description: "British Horseracing Authority" },
      { name: "UAE", range: "40-120", description: "Émirats Arabes Unis" }
    ]
  };

  return json({ topRatedHorses, ratingStats, ifhaInfo });
}

export default function PublicRatings() {
  const { topRatedHorses, ratingStats, ifhaInfo } = useLoaderData<typeof loader>();

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return 'text-yellow-600';
    if (rating >= 85) return 'text-orange-600';
    if (rating >= 80) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getRatingLevel = (rating: number) => {
    if (rating >= 90) return 'Elite';
    if (rating >= 85) return 'Excellent';
    if (rating >= 80) return 'Très Bon';
    if (rating >= 75) return 'Bon';
    return 'Standard';
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend.startsWith('-')) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏆 Classement IFHA International
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez les ratings officiels des chevaux selon les standards internationaux de l'IFHA
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{ratingStats.topRating}</div>
          <div className="text-sm text-gray-600">Meilleur Rating</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{ratingStats.averageRating}</div>
          <div className="text-sm text-gray-600">Rating Moyen</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{ratingStats.totalHorses}</div>
          <div className="text-sm text-gray-600">Chevaux Ratés</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{ratingStats.activeRaces}</div>
          <div className="text-sm text-gray-600">Courses Actives</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Classement Top Chevaux */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🏇 Top Chevaux - Rating IFHA
            </h2>
            
            <div className="space-y-4">
              {topRatedHorses.map((horse, index) => (
                <div 
                  key={horse.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{horse.name}</h3>
                      <p className="text-sm text-gray-600">
                        {horse.country} • Dernière course: {new Date(horse.lastRace).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-2xl font-bold ${getRatingColor(horse.rating)}`}>
                        {horse.rating}
                      </span>
                      {getTrendIcon(horse.trend)}
                      <span className={`text-sm ${
                        horse.trend.startsWith('+') ? 'text-green-600' : 
                        horse.trend.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {horse.trend}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRatingLevel(horse.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations IFHA */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 À Propos de l'IFHA
            </h2>
            
            <p className="text-gray-600 mb-6 text-sm">
              {ifhaInfo.description}
            </p>
            
            <h3 className="font-semibold text-gray-900 mb-3">Échelles de Rating:</h3>
            <div className="space-y-3">
              {ifhaInfo.scales.map((scale, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">{scale.name}</div>
                  <div className="text-xs text-gray-600 mb-1">Range: {scale.range}</div>
                  <div className="text-xs text-gray-500">{scale.description}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Niveaux de Rating</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700">Elite</span>
                  <span className="text-blue-600 font-mono">90+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Excellent</span>
                  <span className="text-orange-600 font-mono">85-89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Très Bon</span>
                  <span className="text-blue-600 font-mono">80-84</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Bon</span>
                  <span className="text-gray-600 font-mono">75-79</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard</span>
                  <span className="text-gray-500 font-mono">&lt;75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Découvrez Plus de Statistiques</h2>
          <p className="text-blue-100 mb-6">
            Explorez l'historique complet des performances et les analyses détaillées
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Voir Toutes les Statistiques
          </button>
        </div>
      </div>
    </div>
  );
}
