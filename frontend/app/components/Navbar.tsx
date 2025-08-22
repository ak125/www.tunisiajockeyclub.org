import { Link, Form, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Home, 
  BarChart3, 
  Calendar, 
  Trophy, 
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { useOptionalUser } from "~/root";

export const Navbar = ({ logo }: { logo: string }) => {
  const user = useOptionalUser();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Accueil", icon: Home },
    { path: "/dashboard-main", label: "Dashboard", icon: BarChart3 },
    { path: "/race-management", label: "Courses", icon: Calendar },
    { path: "/statistics", label: "Statistiques", icon: Trophy },
    { path: "/profile", label: "Profil", icon: Users },
  ];
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl">🏇</span>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tunisia Jockey Club
              </span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-blue-100 text-blue-700 shadow-sm" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700 font-medium">
                    {(user as any).firstName && (user as any).lastName 
                      ? `${(user as any).firstName} ${(user as any).lastName}` 
                      : user.email.split('@')[0]
                    }
                  </span>
                </div>
                <Form method="post" action="/auth/logout">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </Form>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/login") 
                      ? "bg-blue-100 text-blue-700 shadow-sm" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="px-2 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path) 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.nav>
  );
};