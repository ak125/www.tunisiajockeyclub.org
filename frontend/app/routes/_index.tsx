import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // Pour l'instant, on mock les données utilisateur
    const user = null; // TODO: Implémenter la gestion des sessions
    
    return json({
        user,
        timestamp: new Date().toISOString(),
    });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏇 Tunisia Jockey Club
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plateforme de gestion des courses hippiques en Tunisie
        </p>
        
        {user ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              👋 Bienvenue !
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                📊 Tableau de bord
              </Link>
              <form action="/auth/logout" method="POST" className="inline">
                <button 
                  type="submit" 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  🚪 Se déconnecter
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Connectez-vous pour accéder à votre espace personnel
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                🔐 Se connecter
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                ✨ Créer un compte
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">🏁 Courses</h3>
          <p className="text-gray-600">
            Consultez les programmes et résultats des courses
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">🐎 Chevaux</h3>
          <p className="text-gray-600">
            Base de données complète des chevaux de course
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">👨‍💼 Jockeys</h3>
          <p className="text-gray-600">
            Profils et statistiques des jockeys
          </p>
        </div>
      </div>
    </div>
  );
}  
