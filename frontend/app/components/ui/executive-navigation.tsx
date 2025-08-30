import { Link, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";
import { ExecutiveBadge } from "./executive-components";

interface NavigationProps {
  className?: string;
}

export const ExecutiveNavigation = ({ className = "" }: NavigationProps) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      label: "Dashboard",
      href: "/executive-dashboard", 
      icon: "🏛️",
      description: "Vue d'ensemble",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      label: "Licences",
      href: "/licenses",
      icon: "📋", 
      description: "Gestion professionnelle",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      label: "Analytics", 
      href: "/analytics",
      icon: "📊",
      description: "Rapports & données", 
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Interface Demo",
      href: "/professional-demo",
      icon: "🎨", 
      description: "Interface principale",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Design System",
      href: "/design-system-clean", 
      icon: "🎭",
      description: "Composants UI",
      color: "from-pink-500 to-pink-600"
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className={`bg-white/90 backdrop-blur-lg border border-slate-200/60 rounded-2xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Navigation Exécutive</h2>
          <p className="text-sm text-slate-600">Club Jockey Tunisie</p>
        </div>
        <ExecutiveBadge variant="authority" size="sm">
          Système Intégré
        </ExecutiveBadge>
      </div>

      <div className="space-y-3">
        {navigationItems.map((item, index) => {
          const active = isActive(item.href);
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className={`group flex items-center p-4 rounded-xl transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-r from-slate-100 to-slate-50 border-l-4 border-indigo-500 shadow-md' 
                    : 'hover:bg-slate-50 hover:scale-[1.02]'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-110 transition-transform mr-4`}>
                  {item.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold transition-colors ${
                    active ? 'text-indigo-700' : 'text-slate-800 group-hover:text-indigo-600'
                  }`}>
                    {item.label}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>

                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-indigo-500 rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Dernière MAJ: {new Date().toLocaleTimeString('fr-FR')}</span>
          <ExecutiveBadge variant="certified" size="sm">v2.0</ExecutiveBadge>
        </div>
      </div>
    </nav>
  );
};
