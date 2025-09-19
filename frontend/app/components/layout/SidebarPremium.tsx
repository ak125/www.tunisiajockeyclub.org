import { Link, useLocation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  Gauge,
  Target,
  Flame,
  Shield,
  Globe,
  Bell,
  Award,
  Timer
} from "lucide-react";

interface SidebarPremiumProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarPremium({ isOpen = true, onClose }: SidebarPremiumProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['elite', 'main']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
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

  const eliteNavigation = [
    { 
      name: 'Chevaux Elite', 
      href: '/horses/advanced', 
      icon: Crown, 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      badge: '🐎',
      gradient: 'from-green-400 to-emerald-500'
    },
    { 
      name: 'Jockeys Champions', 
      href: '/jockeys/advanced', 
      icon: Trophy, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      badge: '🏇',
      gradient: 'from-blue-400 to-indigo-500'
    },
    { 
      name: 'Business Intelligence', 
      href: '/statistics/advanced', 
      icon: BarChart3, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      badge: '📊',
      gradient: 'from-purple-400 to-violet-500'
    },
    { 
      name: 'Hub Premium', 
      href: '/home/advanced', 
      icon: Sparkles, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      badge: '🏠',
      gradient: 'from-yellow-400 to-orange-500'
    },
    { 
      name: 'Courses Avancées', 
      href: '/races/advanced', 
      icon: Zap, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      badge: '🏃‍♂️',
      gradient: 'from-orange-400 to-red-500'
    }
  ];

  const mainNavigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    { 
      name: 'Courses', 
      href: '/races', 
      icon: Calendar, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      subItems: [
        { name: 'Toutes les courses', href: '/races' },
        { name: 'Calendrier', href: '/races/calendar' },
        { name: 'Résultats', href: '/races/results' }
      ]
    },
    { 
      name: 'Chevaux', 
      href: '/horses', 
      icon: Activity, 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subItems: [
        { name: 'Tous les chevaux', href: '/horses' },
        { name: 'Par catégorie', href: '/horses/categories' }
      ]
    },
    { 
      name: 'Jockeys', 
      href: '/jockeys', 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const toolsNavigation = [
    { 
      name: 'Calculateur Rating', 
      href: '/rating/calculateur', 
      icon: Calculator, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      icon: PieChart, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    { 
      name: 'Réglementations', 
      href: '/reglementation', 
      icon: Shield, 
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 z-40 h-full w-80 bg-gradient-to-b from-white via-gray-50 to-blue-50 shadow-2xl border-r border-gray-200 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header Premium */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Crown className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Tunisia Jockey Club
              </h2>
              <p className="text-sm text-gray-500">Elite Platform</p>
            </div>
          </div>
          
          {/* Live Stats */}
          <motion.div 
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 30px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Statut Live</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full"
              ></motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold">12</div>
                <div className="text-xs opacity-80">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">156</div>
                <div className="text-xs opacity-80">Chevaux</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">48</div>
                <div className="text-xs opacity-80">Jockeys</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section Elite */}
        <div className="mb-8">
          <motion.button
            onClick={() => toggleSection('elite')}
            className="w-full flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg hover:from-yellow-200 hover:to-orange-200 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Star className="h-5 w-5 text-yellow-600" />
              </motion.div>
              <span className="font-bold text-gray-800">🚀 Fonctionnalités Elite</span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold"
              >
                NEW
              </motion.div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.includes('elite') ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {expandedSections.includes('elite') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {eliteNavigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                        isActive(item.href)
                          ? 'bg-white shadow-lg ring-2 ring-blue-200'
                          : 'hover:bg-white/60 hover:shadow-md'
                      }`}
                    >
                      {/* Background Gradient Effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      ></motion.div>
                      
                      <motion.div
                        className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-300 relative z-10`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-lg">{item.badge}</span>
                      </motion.div>
                      
                      <div className="flex-1 relative z-10">
                        <p className={`font-semibold ${isActive(item.href) ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                          {item.name}
                        </p>
                      </div>

                      {hoveredItem === item.name && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center"
                        >
                          <Flame className="h-3 w-3 text-white" />
                        </motion.div>
                      )}

                      {isActive(item.href) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section Navigation Principale */}
        <div className="mb-8">
          <motion.button
            onClick={() => toggleSection('main')}
            className="w-full flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-100 to-blue-100 rounded-lg hover:from-gray-200 hover:to-blue-200 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Navigation Principale</span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.includes('main') ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expandedSections.includes('main') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {mainNavigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 group ${
                        isActive(item.href)
                          ? 'bg-white shadow-lg ring-2 ring-blue-200'
                          : 'hover:bg-white/60 hover:shadow-md'
                      }`}
                    >
                      <motion.div
                        className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-300`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </motion.div>
                      <span className={`font-medium ${isActive(item.href) ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {item.name}
                      </span>
                      
                      {isActive(item.href) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section Outils */}
        <div className="mb-8">
          <motion.button
            onClick={() => toggleSection('tools')}
            className="w-full flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-800">Outils & Analytics</span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.includes('tools') ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expandedSections.includes('tools') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {toolsNavigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 group ${
                        isActive(item.href)
                          ? 'bg-white shadow-lg ring-2 ring-blue-200'
                          : 'hover:bg-white/60 hover:shadow-md'
                      }`}
                    >
                      <motion.div
                        className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-300`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </motion.div>
                      <span className={`font-medium ${isActive(item.href) ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {item.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-auto pt-6 border-t border-gray-200"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-6 w-6 mx-auto mb-2" />
            </motion.div>
            <p className="text-sm font-semibold">Elite Member</p>
            <p className="text-xs opacity-80">Accès Premium</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
