import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { 
  Book, Scale, Target, Award, Globe, FileText, 
  ArrowLeft, Download, ExternalLink, AlertTriangle,
  CheckCircle, Info
} from 'lucide-react';
import { requirePermission, Permission } from '../utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Vérifier les permissions pour accéder aux règlements
  await requirePermission(request, Permission.RATING);

  // Récupération des données de réglementation (simulées pour l'instant)
  return json({
    lastUpdated: '2025-08-30T10:00:00Z',
    version: '2025.2',
    regulations: {
      general: {
        title: 'Règlement Général IFHA',
        sections: [
          { id: 'principles', title: 'Principes généraux', items: 12 },
          { id: 'methodology', title: 'Méthodologie', items: 8 },
          { id: 'classification', title: 'Classification des courses', items: 15 },
          { id: 'handicapping', title: 'Handicap', items: 10 }
        ]
      },
      rating: {
        title: 'Système de Rating',
        sections: [
          { id: 'calculation', title: 'Méthodes de calcul', items: 18 },
          { id: 'adjustments', title: 'Ajustements autorisés', items: 22 },
          { id: 'validation', title: 'Processus de validation', items: 7 },
          { id: 'appeals', title: 'Procédure d\'appel', items: 5 }
        ]
      },
      international: {
        title: 'Standards Internationaux',
        sections: [
          { id: 'ifha-standards', title: 'Standards IFHA', items: 25 },
          { id: 'country-specific', title: 'Adaptations nationales', items: 12 },
          { id: 'data-exchange', title: 'Échange de données', items: 8 },
          { id: 'certification', title: 'Certification', items: 6 }
        ]
      }
    }
  });
}

export default function DashboardRatingsReglementation() {
  const { lastUpdated, version, regulations } = useLoaderData<typeof loader>();

  const regulationData = {
    general: {
      icon: <Scale className="h-5 w-5" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      description: 'Fondements et principes du système de rating hippique international'
    },
    rating: {
      icon: <Target className="h-5 w-5" />,
      color: 'bg-green-50 border-green-200 text-green-800',
      description: 'Méthodes de calcul, ajustements et processus de validation des ratings'
    },
    international: {
      icon: <Globe className="h-5 w-5" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      description: 'Standards internationaux IFHA et procédures de certification'
    }
  };

  const keyRegulations = [
    {
      title: 'Calcul du Rating de Base',
      description: 'Un cheval obtient son rating initial basé sur sa première performance officielle dans une course classée.',
      type: 'fundamental',
      article: 'Art. 4.2.1'
    },
    {
      title: 'Ajustements de Distance',
      description: 'Les ajustements de distance suivent la table officielle IFHA pour maintenir la cohérence internationale.',
      type: 'technical',
      article: 'Art. 6.1.3'
    },
    {
      title: 'Validation des Handicapeurs',
      description: 'Tous les ratings doivent être validés par au moins deux handicapeurs certifiés IFHA.',
      type: 'procedural',
      article: 'Art. 8.3.2'
    },
    {
      title: 'Procédure d\'Appel',
      description: 'Les propriétaires disposent de 14 jours pour contester un rating via la procédure officielle.',
      type: 'procedural',
      article: 'Art. 12.1.1'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fundamental': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'technical': return <Target className="h-4 w-4 text-blue-600" />;
      case 'procedural': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Link to="/dashboard/ratings" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Réglementation IFHA</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Documentation officielle et standards internationaux • Version {version} • 
            Mise à jour: {new Date(lastUpdated).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Télécharger PDF</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Site IFHA</span>
          </button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Book className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Vue d'ensemble</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(regulations).map(([key, regulation]) => {
            const config = regulationData[key as keyof typeof regulationData];
            return (
              <div key={key} className={`p-4 rounded-lg border ${config.color}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {config.icon}
                  <h3 className="font-medium">{regulation.title}</h3>
                </div>
                <p className="text-sm mb-3 opacity-90">
                  {config.description}
                </p>
                <div className="space-y-1">
                  {regulation.sections.map((section) => (
                    <div key={section.id} className="flex justify-between text-sm">
                      <span>{section.title}</span>
                      <span className="font-medium">{section.items} art.</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Articles clés */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-medium text-gray-900">Articles Clés</h2>
        </div>

        <div className="space-y-4">
          {keyRegulations.map((regulation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                {getTypeIcon(regulation.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{regulation.title}</h3>
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {regulation.article}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {regulation.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ressources supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guides pratiques */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Guides Pratiques</h3>
          </div>
          
          <div className="space-y-3">
            <button className="block w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Guide du Handicapeur</h4>
                  <p className="text-sm text-gray-600">Procédures de calcul et validation</p>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>
            </button>
            
            <button className="block w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Tables d'Ajustement</h4>
                  <p className="text-sm text-gray-600">Distance, piste, conditions</p>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>
            </button>
            
            <button className="block w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Procédures d'Appel</h4>
                  <p className="text-sm text-gray-600">Contestation et révision</p>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Formations et certifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Formation & Certification</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Certification Handicapeur</h4>
              <p className="text-sm text-blue-700 mb-2">
                Programme officiel IFHA pour devenir handicapeur certifié
              </p>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                En savoir plus
              </button>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Formation Continue</h4>
              <p className="text-sm text-green-700 mb-2">
                Mise à jour des connaissances et nouvelles méthodes
              </p>
              <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                Consulter le planning
              </button>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-1">Webinaires IFHA</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Sessions en ligne sur les évolutions réglementaires
              </p>
              <button className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mises à jour récentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-medium text-gray-900">Mises à Jour Récentes</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Version 2025.2 - 30 Août 2025</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Nouvelles tables d'ajustement pour les courses sur sable et mise à jour des procédures d'appel international.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Version 2025.1 - 15 Juin 2025</h4>
              <p className="text-sm text-blue-800 mt-1">
                Harmonisation des standards européens et ajout de nouvelles classifications pour les courses d'obstacles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
