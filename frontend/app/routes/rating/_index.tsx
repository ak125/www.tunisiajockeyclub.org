import { Link } from "@remix-run/react";
import { Calculator, BookOpen, TestTube, TrendingUp, Trophy, Star } from "lucide-react";

export default function RatingIndex() {
  const features = [
    {
      icon: Calculator,
      title: "Calcul de Rating",
      description: "Système de notation des chevaux selon la méthode officielle tunisienne",
      link: "/rating/calculate",
      color: "bg-blue-500",
      available: false
    },
    {
      icon: BookOpen,
      title: "Réglementation",
      description: "Guide complet sur la méthodologie de calcul des ratings",
      link: "/rating/reglementation",
      color: "bg-green-500",
      available: true
    },
    {
      icon: TestTube,
      title: "Test API",
      description: "Interface de test pour les endpoints de l'API rating",
      link: "/rating/test",
      color: "bg-purple-500",
      available: true
    },
    {
      icon: TrendingUp,
      title: "Statistiques",
      description: "Analyse des performances et évolution des ratings",
      link: "/rating/statistics",
      color: "bg-orange-500",
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Système de Rating TJC
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Système de notation des chevaux basé sur la méthodologie officielle tunisienne, 
              adaptée des standards du Galop français
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const cardClasses = feature.available 
              ? "group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              : "group bg-white rounded-xl shadow-md overflow-hidden opacity-75 cursor-not-allowed";
            
            const content = (
              <div className="p-6">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {feature.description}
                </p>
                {!feature.available && (
                  <span className="text-xs text-gray-500 italic">
                    (Prochainement)
                  </span>
                )}
              </div>
            );

            return feature.available ? (
              <Link
                key={index}
                to={feature.link}
                className={cardClasses}
              >
                {content}
              </Link>
            ) : (
              <div key={index} className={cardClasses}>
                {content}
              </div>
            );
          })}
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Methodology */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-6">
              <Star className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Méthodologie
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                Le système de rating TJC utilise une approche scientifique pour évaluer 
                les performances des chevaux de course.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Base de calcul : 50 points pour les chevaux débutants</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Ajustements selon les performances et conditions de course</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Facteurs d'âge et de développement physique</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Historique des performances sur différentes distances</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Aperçu du Système
              </h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">50</div>
                  <div className="text-sm text-gray-600">Rating initial</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">120+</div>
                  <div className="text-sm text-gray-600">Champions</div>
                </div>
              </div>
              <div className="text-gray-600">
                <p>
                  Le système permet un suivi précis de l'évolution des performances 
                  et facilite les comparaisons entre chevaux de différents niveaux.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Actions Rapides
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/rating/reglementation"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Consulter la Réglementation
            </Link>
            <Link
              to="/rating/test"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              Tester l'API
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
