import { Link, useLocation } from "@remix-run/react";
import { 
  Calendar, 
  Trophy, 
  Users,
  Activity,
  Settings,
  Eye,
  PieChart,
  Calculator,
  BarChart3,
  Home,
  User
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navigation = [
    { 
      name: 'Accueil', 
      href: '/', 
      icon: Home, 
      description: 'Page d\'accueil' 
    },
    { 
      name: 'Vue d\'ensemble', 
      href: '/dashboard', 
      icon: Eye, 
      description: 'Aperçu général des données' 
    },
    { 
      name: 'Rating IFHA', 
      href: '/rating', 
      icon: Calculator, 
      description: 'Système de rating',
      badge: 'TJC'
    },
    { 
      name: 'Courses', 
      href: '/dashboard/races', 
      icon: Trophy, 
      description: 'Gestion des courses' 
    },
    { 
      name: 'Chevaux', 
      href: '/dashboard/horses', 
      icon: Activity, 
      description: 'Base de données des chevaux' 
    },
    { 
      name: 'Jockeys', 
      href: '/dashboard/jockeys', 
      icon: Users, 
      description: 'Profils des jockeys' 
    },
    { 
      name: 'Calendrier', 
      href: '/dashboard/calendar', 
      icon: Calendar, 
      description: 'Planning des courses' 
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      icon: PieChart, 
      description: 'Analyses avancées',
      badge: 'Pro'
    },
    { 
      name: 'Statistiques', 
      href: '/statistics', 
      icon: BarChart3, 
      description: 'Analyses et stats' 
    },
    { 
      name: 'Profil', 
      href: '/profile', 
      icon: User, 
      description: 'Mon profil' 
    },
    { 
      name: 'Paramètres', 
      href: '/dashboard/settings', 
      icon: Settings, 
      description: 'Configuration' 
    }
  ];

  // Debug: toujours visible
  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl border-r border-gray-200">
      <div className="flex flex-col h-full">
          {/* En-tête */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏇</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">TJC</h1>
                <p className="text-xs text-gray-600">Tunisia Jockey Club</p>
              </div>
            </Link>
          </div>
          
          {/* Section Accès rapide */}
          <div className="px-4 pt-6 pb-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Accès Rapide
            </h2>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 pb-6 space-y-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative
                    ${active
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${
                      active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${
                      active ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Section spéciale Jockeys */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">🏇 Gestion des Jockeys</span>
              </div>
              <p className="text-xs text-amber-700 mb-3">
                Module complet de gestion des jockeys et performances
              </p>
              <Link
                to="/dashboard/jockeys"
                className="inline-flex items-center text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
              >
                Accéder au module →
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Tunisia Jockey Club © 2025
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Système hippique tunisien
              </p>
            </div>
          </div>
        </div>
      </aside>
  );
}
