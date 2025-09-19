import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  ArrowRight,
  Star,
  Zap,
  Crown,
  Sparkles,
  Eye,
  BarChart3,
  Activity,
  DollarSign,
  Target,
  Globe,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

export async function loader() {
  try {
    // Récupérer les données des courses depuis l'API
    const response = await fetch('http://localhost:3000/api/courses');
    const data = response.ok ? await response.json() : { courses: [] };
    
    return json({
      courses: data.courses || []
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return json({
      courses: []
    });
  }
}

export default function HomePage() {
  const { courses } = useLoaderData<typeof loader>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const metricTimer = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(metricTimer);
  }, []);
  
  const finishedCourses = courses.filter(race => race.status === 'finished');
  const upcomingCourses = courses.filter(race => race.status === 'scheduled');

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

  const eliteMetrics = [
    { label: "Chevaux Elite", value: "156", icon: Activity, color: "text-green-600", trend: "+12%" },
    { label: "Jockeys Pro", value: "89", icon: Users, color: "text-blue-600", trend: "+8%" },
    { label: "Revenus 2024", value: "4.8M DT", icon: DollarSign, color: "text-purple-600", trend: "+15%" },
    { label: "Courses Elite", value: "42", icon: Trophy, color: "text-orange-600", trend: "+22%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section Premium */}
      <section className="relative bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu principal */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-yellow-300" />
                  <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                    Elite Equestrian Platform
                  </span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
                  Tunisia Jockey Club
                  <span className="block text-yellow-300 text-2xl sm:text-3xl mt-2">
                    Centre d'Excellence Hippique
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  Depuis 1888, nous incarnons l'excellence hippique tunisienne avec des technologies de pointe et une expertise reconnue internationalement.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/horses/advanced"
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Découvrir nos Chevaux Elite</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/statistics/advanced"
                  className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all flex items-center space-x-2"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics BI</span>
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Tunis, Tunisie</span>
                  <span className="font-mono">{currentTime.toLocaleTimeString('fr-TN')}</span>
                </div>
              </div>
            </div>

            {/* Métriques en temps réel */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span>Performance Live</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {eliteMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className={`p-4 rounded-xl transition-all duration-500 ${
                          activeMetric === index
                            ? 'bg-white/20 border-2 border-yellow-300 scale-105'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${metric.color} mb-2`} />
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm opacity-80">{metric.label}</div>
                        <div className="text-xs text-green-300 mt-1">{metric.trend}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-300" />
                  <div>
                    <div className="font-semibold">Certification IFHA</div>
                    <div className="text-sm opacity-80">Système de Rating International</div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Actif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section avec navigation vers les fonctionnalités avancées */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Fonctionnalités Avancées</h3>
            <p className="text-gray-600">Découvrez nos nouveaux outils de gestion et d'analyse</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link 
              to="/horses/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-green-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🐎</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Chevaux Elite</h4>
                <p className="text-gray-600 text-sm">Profils détaillés avec analytics avancées</p>
                <div className="mt-4 text-green-600 font-medium group-hover:text-green-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/jockeys/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">🏇</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Jockeys Champions</h4>
                <p className="text-gray-600 text-sm">Statistiques pros et analyses de performance</p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/statistics/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Business Intelligence</h4>
                <p className="text-gray-600 text-sm">Tableaux de bord avancés et analytics</p>
                <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/home/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-yellow-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <span className="text-2xl">🏠</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Hub Premium</h4>
                <p className="text-gray-600 text-sm">Centre de contrôle intégré avec KPIs</p>
                <div className="mt-4 text-yellow-600 font-medium group-hover:text-yellow-700">
                  Découvrir →
                </div>
              </div>
            </Link>

            <Link 
              to="/races/advanced"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:border-orange-200"
            >
              <div className="text-center relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  NOUVEAU
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl">🏃‍♂️</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Courses Avancées</h4>
                <p className="text-gray-600 text-sm">Gestion complète des courses avec analytics</p>
                <div className="mt-4 text-orange-600 font-medium group-hover:text-orange-700">
                  Découvrir →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Section Excellence Hippique */}
        <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16 mb-16 rounded-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Excellence Hippique Tunisienne
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Un héritage de plus de 135 ans d'expertise équestre, combinant tradition et innovation technologique
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Patrimoine Historique</h3>
                <p className="text-gray-600 mb-6">
                  Depuis 1888, le Tunisia Jockey Club perpétue les traditions hippiques avec une expertise reconnue dans tout le Maghreb.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Fondé en 1888
                  </span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation Technologique</h3>
                <p className="text-gray-600 mb-6">
                  Système IFHA de rating international, analytics avancées et technologies de pointe pour l'excellence équestre.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Technologie 2024
                  </span>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Rayonnement International</h3>
                <p className="text-gray-600 mb-6">
                  Reconnaissance IFHA, partenariats internationaux et participation aux grands événements hippiques mondiaux.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Certification IFHA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Results Section */}
        {finishedCourses.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                🏆 Derniers Résultats
              </h3>
              <p className="text-gray-600 text-lg">
                Les performances récentes de nos champions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {finishedCourses.slice(0, 6).map((race) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{race.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(race.category)}`}>
                      {race.category}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{race.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>{race.distance}m - {race.surface}</span>
                    </div>
                  </div>

                  {race.results && race.results.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Podium</h5>
                      <div className="space-y-2">
                        {race.results.slice(0, 3).map((result, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="font-medium">{result.horse}</span>
                            </div>
                            <span className="text-sm text-gray-500">{result.jockey}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Races Section */}
        {upcomingCourses.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                📅 Prochaines Courses
              </h3>
              <p className="text-gray-600 text-lg">
                Les événements à venir dans votre calendrier hippique
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingCourses.slice(0, 6).map((race) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">{race.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(race.category)}`}>
                      {race.category}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(race.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{race.time || '15:00'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{race.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>{race.distance}m - {race.surface}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{race.participants || 'TBA'} participants</span>
                    </div>
                    <Link 
                      to={`/races/${race.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      Détails
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-16 rounded-2xl text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Rejoignez l'Excellence Hippique Tunisienne
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Découvrez notre écosystème complet : formations, événements, et technologies de pointe
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/dashboard"
                className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center"
              >
                <Eye className="h-5 w-5 mr-2" />
                Accéder au Dashboard
              </Link>
              <Link 
                to="/rating"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all flex items-center"
              >
                <Target className="h-5 w-5 mr-2" />
                Système Rating IFHA
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
