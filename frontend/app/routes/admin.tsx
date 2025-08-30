import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData, useLocation } from "@remix-run/react";
import { 
  Users, 
  Calendar, 
  Activity, 
  Trophy, 
  Settings, 
  Shield,
  BarChart3,
  LogOut,
  UserCheck,
  FileText
} from "lucide-react";
import { createSecureLoader } from "../utils/auth.server";

export const loader = createSecureLoader(async ({ context }) => {
  return json({ user: context.user });
}, { requireAuth: true, minRole: 'ADMIN' });

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();
  const pathname = location.pathname;

  // Navigation selon le rôle utilisateur
  const getNavigation = (userRole: string) => {
    const baseNavigation = [
      { name: 'Dashboard', href: '/admin', icon: BarChart3, current: pathname === '/admin' },
    ];

    // Pour les handicapeurs : accès limité au rating uniquement
    if (userRole === 'HANDICAPPER') {
      return [
        { name: 'Rating IFHA', href: '/admin/rating', icon: Trophy, current: pathname.startsWith('/admin/rating') },
      ];
    }

    // Pour admin et super admin : accès complet
    return [
      ...baseNavigation,
      { name: 'Courses', href: '/admin/courses', icon: Calendar, current: pathname.startsWith('/admin/courses') },
      { name: 'Chevaux', href: '/admin/horses', icon: Activity, current: pathname.startsWith('/admin/horses') },
      { name: 'Jockeys', href: '/admin/jockeys', icon: Users, current: pathname.startsWith('/admin/jockeys') },
      { name: 'Rating IFHA', href: '/admin/rating', icon: Trophy, current: pathname.startsWith('/admin/rating') },
      // Seuls les SUPER_ADMIN peuvent gérer users et sécurité
      ...(userRole === 'SUPER_ADMIN' ? [
        { name: 'Utilisateurs', href: '/admin/users', icon: Shield, current: pathname.startsWith('/admin/users') },
        { name: 'Sécurité', href: '/admin/security', icon: UserCheck, current: pathname.startsWith('/admin/security') },
      ] : []),
      { name: 'Rapports', href: '/admin/reports', icon: FileText, current: pathname.startsWith('/admin/reports') },
      { name: 'Paramètres', href: '/admin/settings', icon: Settings, current: pathname.startsWith('/admin/settings') }
    ];
  };

  const navigation = user ? getNavigation(user.role) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col h-16 px-4 bg-blue-600">
            <div className="flex items-center justify-center h-12">
              <h1 className="text-white text-xl font-bold">
                {user?.role === 'HANDICAPPER' ? 'Rating IFHA' : 'Admin TJC'}
              </h1>
            </div>
            {user?.role === 'HANDICAPPER' && (
              <div className="text-center">
                <span className="text-xs text-blue-100">Handicapeur Agréé</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500">{user?.role}</p>
              </div>
            </div>
            <Link
              to="/auth/logout"
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Déconnexion
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
