import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  Bell, 
  User, 
  Search, 
  ChevronDown,
  LogOut,
  Settings,
  Crown
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MobileNavigation } from "./hippic-navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "race" | "result" | "system";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Course à Kassar Said",
    message: "Nouvelle course programmée demain 14h30",
    time: "Il y a 2h",
    read: false,
    type: "race"
  },
  {
    id: "2",
    title: "Résultat Course 5",
    message: "SALAM TUNIS remporte la 5ème course",
    time: "Il y a 4h",
    read: false,
    type: "result"
  },
  {
    id: "3",
    title: "Maintenance système",
    message: "Maintenance programmée ce weekend",
    time: "Il y a 1j",
    read: true,
    type: "system"
  }
];

interface HippicHeaderProps {
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export function HippicHeader({ 
  user = { name: "Membre TJC", role: "Visiteur" }, 
  onSearch,
  showSearch = true 
}: HippicHeaderProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo et bouton mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="rounded-full bg-gradient-to-br from-turf-green-500 to-turf-green-600 p-2 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Tunisia Jockey Club</h1>
                <p className="text-xs text-gray-600">Excellence Hippique Tunisienne</p>
              </div>
            </motion.div>
          </div>

          {/* Barre de recherche */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher chevaux, jockeys, courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full bg-gray-50 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-turf-green-500 transition-all duration-200"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-racing-gold-500 text-xs font-bold text-white shadow-lg"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 rounded-xl bg-white p-4 shadow-xl border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {mockNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className={cn(
                            "rounded-lg p-3 transition-colors cursor-pointer",
                            notification.read 
                              ? "bg-gray-50 hover:bg-gray-100" 
                              : "bg-turf-green-50 hover:bg-turf-green-100"
                          )}
                          whileHover={{ x: 2 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-turf-green-500 mt-1" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-turf-green-600 hover:text-turf-green-700 font-medium">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu utilisateur */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-50 p-2 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-turf-green-500 to-racing-gold-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-56 rounded-xl bg-white p-2 shadow-xl border border-gray-200"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.role}</p>
                    </div>
                    <div className="py-2">
                      <motion.button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        whileHover={{ x: 2 }}
                      >
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </motion.button>
                      <motion.button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        whileHover={{ x: 2 }}
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNavigation 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />

      {/* Overlay pour fermer les menus */}
      <AnimatePresence>
        {(isNotificationsOpen || isUserMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30"
            onClick={() => {
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
