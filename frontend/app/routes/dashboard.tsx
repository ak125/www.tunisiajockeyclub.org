import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, Link } from '@remix-run/react';
import { BarChart3, Calendar, Settings, Users, Trophy, Activity } from 'lucide-react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({});
};

export default function DashboardLayout() {
    const dashboardItems = [
        { name: 'Vue d\'ensemble', href: '/dashboard', icon: BarChart3, description: 'Aperçu général des données' },
        { name: 'Courses', href: '/dashboard/races', icon: Trophy, description: 'Gestion des courses' },
        { name: 'Chevaux', href: '/dashboard/horses', icon: Activity, description: 'Base de données des chevaux' },
        { name: 'Jockeys', href: '/dashboard/jockeys', icon: Users, description: 'Profils des jockeys' },
        { name: 'Calendrier', href: '/dashboard/calendar', icon: Calendar, description: 'Planning des courses' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, description: 'Analyses avancées' },
        { name: 'Paramètres', href: '/dashboard/settings', icon: Settings, description: 'Configuration' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Dashboard Tunisia Jockey Club
                </h1>
                <p className="text-gray-600">
                    Centre de contrôle pour la gestion des courses et des ratings
                </p>
            </div>

            {/* Navigation rapide du dashboard */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Accès rapide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className="group flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                                <item.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
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

            <Outlet />
        </div>
    );
}
