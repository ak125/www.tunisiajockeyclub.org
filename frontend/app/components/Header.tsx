import { Link, useLocation } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, Zap, Crown, Star } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
}

export function Header({ 
  title = "Tunisia Jockey Club", 
  subtitle = "Système IFHA Premium - Elite Equestrian Platform",
  showNavigation = true 
}: HeaderProps) {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: "/", label: "🏠 Accueil", badge: "" },
    { path: "/dashboard", label: "📊 Dashboard", badge: "Pro" },
    { path: "/ifha", label: "⭐ Rating IFHA", badge: "Elite" },
    { path: "/statistics", label: "📈 Analytics", badge: "BI" },
    { path: "/horses/advanced", label: "🐎 Chevaux+", badge: "NEW" },
    { path: "/jockeys/advanced", label: "🏇 Jockeys+", badge: "NEW" }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-TN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header 
      role="banner" 
      aria-label="En-tête principal Tunisia Jockey Club"
      className="bg-gradient-to-r from-white via-yellow-50 to-orange-50 border-b-2 border-gradient-to-r border-yellow-200 sticky top-0 z-50 shadow-lg backdrop-blur-md"
    >
      {/* Barre supérieure avec infos live */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Système Opérationnel</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Redis Cache Actif</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline">Tunis</span>
                <span className="font-mono">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* En-tête principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
              aria-label="Retour à l'accueil Tunisia Jockey Club"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-white text-xl font-bold">🏇</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Barre de recherche centrale */}
          <div className="flex-1 max-w-xl mx-8 mt-4 lg:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher chevaux, jockeys, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all shadow-sm"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
                  <p className="text-sm text-gray-600">Recherche pour: "{searchQuery}"</p>
                  <div className="mt-2 space-y-2">
                    <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <span className="text-sm">🐎 Chevaux correspondants</span>
                    </div>
                    <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <span className="text-sm">🏇 Jockeys correspondants</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Notifications */}
            <button className="relative p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-yellow-300 transition-all">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* Menu profil */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-yellow-300 transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
                  <Link to="/profile" className="block p-2 hover:bg-gray-50 rounded-lg text-sm">
                    👤 Mon Profil
                  </Link>
                  <Link to="/dashboard/settings" className="block p-2 hover:bg-gray-50 rounded-lg text-sm">
                    ⚙️ Paramètres
                  </Link>
                  <hr className="my-2" />
                  <button className="block w-full text-left p-2 hover:bg-red-50 rounded-lg text-sm text-red-600">
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation principale avec badges */}
        {showNavigation && (
          <nav 
            role="navigation" 
            aria-label="Navigation principale"
            className="pb-4"
          >
            <div className="flex flex-wrap gap-2">
              {mainNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active 
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 shadow-md border-2 border-yellow-300" 
                        : "bg-white text-gray-700 hover:text-yellow-700 hover:bg-yellow-50 border-2 border-transparent hover:border-yellow-200 shadow-sm"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.badge === 'NEW' ? 'bg-red-500 text-white animate-pulse' :
                        item.badge === 'Elite' ? 'bg-purple-500 text-white' :
                        item.badge === 'Pro' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <Star className="h-4 w-4 text-yellow-600 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
