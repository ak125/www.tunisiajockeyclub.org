import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, Link } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  // Routes publiques - aucune authentification requise
  return null;
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Public */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/logo-tjc.png" 
                alt="Tunisia Jockey Club" 
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tunisia Jockey Club</h1>
                <p className="text-sm text-gray-600">Club Hippique de Tunis</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Link to="/public" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Accueil
              </Link>
              <Link to="/public/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Courses
              </Link>
              <Link to="/public/ratings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Ratings IFHA
              </Link>
              <Link to="/public/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Classements
              </Link>
              <div className="border-l border-gray-200 pl-6">
                <Link 
                  to="/login" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connexion
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenu Public */}
      <main>
        <Outlet />
      </main>

      {/* Footer Public */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Tunisia Jockey Club</h3>
              <p className="text-gray-300 mb-4">
                Le premier club hippique de Tunisie, fondé en 1885. 
                Nous organisons des courses de chevaux de haute qualité et 
                promouvons l'équitation sportive en Tunisie.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/public" className="text-gray-300 hover:text-white">Accueil</Link></li>
                <li><Link to="/public/courses" className="text-gray-300 hover:text-white">Programmes</Link></li>
                <li><Link to="/public/resultats" className="text-gray-300 hover:text-white">Résultats</Link></li>
                <li><Link to="/public/classements" className="text-gray-300 hover:text-white">Classements</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Avenue Jugurtha, Cité Mahrajène</li>
                <li>1082 Tunis, Tunisie</li>
                <li>Tel: (+216) 71 767 050</li>
                <li>Email: info@jockey-club.tn</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Tunisia Jockey Club. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
