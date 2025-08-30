import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { 
  User, 
  Activity, 
  Calendar, 
  Trophy, 
  Settings, 
  LogOut,
  BarChart3,
  FileText,
  Bell
} from "lucide-react";
import { createSecureLoader } from "../utils/auth.server";

export const loader = createSecureLoader(async ({ context }) => {
  return json({ user: context.user });
}, { requireAuth: true, minRole: 'MEMBER' });

export default function MemberLayout() {
  const { user } = useLoaderData<typeof loader>();

  const navigation = [
    { name: 'Dashboard', href: '/member', icon: User },
    { name: 'Mes Chevaux', href: '/member/horses', icon: Activity },
    { name: 'Mes Courses', href: '/member/courses', icon: Calendar },
    { name: 'Mes Résultats', href: '/member/results', icon: Trophy },
    { name: 'Statistiques', href: '/member/stats', icon: BarChart3 },
    { name: 'Documents', href: '/member/documents', icon: FileText },
    { name: 'Notifications', href: '/member/notifications', icon: Bell },
    { name: 'Paramètres', href: '/member/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Member */}
        <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Espace Membre</h2>
                <p className="text-xs text-gray-500">TJC Portal</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
              <span className="inline-block px-2 py-1 mt-2 text-xs bg-blue-600 text-white rounded">
                {user?.role}
              </span>
            </div>
          </div>
          
          <nav className="p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors mb-1"
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 mt-8 pt-4">
              <Link 
                to="/logout" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </Link>
            </div>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
