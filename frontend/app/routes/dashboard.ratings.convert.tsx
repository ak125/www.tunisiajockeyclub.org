import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { 
  ArrowLeftRight, Calculator, Globe, 
  ArrowLeft, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { requirePermission, Permission } from '../utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermission(request, Permission.RATING);

  try {
    // Récupérer les ratings existants pour la conversion
    const ratingsResponse = await fetch('http://localhost:3000/api/rating/ifha/list');
    const ratings = ratingsResponse.ok ? await ratingsResponse.json() : { horses: [] };

    return json({
      horses: ratings.horses || [],
      conversionRates: {
        tunisie: { min: 0, max: 120, label: 'Rating Tunisie' },
        france: { min: 0, max: 130, label: 'Rating France' },
        uk: { min: 0, max: 140, label: 'Rating UK/IRE' },
        uae: { min: 0, max: 125, label: 'Rating UAE' },
        ifha: { min: 0, max: 150, label: 'Standard IFHA' }
      }
    });
  } catch (error) {
    console.error('Erreur chargement données conversion:', error);
    return json({
      horses: [],
      conversionRates: {}
    });
  }
}

interface ConversionResult {
  success: boolean;
  original?: number;
  converted?: number;
  scale?: string;
  confidence?: number;
  error?: string;
}

export default function DashboardRatingsConvert() {
  const { horses, conversionRates } = useLoaderData<typeof loader>();
  const [sourceRating, setSourceRating] = useState('');
  const [targetScale, setTargetScale] = useState('ifha');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  // Données de démonstration si pas de chevaux
  const sampleHorses = horses.length > 0 ? horses : [
    { id: 1, name: 'Thunder Strike', currentRating: 95, country: 'tunisie' },
    { id: 2, name: 'Desert Rose', currentRating: 88, country: 'tunisie' },
    { id: 3, name: 'Sahara Wind', currentRating: 92, country: 'tunisie' },
  ];

  const handleConversion = async () => {
    if (!sourceRating || !targetScale) return;

    setIsConverting(true);
    try {
      const response = await fetch('http://localhost:3000/api/rating/ifha/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tunisianRating: parseFloat(sourceRating),
          targetScale: targetScale
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setConversionResult({
          success: true,
          original: result.originalRating,
          converted: result.convertedRating,
          scale: result.targetScale,
          confidence: result.confidence || 95
        });
      } else {
        setConversionResult({
          success: false,
          error: result.message || 'Erreur de conversion'
        });
      }
    } catch (error) {
      console.error('Erreur conversion:', error);
      setConversionResult({
        success: false,
        error: 'Erreur de communication avec le serveur'
      });
    } finally {
      setIsConverting(false);
    }
  };

  const getScaleColor = (scale) => {
    const colors = {
      tunisie: 'bg-red-100 text-red-800',
      france: 'bg-blue-100 text-blue-800', 
      uk: 'bg-green-100 text-green-800',
      uae: 'bg-yellow-100 text-yellow-800',
      ifha: 'bg-purple-100 text-purple-800'
    };
    return colors[scale] || 'bg-gray-100 text-gray-800';
  };

  const getScaleFlag = (scale) => {
    const flags = {
      tunisie: '🇹🇳',
      france: '🇫🇷',
      uk: '🇬🇧',
      uae: '🇦🇪',
      ifha: '🌍'
    };
    return flags[scale] || '🏁';
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
            <h1 className="text-2xl font-semibold text-gray-900">Conversion de Ratings</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Convertir les ratings entre les différentes échelles internationales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Convertisseur */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ArrowLeftRight className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Convertisseur IFHA</h2>
            </div>

            <div className="space-y-6">
              {/* Sélection rapide depuis un cheval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélection rapide depuis un cheval
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const horse = sampleHorses.find(h => h.id.toString() === e.target.value);
                    if (horse) setSourceRating(horse.currentRating.toString());
                  }}
                >
                  <option value="">Choisir un cheval...</option>
                  {sampleHorses.map((horse) => (
                    <option key={horse.id} value={horse.id}>
                      {horse.name} - Rating {horse.currentRating}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating à convertir (Tunisie)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="120"
                    step="0.5"
                    value={sourceRating}
                    onChange={(e) => setSourceRating(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 95.0"
                  />
                  <span className={`px-3 py-2 rounded-full text-sm font-medium ${getScaleColor('tunisie')}`}>
                    🇹🇳 Tunisie
                  </span>
                </div>
              </div>

              {/* Échelle cible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Échelle de destination
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(conversionRates).map(([scale, config]) => (
                    <button
                      key={scale}
                      onClick={() => setTargetScale(scale)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        targetScale === scale 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{getScaleFlag(scale)}</span>
                        <span className="text-xs text-gray-500">{config.min}-{config.max}</span>
                      </div>
                      <p className="text-sm text-gray-700">{config.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton conversion */}
              <button
                onClick={handleConversion}
                disabled={!sourceRating || !targetScale || isConverting}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isConverting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4" />
                )}
                <span>{isConverting ? 'Conversion en cours...' : 'Convertir le rating'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Résultat et informations */}
        <div className="space-y-6">
          {/* Résultat de conversion */}
          {conversionResult && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                {conversionResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <h3 className="text-lg font-medium text-gray-900">Résultat</h3>
              </div>

              {conversionResult.success ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Rating original</p>
                      <p className="text-lg font-semibold">{conversionResult.original}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getScaleColor('tunisie')}`}>
                        {getScaleFlag('tunisie')} Tunisie
                      </span>
                    </div>
                    <ArrowLeftRight className="h-6 w-6 text-gray-400" />
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Rating converti</p>
                      <p className="text-2xl font-bold text-blue-600">{conversionResult.converted}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getScaleColor(conversionResult.scale)}`}>
                        {getScaleFlag(conversionResult.scale)} {conversionResult.scale?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 mb-1">Confiance de conversion</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${conversionResult.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-blue-800">
                        {conversionResult.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm font-medium text-red-800">{conversionResult.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Tables de conversion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Tables de Référence</h3>
            </div>

            <div className="space-y-3">
              {Object.entries(conversionRates).map(([scale, config]) => (
                <div key={scale} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getScaleFlag(scale)}</span>
                    <span className="font-medium text-sm">{config.label}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {config.min}-{config.max}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guide conversion */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">📚 Guide de Conversion</h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• Les conversions utilisent les tables IFHA officielles</li>
              <li>• La confiance indique la précision de la conversion</li>
              <li>• Les échelles varient selon les pays et réglementations</li>
              <li>• IFHA est l'échelle de référence internationale</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
