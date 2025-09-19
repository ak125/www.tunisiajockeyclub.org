import { Link } from "@remix-run/react";
import { User, LogOut, Settings, Shield } from "lucide-react";

interface NavBarProps {
  currentPath?: string;
  user?: {
    name: string;
    role: string;
    email?: string;
  } | null;
}

export function NavBar({ currentPath = "/", user = null }: NavBarProps) {
  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/courses", label: "Courses" },
    { path: "/courses/search", label: "🔍 Recherche" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "user": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrateur";
      case "manager": return "Gestionnaire";
      case "user": return "Utilisateur";
      default: return "Invité";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏇</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tunisia Jockey Club</h1>
                <p className="text-sm text-gray-600">Centre d'Excellence Hippique</p>
              </div>
            </Link>
          </div>

          {/* Navigation principale */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`font-medium transition-colors ${
                  currentPath === path
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Authentification */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Informations utilisateur */}
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>

                {/* Badge rôle */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>

                {/* Menu utilisateur */}
                <div className="flex items-center space-x-2">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Administration"
                    >
                      <Shield className="h-4 w-4" />
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Profil"
                  >
                    <Settings className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/logout"
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/signin"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden pb-4">
          <div className="space-y-2">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPath === path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            ))}
            {!user && (
              <div className="pt-2 border-t">
                <Link
                  to="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <User className="inline h-4 w-4 mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 mt-2"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
