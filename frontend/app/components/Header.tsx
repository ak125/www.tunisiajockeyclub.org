import { Link, useLocation } from '@remix-run/react';
import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNavigation?: boolean;
}

export function Header({ 
  title = "Tunisia Jockey Club", 
  subtitle = "Système IFHA - Rating des chevaux",
  showNavigation = true 
}: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: "/", label: "Accueil" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/ifha", label: "Rating IFHA" },
    { path: "/statistics", label: "Statistiques" }
  ];

  return (
    <header 
      role="banner" 
      aria-label="En-tête principal Tunisia Jockey Club"
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      {/* Titre principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              aria-label="Retour à l'accueil Tunisia Jockey Club"
            >
              <span className="text-3xl" role="img" aria-label="Icône cheval">🏇</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation principale */}
          {showNavigation && (
            <nav 
              role="navigation" 
              aria-label="Navigation principale"
              className="mt-3 sm:mt-0"
            >
              <ul className="flex space-x-1 sm:space-x-4">
                {mainNavItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.path) 
                          ? "bg-yellow-100 text-yellow-700 shadow-sm" 
                          : "text-gray-700 hover:text-yellow-600 hover:bg-gray-50"
                      }`}
                      aria-current={isActive(item.path) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Barre de statut (optionnelle) */}
      <div className="bg-green-50 border-t border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 text-center">
            <p className="text-sm text-green-700">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Système opérationnel - Redis Cache actif
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
