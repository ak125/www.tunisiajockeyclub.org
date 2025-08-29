import { Calculator, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function RatingTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runAPITest = async (endpoint: string, method: string = 'GET', data?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(data && { body: JSON.stringify(data) })
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();
      
      setTestResults(prev => [...prev, {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        data: result,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        endpoint,
        method,
        status: 'ERROR',
        success: false,
        data: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
    setLoading(false);
  };

  const clearResults = () => setTestResults([]);

  const testEndpoints = [
    {
      name: "Statistiques Rating",
      endpoint: "/api/ratings/statistics",
      method: "GET"
    },
    {
      name: "Liste des Chevaux",
      endpoint: "/api/ratings/list",
      method: "GET"
    },
    {
      name: "Rating d'un Cheval",
      endpoint: "/api/ratings/horse/test-horse-123",
      method: "GET"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test API Rating System
          </h1>
          <p className="text-gray-600">
            Interface de test pour l'API de rating des chevaux
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            {testEndpoints.map((test, index) => (
              <button
                key={index}
                onClick={() => runAPITest(test.endpoint, test.method)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Calculator className="w-4 h-4" />
                {test.name}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Effacer les résultats
            </button>
            <span className="text-sm text-gray-500 flex items-center">
              {loading && "Test en cours..."}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <div className={`px-6 py-4 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {result.method} {result.endpoint}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <h4 className="font-semibold text-gray-800 mb-2">Réponse:</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {testResults.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Aucun test effectué. Cliquez sur un bouton pour tester l'API.
            </p>
          </div>
        )}

        {/* API Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-2">Information API</h3>
          <p className="text-blue-700 text-sm">
            Cette page teste l'API de rating en backend. Les endpoints protégés retourneront 
            une erreur 401 (non autorisé) si vous n'êtes pas connecté, ce qui est normal.
          </p>
        </div>
      </div>
    </div>
  );
}
