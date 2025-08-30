import { 
  Play, 
  Code, 
  CheckCircle, 
  XCircle,
  Clock,
  Copy,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

export default function RatingApiTest() {
  const [activeEndpoint, setActiveEndpoint] = useState("horse-rating");
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const endpoints = [
    {
      id: "ping",
      name: "Test de connectivité",
      method: "GET",
      url: "/api/ratings/ping",
      description: "Teste si l'API de rating est opérationnelle",
      params: {},
      color: "green",
      needsAuth: false
    },
    {
      id: "horse-rating",
      name: "Rating d'un cheval",
      method: "GET",
      url: "/api/ratings/horse/:id",
      description: "Récupère le rating actuel d'un cheval spécifique",
      params: { id: "1" },
      color: "blue",
      needsAuth: true
    },
    {
      id: "calculate-initial",
      name: "Calcul rating initial",
      method: "POST", 
      url: "/api/ratings/calculate-initial/:horseId",
      description: "Calcule le rating initial d'un nouveau cheval",
      params: { horseId: "1" },
      body: {
        horseName: "Test Horse",
        age: 3,
        sex: "male",
        sire: { rating: 85 },
        dam: { rating: 75 }
      },
      color: "purple",
      needsAuth: true
    },
    {
      id: "update-after-race",
      name: "Mise à jour après course",
      method: "POST",
      url: "/api/ratings/update-after-race",
      description: "Met à jour le rating après une performance en course",
      body: {
        horseId: 1,
        raceId: 1,
        position: 1,
        weight: 55.5,
        distance: 1600,
        raceType: "conditions",
        trackCondition: "good"
      },
      color: "orange",
      needsAuth: true
    },
    {
      id: "statistics",
      name: "Statistiques générales",
      method: "GET",
      url: "/api/ratings/statistics",
      description: "Récupère les statistiques globales du système de rating",
      params: {},
      color: "red",
      needsAuth: true
    }
  ];

  const testEndpoint = async (endpoint: any) => {
    setLoading(prev => ({ ...prev, [endpoint.id]: true }));
    
    try {
      const baseUrl = "http://localhost:3000";
      let url = baseUrl + endpoint.url;
      
      // Remplacer les paramètres dans l'URL
      if (endpoint.params) {
        Object.entries(endpoint.params).forEach(([key, value]) => {
          url = url.replace(`:${key}`, String(value));
        });
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Pour inclure les cookies de session
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          success: response.ok,
          status: response.status,
          data: data,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.id]: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-900",
        button: "bg-blue-600 hover:bg-blue-700 text-white"
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-900",
        button: "bg-green-600 hover:bg-green-700 text-white"
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-900",
        button: "bg-purple-600 hover:bg-purple-700 text-white"
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-900",
        button: "bg-orange-600 hover:bg-orange-700 text-white"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const selectedEndpoint = endpoints.find(e => e.id === activeEndpoint);
  const result = testResults[activeEndpoint];
  const isLoading = loading[activeEndpoint];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Code className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test API Rating
              </h1>
              <p className="text-gray-600">
                Interface de test pour les endpoints de l'API de rating des chevaux
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des endpoints */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Endpoints Disponibles</h2>
              
              <div className="space-y-3">
                {endpoints.map((endpoint) => {
                  const colors = getColorClasses(endpoint.color);
                  const isActive = activeEndpoint === endpoint.id;
                  
                  return (
                    <button
                      key={endpoint.id}
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isActive 
                          ? `${colors.border} ${colors.bg}` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-mono rounded ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        {endpoint.needsAuth ? (
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                            🔐 Auth requise
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            🌐 Public
                          </span>
                        )}
                        <div className="flex-1">
                          <div className={`font-medium ${isActive ? colors.text : 'text-gray-900'}`}>
                            {endpoint.name}
                          </div>
                          <div className="text-sm text-gray-600 font-mono">
                            {endpoint.url}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Détails et test */}
          <div className="lg:col-span-2 space-y-6">
            {selectedEndpoint && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedEndpoint.name}
                  </h2>
                  <button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={isLoading}
                    className={`${getColorClasses(selectedEndpoint.color).button} px-4 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Test en cours...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Tester</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{selectedEndpoint.description}</p>

                {/* Détails de la requête */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Détails de la Requête</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-mono rounded ${
                          selectedEndpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedEndpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-800">
                          http://localhost:3000{selectedEndpoint.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(`http://localhost:3000${selectedEndpoint.url}`)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {selectedEndpoint.body && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Body :</div>
                          <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                            {JSON.stringify(selectedEndpoint.body, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Résultats du test */}
            {result && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  {result.success ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900">Résultat du Test</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(result.timestamp).toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Statut :</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status || 'Erreur'}
                    </span>
                  </div>

                  {result.data && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Réponse :</div>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Erreur :</div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <code className="text-sm text-red-800">{result.error}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documentation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <ExternalLink className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    Documentation API
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Cette interface permet de tester les endpoints de l'API de rating en temps réel. 
                    Tous les appels sont effectués vers le serveur local sur le port 3000.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note :</strong> Les endpoints nécessitent une authentification. 
                      Si vous recevez une erreur 401, connectez-vous d'abord sur le système.
                    </p>
                  </div>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <div>• Les endpoints GET ne nécessitent pas de body</div>
                    <div>• Les endpoints POST envoient du JSON dans le body</div>
                    <div>• Les réponses sont au format JSON</div>
                    <div>• Les erreurs retournent un code de statut HTTP approprié</div>
                    <div>• Code 401 = Authentification requise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
