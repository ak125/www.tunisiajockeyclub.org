import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useNavigation, Link } from '@remix-run/react';
import { 
  Calculator, RefreshCw, ArrowLeft, CheckCircle, AlertCircle,
  Users, Clock, BarChart3, Play, Target
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { requirePermission, Permission } from '../utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermission(request, Permission.RATING);

  try {
    // Récupérer tous les chevaux pour le calcul en masse
    const horsesResponse = await fetch('http://localhost:3000/api/horses/list');
    const ratingsResponse = await fetch('http://localhost:3000/api/ratings/list');
    
    const horses = horsesResponse.ok ? await horsesResponse.json() : { horses: [] };
    const existingRatings = ratingsResponse.ok ? await ratingsResponse.json() : { horses: [] };

    return json({
      horses: horses.horses || [],
      existingRatings: existingRatings.horses || [],
      batchSizes: [5, 10, 25, 50, 100],
      calculationMethods: [
        { id: 'standard', name: 'Standard IFHA', description: 'Méthode officielle IFHA' },
        { id: 'weighted', name: 'Pondéré par performances', description: 'Basé sur les dernières courses' },
        { id: 'progressive', name: 'Progressif', description: 'Tenant compte de l\'évolution' },
        { id: 'simplified', name: 'Simplifié', description: 'Calcul rapide pour tests' }
      ]
    });
  } catch (error) {
    console.error('Erreur chargement données calcul masse:', error);
    return json({
      horses: [],
      existingRatings: [],
      batchSizes: [],
      calculationMethods: []
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await requirePermission(request, Permission.RATING);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'batch-calculate') {
    const selectedHorses = JSON.parse(formData.get('selectedHorses') as string || '[]');
    const method = formData.get('method') as string;
    const batchSize = parseInt(formData.get('batchSize') as string);

    try {
      const results = [];
      const errors = [];
      
      // Traitement par lots
      for (let i = 0; i < selectedHorses.length; i += batchSize) {
        const batch = selectedHorses.slice(i, i + batchSize);
        
        for (const horseId of batch) {
          try {
            // Appeler l'API de calcul individuel pour chaque cheval
            const response = await fetch(`http://localhost:3000/api/ratings/calculate-initial/${horseId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ method })
            });

            const result = await response.json();
            
            if (response.ok) {
              results.push({
                horseId,
                ...result
              });
            } else {
              errors.push({
                horseId,
                error: result.message || 'Erreur de calcul'
              });
            }
          } catch (error) {
            errors.push({
              horseId,
              error: `Erreur réseau: ${error instanceof Error ? error.message : 'Unknown'}`
            });
          }
        }

        // Pause entre les lots pour éviter la surcharge
        if (i + batchSize < selectedHorses.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return json({
        success: true,
        results,
        errors,
        processed: selectedHorses.length,
        successful: results.length,
        failed: errors.length,
        message: `Traitement terminé: ${results.length} succès, ${errors.length} échecs`
      });

    } catch (error) {
      console.error('Erreur calcul en masse:', error);
      return json({
        success: false,
        error: `Erreur générale: ${error instanceof Error ? error.message : 'Unknown'}`,
        results: [],
        errors: []
      });
    }
  }

  return json({ success: false, error: 'Action non reconnue' });
}

export default function DashboardRatingsBulkCalculate() {
  const { horses, existingRatings, batchSizes, calculationMethods } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const [selectedHorses, setSelectedHorses] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [batchSize, setBatchSize] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const isSubmitting = navigation.state === 'submitting';

  // Données de démonstration si pas de chevaux
  const sampleHorses = horses.length > 0 ? horses : [
    { id: '1', name: 'Thunder Strike', currentRating: 0, lastRace: '2025-08-25' },
    { id: '2', name: 'Desert Rose', currentRating: 0, lastRace: '2025-08-22' },
    { id: '3', name: 'Sahara Wind', currentRating: 0, lastRace: '2025-08-20' },
    { id: '4', name: 'Golden Eagle', currentRating: 0, lastRace: '2025-08-18' },
    { id: '5', name: 'Star Runner', currentRating: 0, lastRace: '2025-08-15' },
    { id: '6', name: 'Desert Storm', currentRating: 0, lastRace: '2025-08-12' },
    { id: '7', name: 'Lightning Bolt', currentRating: 0, lastRace: '2025-08-10' },
    { id: '8', name: 'Midnight Express', currentRating: 0, lastRace: '2025-08-08' }
  ];

  const horsesWithoutRating = sampleHorses.filter(horse => 
    !existingRatings.some(rating => rating.id === horse.id && rating.currentRating > 0)
  );

  const toggleHorseSelection = (horseId: string) => {
    setSelectedHorses(prev => 
      prev.includes(horseId) 
        ? prev.filter(id => id !== horseId)
        : [...prev, horseId]
    );
  };

  const selectAll = () => {
    setSelectedHorses(horsesWithoutRating.map(h => h.id));
  };

  const clearSelection = () => {
    setSelectedHorses([]);
  };

  // Simulation de progression pour l'UI
  useEffect(() => {
    if (isSubmitting && !isProcessing) {
      setIsProcessing(true);
      setProcessingProgress(0);
      
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (!isSubmitting && isProcessing) {
      setProcessingProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
      }, 1000);
    }
  }, [isSubmitting, isProcessing]);

  const getMethodDescription = (methodId: string) => {
    return calculationMethods.find(m => m.id === methodId)?.description || '';
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
            <h1 className="text-2xl font-semibold text-gray-900">Calcul de Ratings en Masse</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Calculer les ratings IFHA pour plusieurs chevaux simultanément
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chevaux Total</p>
              <p className="text-2xl font-bold text-blue-600">{sampleHorses.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sans Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{horsesWithoutRating.length}</p>
            </div>
            <Target className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sélectionnés</p>
              <p className="text-2xl font-bold text-green-600">{selectedHorses.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taille Lot</p>
              <p className="text-2xl font-bold text-purple-600">{batchSize}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Configuration du Calcul</h2>
            </div>

            <Form method="post" className="space-y-6">
              <input type="hidden" name="intent" value="batch-calculate" />
              <input type="hidden" name="selectedHorses" value={JSON.stringify(selectedHorses)} />

              {/* Méthode de calcul */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de calcul
                </label>
                <select
                  name="method"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {calculationMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {getMethodDescription(selectedMethod)}
                </p>
              </div>

              {/* Taille du lot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille du lot (chevaux traités simultanément)
                </label>
                <select
                  name="batchSize"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {batchSizes.map((size) => (
                    <option key={size} value={size}>
                      {size} chevaux par lot
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Lots plus petits = plus stable mais plus lent
                </p>
              </div>

              {/* Sélection des chevaux */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Sélection des chevaux ({selectedHorses.length}/{horsesWithoutRating.length})
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Tout sélectionner
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                  {horsesWithoutRating.map((horse) => (
                    <label
                      key={horse.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedHorses.includes(horse.id)}
                        onChange={() => toggleHorseSelection(horse.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{horse.name}</p>
                        <p className="text-sm text-gray-500">
                          Dernière course: {new Date(horse.lastRace).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bouton de lancement */}
              <button
                type="submit"
                disabled={selectedHorses.length === 0 || isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Calcul en cours...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Lancer le calcul ({selectedHorses.length} chevaux)</span>
                  </>
                )}
              </button>
            </Form>
          </div>
        </div>

        {/* Status et résultats */}
        <div className="space-y-6">
          {/* Progression */}
          {(isSubmitting || isProcessing) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Progression</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Traitement en cours...</span>
                  <span>{Math.round(processingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Calcul des ratings par lots de {batchSize} chevaux
                </p>
              </div>
            </div>
          )}

          {/* Résultats */}
          {actionData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                {actionData.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <h3 className="text-lg font-medium text-gray-900">Résultats</h3>
              </div>

              {actionData.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm font-medium text-green-800">{actionData.message}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{actionData.processed}</p>
                      <p className="text-gray-600">Traités</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{actionData.successful}</p>
                      <p className="text-gray-600">Succès</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">{actionData.failed}</p>
                      <p className="text-gray-600">Échecs</p>
                    </div>
                  </div>

                  {actionData.errors && actionData.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Erreurs détectées:</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {actionData.errors.map((error: any, index: number) => (
                          <div key={index} className="text-xs bg-red-50 text-red-700 p-2 rounded">
                            Cheval {error.horseId}: {error.error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm font-medium text-red-800">{actionData.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Conseils d'utilisation</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Commencez avec des petits lots (5-10 chevaux)</li>
              <li>• La méthode "Standard IFHA" est recommandée</li>
              <li>• Le processus peut prendre plusieurs minutes</li>
              <li>• Évitez de fermer la page pendant le calcul</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
