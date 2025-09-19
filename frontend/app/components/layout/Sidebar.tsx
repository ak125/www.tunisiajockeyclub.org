import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
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
  User,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Star,
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main', 'advanced']);
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const mainNavigation = [
    { 
      name: 'Accueil Premium', 
      href: '/', 
      icon: Home, 
      description: 'Dashboard principal',
      badge: 'Elite',
      badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    { 
      name: 'Vue d\'ensemble', 
      href: '/dashboard', 
      icon: Eye, 
      description: 'Analytics globales',
      stats: '2.4K vues'
    },
    { 
      name: 'Rating IFHA', 
      href: '/rating', 
      icon: Calculator, 
      description: 'Système de rating professionnel',
      badge: 'TJC',
      badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    }
  ];

  const advancedFeatures = [
    { 
      name: 'Chevaux Elite', 
      href: '/horses/advanced', 
      icon: Activity, 
      description: 'Profils détaillés avec analytics',
      badge: 'NEW',
      badgeColor: 'bg-red-500 animate-pulse',
      isNew: true
    },
    { 
      name: 'Jockeys Champions', 
      href: '/jockeys/advanced', 
      icon: Users, 
      description: 'Analyses professionnelles',
      badge: 'NEW', 
      badgeColor: 'bg-red-500 animate-pulse',
      isNew: true
    },
    { 
      name: 'Business Intelligence', 
      href: '/statistics/advanced', 
      icon: TrendingUp, 
      description: 'Analytics avancées 4.8M DT',
      badge: 'BI',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-purple-500',
      isNew: true
    },
    { 
      name: 'Hub Premium', 
      href: '/home/advanced', 
      icon: Crown, 
      description: 'Centre de contrôle intégré',
      badge: 'PRO',
      badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      isNew: true
    },
    { 
      name: 'Courses Avancées', 
      href: '/races/advanced', 
      icon: Trophy, 
      description: 'Gestion complète avec 4 vues',
      badge: 'NEW',
      badgeColor: 'bg-red-500 animate-pulse',
      isNew: true
    }
  ];

  const managementTools = [
    { 
      name: 'Courses', 
      href: '/dashboard/races', 
      icon: Trophy, 
      description: 'Gestion des événements',
      count: '24'
    },
    { 
      name: 'Chevaux', 
      href: '/dashboard/horses', 
      icon: Activity, 
      description: 'Base de données équine',
      count: '156'
    },
    { 
      name: 'Jockeys', 
      href: '/dashboard/jockeys', 
      icon: Users, 
      description: 'Profils des cavaliers',
      count: '89'
    },
    { 
      name: 'Calendrier', 
      href: '/dashboard/calendar', 
      icon: Calendar, 
      description: 'Planning événements',
      upcoming: '3'
    }
  ];

  const systemTools = [
    { 
      name: 'Analytics Pro', 
      href: '/dashboard/analytics', 
      icon: PieChart, 
      description: 'Analyses professionnelles',
      badge: 'Pro',
      badgeColor: 'bg-blue-500'
    },
    { 
      name: 'Statistiques', 
      href: '/statistics', 
      icon: BarChart3, 
      description: 'Rapports et métriques' 
    },
    { 
      name: 'Mon Profil', 
      href: '/profile', 
      icon: User, 
      description: 'Paramètres personnels' 
    },
    { 
      name: 'Configuration', 
      href: '/dashboard/settings', 
      icon: Settings, 
      description: 'Réglages système' 
    }
  ];

  const renderNavSection = (title: string, items: any[], sectionKey: string, icon?: any) => {
    const Icon = icon;
    const isExpanded = expandedSections.includes(sectionKey);
    
    return (
      <div className="mb-6">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span>{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="space-y-1 mt-2">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative mx-2
                    ${active
                      ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-blue-700 border-l-4 border-blue-600 shadow-md'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="relative">
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                      }`}
                    />
                    {item.isNew && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{item.name}</span>
                      <div className="flex items-center space-x-1">
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold text-white ${item.badgeColor || 'bg-gray-500'}`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-semibold">
                            {item.count}
                          </span>
                        )}
                        {item.upcoming && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-semibold">
                            {item.upcoming}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${
                      active ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                    {item.stats && (
                      <p className="text-xs text-gray-400 mt-1">{item.stats}</p>
                    )}
                  </div>
                  
                  {active && (
                    <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-80 bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* En-tête Premium */}
        <div className="flex items-center h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white text-xl font-bold">🏇</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TJC Elite</h1>
              <p className="text-xs text-gray-600 font-medium">Tunisia Jockey Club</p>
              <div className="flex items-center space-x-1 mt-1">
                <Crown className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-yellow-600 font-semibold">Premium</span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Bandeau statut */}
        <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Système Premium Actif</span>
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                Redis ⚡
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 pt-4 pb-6 space-y-2 overflow-y-auto">
          {renderNavSection('Navigation Principale', mainNavigation, 'main', Home)}
          {renderNavSection('Fonctionnalités Avancées', advancedFeatures, 'advanced', Sparkles)}
          {renderNavSection('Outils de Gestion', managementTools, 'management', Settings)}
          {renderNavSection('Système & Analytics', systemTools, 'system', BarChart3)}
        </nav>

        {/* Section spéciale Performance */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-800">Performance Analytics</span>
              <span className="text-xs px-2 py-0.5 bg-purple-500 text-white rounded-full font-bold">
                Live
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-700">4.8M</div>
                <div className="text-xs text-purple-600">Revenus DT</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">156</div>
                <div className="text-xs text-blue-600">Chevaux Elite</div>
              </div>
            </div>
            <Link
              to="/statistics/advanced"
              className="block w-full text-center py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Voir Dashboard BI →
            </Link>
          </div>
        </div>

        {/* Footer Premium */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold text-gray-700">Tunisia Jockey Club</span>
            </div>
            <p className="text-xs text-gray-500">
              Elite Equestrian Platform © 2025
            </p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Système Premium</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
