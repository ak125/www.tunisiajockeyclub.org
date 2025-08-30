import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet, useLoaderData, useLocation, Link } from '@remix-run/react';
import { 
  BarChart3, Calendar, Settings, Users, Trophy, Activity, 
  Home, Star, Shield, TrendingUp, Clock,
  FileText, Bell, User
} from 'lucide-react';
import { getUserFromSession } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request);
  
  if (!user) {
    throw new Response('Non autorisé', { status: 401 });
  }

  // Récupérer les stats globales depuis le backend
  try {
    const statsResponse = await fetch('http://localhost:3000/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${user.sessionToken}`,
      },
    });
    
    const stats = statsResponse.ok ? await statsResponse.json() : {
      totalHorses: 0,
      totalRaces: 0,
      totalJockeys: 0,
      upcomingRaces: 0,
    };
    
    return json({
      user,
      stats,
      permissions: {
        canManageHorses: user.email?.includes('admin') || user.email?.includes('manager'),
        canManageRaces: user.email?.includes('admin'),
        canManageRatings: user.email?.includes('admin') || user.email?.includes('rating'),
        canViewReports: true,
        isAdmin: user.email?.includes('admin'),
      },
    });
  } catch (error) {
    console.error('Erreur chargement stats dashboard:', error);
    return json({
      user,
      stats: {
        totalHorses: 0,
        totalRaces: 0,
        totalJockeys: 0,
        upcomingRaces: 0,
      },
      permissions: {
        canManageHorses: user.email?.includes('admin'),
        canManageRaces: user.email?.includes('admin'),
        canManageRatings: user.email?.includes('admin'),
        canViewReports: true,
        isAdmin: user.email?.includes('admin'),
      },
    });
  }
}

export default function UnifiedDashboard() {
  const { user, stats, permissions } = useLoaderData<typeof loader>();
  const location = useLocation();
  
  // Navigation unifiée selon les permissions
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Accueil', href: '/dashboard', icon: Home, description: 'Vue d\'ensemble' },
      { name: 'Courses', href: '/dashboard/races', icon: Trophy, description: 'Gestion des courses' },
      { name: 'Chevaux', href: '/dashboard/horses', icon: Activity, description: 'Base de données des chevaux' },
      { name: 'Jockeys', href: '/dashboard/jockeys', icon: Users, description: 'Profils des jockeys' },
      { name: 'Calendrier', href: '/dashboard/calendar', icon: Calendar, description: 'Planning des courses' },
    ];

    const advancedItems = [
      { name: 'Calendrier', href: '/dashboard/calendar', icon: Calendar, description: 'Événements et planning' },
      { name: 'Tournois', href: '/dashboard/tournaments', icon: Trophy, description: 'Gestion des tournois' },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, description: 'Analyses et statistiques' },
      { name: 'Performances', href: '/dashboard/performance', icon: TrendingUp, description: 'Suivi des performances' },
      { name: 'Rapports', href: '/dashboard/reports', icon: FileText, description: 'Génération de rapports' },
    ];    const adminItems = [
      { name: 'Ratings IFHA', href: '/dashboard/ratings', icon: Star, description: 'Système de rating' },
      { name: 'Sécurité', href: '/dashboard/security', icon: Shield, description: 'Gestion sécurité' },
      { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, description: 'Centre de notifications' },
      { name: 'Paramètres', href: '/dashboard/settings', icon: Settings, description: 'Configuration système' },
    ];

    let items = [...baseItems, ...advancedItems];
    
    if (permissions.isAdmin) {
      items = [...items, ...adminItems];
    }
    
    return items;
  };

  const navigationItems = getNavigationItems();
  const isHomePage = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header unifié */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Trophy className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tunisia Jockey Club</h1>
                <p className="text-sm text-gray-500">Dashboard Unifié</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">
                  {permissions.isAdmin ? 'Administrateur' : 'Utilisateur'}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats rapides */}
        {isHomePage && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chevaux</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalHorses}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRaces}</p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jockeys</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJockeys}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses à venir</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingRaces}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation unifiée */}
        {isHomePage && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Navigation rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100">
                    <item.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-green-600">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contenu dynamique */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Outlet context={{ user, stats, permissions }} />
        </div>
      </div>
    </div>
  );
}
