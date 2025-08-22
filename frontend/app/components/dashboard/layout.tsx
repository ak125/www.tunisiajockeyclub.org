import { useState } from 'react';
import { Link, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { 
  Home, Trophy, Zap, Users, Calendar, 
  BarChart3, Settings, Menu, Bell, Search,
  Moon, Sun, LogOut, Activity, Wifi
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Courses', href: '/admin/races', icon: Trophy },
  { name: 'Chevaux', href: '/admin/horses', icon: Zap },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Calendrier', href: '/admin/calendar', icon: Calendar },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className={`min-h-screen bg-gray-50 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TJC Admin</h1>
                <p className="text-xs text-gray-500">Tunisia Jockey Club</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin TJC</p>
                <p className="text-xs text-gray-500">admin@tjc.tn</p>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-lg">
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Live Status */}
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Wifi className="w-5 h-5 text-green-500" />
                </motion.div>
                <span className="text-sm text-green-600 font-medium">En ligne</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
