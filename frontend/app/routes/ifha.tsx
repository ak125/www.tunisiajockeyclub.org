import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Trophy, Star, TrendingUp, Globe, Award, Calculator, type LucideIcon } from 'lucide-react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Mock data pour IFHA
    const ifhaData = {
      title: "International Federation of Horseracing Authorities",
      description: "Standards internationaux pour les courses hippiques",
      stats: {
        countries: 65,
        ratingSystem: "IFHA Rating",
        tunisiaRating: "Membre associé",
        lastUpdate: "2025-08-29"
      },
      features: [
        {
          title: "Rating International",
          description: "Système de notation unifié mondial",
          icon: "Star" as const
        },
        {
          title: "Standards Qualité",
          description: "Normes internationales pour les courses",
          icon: "Award" as const
        },
        {
          title: "Reconnaissance Mondiale",
          description: "Certification internationale des performances",
          icon: "Globe" as const
        }
      ]
    };

    return json({
      ifha: ifhaData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return json({
      ifha: {
        title: "IFHA - International Federation",
        description: "Standards internationaux hippiques",
        stats: {
          countries: 65,
          ratingSystem: "IFHA Rating",
          tunisiaRating: "Membre associé",
          lastUpdate: "2025-08-29"
        },
        features: []
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export default function IFHAPage() {
  const { ifha } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Header IFHA */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl font-bold mb-4">{ifha.title}</h1>
            <p className="text-xl text-blue-100 mb-6">{ifha.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">{ifha.stats.countries}</div>
                <div className="text-sm text-blue-100">Pays Membres</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">Rating IFHA</div>
                <div className="text-sm text-blue-100">Système International</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">Tunisie</div>
                <div className="text-sm text-blue-100">{ifha.stats.tunisiaRating}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fonctionnalités IFHA */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Standards IFHA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {ifha.features.map((feature, index) => {
              const IconComponent = feature.icon === "Star" ? Star : feature.icon === "Award" ? Award : Globe;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <IconComponent className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Actions Tunisia Jockey Club */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              Tunisia Jockey Club - Conformité IFHA
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Système de rating certifié IFHA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Standards internationaux appliqués</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Reconnaissance mondiale</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Performance tracking</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/rating" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculateur Rating IFHA
              </Link>
              <Link 
                to="/dashboard/analytics" 
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics Conformité
              </Link>
              <Link 
                to="/dashboard" 
                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Retour Dashboard
              </Link>
            </div>
          </div>

          {/* Informations Techniques */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Techniques</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Rating IFHA</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Le système de rating IFHA permet une comparaison internationale des performances équines.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Échelle de 0 à 140+</li>
                  <li>• Mise à jour continue</li>
                  <li>• Reconnaissance mondiale</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tunisia Jockey Club</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Membre associé IFHA avec certification des standards internationaux.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Courses certifiées IFHA</li>
                  <li>• Rating internationalement reconnu</li>
                  <li>• Standards de qualité appliqués</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}