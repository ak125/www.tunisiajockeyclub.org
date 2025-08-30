import { type LoaderFunctionArgs, type ActionFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useNavigation, Link } from '@remix-run/react';
import { 
  Calculator, Target, RefreshCw, 
  TrendingUp, BarChart3, AlertCircle, CheckCircle,
  ArrowLeft, HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { requirePermission, Permission } from '../utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Vérifier les permissions pour le calcul de rating
  await requirePermission(request, Permission.RATING);

  try {
    // Récupérer la liste des chevaux pour le calculateur
    const horsesResponse = await fetch('http://localhost:3000/api/horses/list');
    const horses = horsesResponse.ok ? await horsesResponse.json() : { horses: [] };

    return json({
      horses: horses.horses || [],
      calculationMethods: [
        { id: 'standard', name: 'Standard IFHA', description: 'Calcul standard selon les règles IFHA' },
        { id: 'weighted', name: 'Pondéré par performances', description: 'Calcul pondéré basé sur les dernières performances' },
        { id: 'progressive', name: 'Progressif', description: 'Calcul tenant compte de la progression du cheval' },
        { id: 'handicap', name: 'Handicap', description: 'Calcul pour courses de handicap' }
      ]
    });
  } catch (error) {
    console.error('Erreur chargement données calculateur:', error);
    return json({
      horses: [],
      calculationMethods: []
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await requirePermission(request, Permission.RATING);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'calculate-rating') {
    const horseId = formData.get('horseId');
    const method = formData.get('method');
    const baseRating = formData.get('baseRating');
    const adjustments = formData.get('adjustments');

    try {
      // Appel à l'API pour calculer le rating
      const response = await fetch('http://localhost:3000/api/rating/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          horseId: parseInt(horseId as string),
          method,
          baseRating: baseRating ? parseFloat(baseRating as string) : undefined,
          adjustments: adjustments ? JSON.parse(adjustments as string) : {}
        })
      });

      const result = await response.json();

      if (result.success) {
        return json({
          success: true,
          calculation: result.calculation,
          message: 'Rating calculé avec succès'
        });
      } else {
        return json({
          success: false,
          error: result.message || 'Erreur lors du calcul'
        });
      }
    } catch (error) {
      console.error('Erreur calcul rating:', error);
      return json({
        success: false,
        error: 'Erreur de communication avec le serveur'
      });
    }
  }

  return json({ success: false, error: 'Action non reconnue' });
}

export default function DashboardRatingsCalculate() {
  const { horses, calculationMethods } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  const [selectedHorse, setSelectedHorse] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [baseRating, setBaseRating] = useState('');
  const [adjustments, setAdjustments] = useState({
    distance: 0,
    track: 0,
    weight: 0,
    weather: 0,
    jockey: 0
  });

  const isCalculating = navigation.state === 'submitting';

  // Données simulées pour le développement si pas de chevaux
  const sampleHorses = horses.length > 0 ? horses : [
    { id: 1, name: 'Thunder Strike', currentRating: 95, lastRace: '2025-08-25' },
    { id: 2, name: 'Desert Rose', currentRating: 88, lastRace: '2025-08-22' },
    { id: 3, name: 'Sahara Wind', currentRating: 92, lastRace: '2025-08-20' },
    { id: 4, name: 'Golden Eagle', currentRating: 87, lastRace: '2025-08-18' },
    { id: 5, name: 'Star Runner', currentRating: 90, lastRace: '2025-08-15' }
  ];

  const selectedHorseData = sampleHorses.find(h => h.id.toString() === selectedHorse);

  const handleAdjustmentChange = (field: string, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalAdjustment = Object.values(adjustments).reduce((sum, val) => sum + val, 0);
  const estimatedNewRating = selectedHorseData ? 
    selectedHorseData.currentRating + (baseRating ? parseFloat(baseRating) : 0) + totalAdjustment : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Link to="/dashboard/ratings" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Calculateur de Rating IFHA</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Calcul et mise à jour des ratings selon les standards IFHA
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Guide</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de calcul */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Paramètres de calcul</h2>
            </div>

            <Form method="post" className="space-y-6">
              <input type="hidden" name="intent" value="calculate-rating" />
              
              {/* Sélection du cheval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cheval à évaluer
                </label>
                <select
                  name="horseId"
                  value={selectedHorse}
                  onChange={(e) => setSelectedHorse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un cheval...</option>
                  {sampleHorses.map((horse) => (
                    <option key={horse.id} value={horse.id}>
                      {horse.name} - Rating actuel: {horse.currentRating}
                    </option>
                  ))}
                </select>
              </div>

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
                {calculationMethods.find(m => m.id === selectedMethod) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {calculationMethods.find(m => m.id === selectedMethod)?.description}
                  </p>
                )}
              </div>

              {/* Rating de base */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ajustement de base (optionnel)
                </label>
                <input
                  type="number"
                  name="baseRating"
                  value={baseRating}
                  onChange={(e) => setBaseRating(e.target.value)}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>

              {/* Ajustements détaillés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Ajustements détaillés
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries({
                    distance: 'Distance',
                    track: 'Piste',
                    weight: 'Poids',
                    weather: 'Météo',
                    jockey: 'Jockey'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={adjustments[key as keyof typeof adjustments]}
                        onChange={(e) => handleAdjustmentChange(key, parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                <input type="hidden" name="adjustments" value={JSON.stringify(adjustments)} />
              </div>

              {/* Bouton de calcul */}
              <button
                type="submit"
                disabled={!selectedHorse || isCalculating}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4" />
                )}
                <span>{isCalculating ? 'Calcul en cours...' : 'Calculer le rating'}</span>
              </button>
            </Form>
          </div>
        </div>

        {/* Panneau de prévisualisation */}
        <div className="space-y-6">
          {/* Aperçu du calcul */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Aperçu</h3>
            </div>

            {selectedHorseData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Cheval sélectionné</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedHorseData.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Rating actuel</p>
                    <p className="text-lg font-bold text-blue-600">{selectedHorseData.currentRating}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ajustement total</p>
                    <p className={`text-lg font-bold ${totalAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalAdjustment >= 0 ? '+' : ''}{totalAdjustment.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Rating estimé</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {estimatedNewRating.toFixed(1)}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {estimatedNewRating > selectedHorseData.currentRating ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : estimatedNewRating < selectedHorseData.currentRating ? (
                      <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {(estimatedNewRating - selectedHorseData.currentRating).toFixed(1)} points
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sélectionnez un cheval pour voir l'aperçu</p>
            )}
          </div>

          {/* Résultat du calcul */}
          {actionData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                {actionData.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <h3 className="text-lg font-medium text-gray-900">Résultat</h3>
              </div>

              {actionData.success ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm font-medium text-green-800">{actionData.message}</p>
                  </div>
                  {actionData.calculation && (
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nouveau rating:</span>
                        <span className="font-semibold">{actionData.calculation.newRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variation:</span>
                        <span className={`font-semibold ${actionData.calculation.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {actionData.calculation.change >= 0 ? '+' : ''}{actionData.calculation.change}
                        </span>
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

          {/* Guide rapide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-900">Guide rapide</h4>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Les ajustements positifs augmentent le rating</li>
              <li>• Les ajustements négatifs diminuent le rating</li>
              <li>• Le calcul standard IFHA est recommandé</li>
              <li>• Vérifiez l'aperçu avant validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
