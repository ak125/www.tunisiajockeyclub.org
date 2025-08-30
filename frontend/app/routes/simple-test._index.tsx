import { json } from "@remix-run/node";
import { Link } from '@remix-run/react';
import { TestTube, Activity, Server, CheckCircle } from 'lucide-react';

export const loader = async () => {
  return json({
    message: "Tunisia Jockey Club - Tests Système",
    timestamp: new Date().toISOString(),
    availableTests: [
      {
        name: "Ping Test",
        url: "/simple-test/ping",
        description: "Test de connectivité basique",
        icon: "ping"
      },
      {
        name: "Status Check",
        url: "/simple-test/status", 
        description: "Vérification complète du statut système",
        icon: "status"
      }
    ]
  });
};

export default function SimpleTestIndex() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TestTube className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tests Système
          </h1>
          
          <p className="text-gray-600">
            Tunisia Jockey Club - Outils de diagnostic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/simple-test/ping"
            className="group bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-6 text-center transition-colors"
          >
            <div className="w-16 h-16 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              Ping Test
            </h2>
            <p className="text-green-700 text-sm">
              Test de connectivité basique du système
            </p>
          </Link>

          <Link
            to="/simple-test/status"
            className="group bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-6 text-center transition-colors"
          >
            <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Status Check
            </h2>
            <p className="text-blue-700 text-sm">
              Vérification complète du statut système
            </p>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Tous les services sont opérationnels</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
