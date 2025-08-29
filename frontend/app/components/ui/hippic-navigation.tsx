import { Link, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Gamepad2 as Horse, 
  BarChart3, 
  Calendar,
  Users,
  Settings,
  Home,
  Crown
} from "lucide-react";
import { cn } from "../../lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Accueil",
    href: "/",
    icon: Home,
    description: "Tableau de bord principal"
  },
  {
    label: "Courses",
    href: "/courses",
    icon: Horse,
    description: "Programme et résultats des courses"
  },
  {
    label: "Classements",
    href: "/rankings",
    icon: Trophy,
    description: "Palmarès et performances"
  },
  {
    label: "Statistiques",
    href: "/stats",
    icon: BarChart3,
    description: "Analyses et données"
  },
  {
    label: "Calendrier",
    href: "/calendar",
    icon: Calendar,
    badge: "3",
    description: "Événements à venir"
  },
  {
    label: "Jockeys",
    href: "/jockeys",
    icon: Crown,
    description: "Profils des jockeys"
  },
  {
    label: "Membres",
    href: "/members",
    icon: Users,
    description: "Communauté du club"
  }
];

interface HippicNavigationProps {
  className?: string;
  variant?: "sidebar" | "horizontal";
  showLabels?: boolean;
}

export function HippicNavigation({ 
  className, 
  variant = "sidebar", 
  showLabels = true 
}: HippicNavigationProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className={cn(
      "hippic-navigation",
      variant === "horizontal" ? "flex items-center space-x-1" : "space-y-2",
      className
    )}>
      {navigationItems.map((item, index) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: variant === "sidebar" ? -20 : 0, y: variant === "horizontal" ? -20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                "hover:bg-turf-green-50 hover:text-turf-green-700",
                "focus:outline-none focus:ring-2 focus:ring-turf-green-500 focus:ring-offset-1",
                variant === "horizontal" && "flex-col text-center min-w-[80px]",
                active && [
                  "bg-turf-green-100 text-turf-green-800 shadow-sm",
                  "border-l-4 border-turf-green-600",
                  variant === "horizontal" && "border-l-0 border-b-4"
                ]
              )}
              title={item.description}
            >
              {/* Indicateur d'activation animé */}
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className={cn(
                    "absolute bg-turf-green-600",
                    variant === "sidebar" 
                      ? "-left-3 top-0 h-full w-1 rounded-r-full" 
                      : "-bottom-3 left-0 h-1 w-full rounded-t-full"
                  )}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className={cn(
                "flex items-center gap-3",
                variant === "horizontal" && "flex-col gap-1"
              )}>
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-turf-green-700" : "text-gray-600 group-hover:text-turf-green-600"
                  )} />
                  
                  {/* Badge de notification */}
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-racing-gold-500 text-xs font-medium text-white shadow-sm"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>

                {showLabels && (
                  <span className={cn(
                    "font-medium transition-colors",
                    variant === "horizontal" && "text-xs",
                    active ? "text-turf-green-800" : "text-gray-700 group-hover:text-turf-green-700"
                  )}>
                    {item.label}
                  </span>
                )}
              </div>

              {/* Effet de survol */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-turf-green-500/10 to-racing-gold-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      className={cn(
        "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm",
        !isOpen && "pointer-events-none"
      )}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full w-80 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-full bg-turf-green-100 p-2">
            <Horse className="h-6 w-6 text-turf-green-700" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Tunisia Jockey Club</h2>
            <p className="text-sm text-gray-600">Navigation mobile</p>
          </div>
        </div>

        <HippicNavigation variant="sidebar" />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={onClose}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Paramètres</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
