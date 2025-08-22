import { Outlet } from '@remix-run/react';
import { Link, useLocation } from '@remix-run/react';
import { BarChart3, Calendar, Settings, Users, Trophy, Home, Activity } from 'lucide-react';

export default function DashboardLayout() {
    const location = useLocation();
    
    const navigation = [
        { name: 'Vue d\'ensemble', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
        { name: 'Courses', href: '/dashboard/races', icon: Trophy, current: location.pathname.startsWith('/dashboard/races') },
        { name: 'Chevaux', href: '/dashboard/horses', icon: Activity, current: location.pathname.startsWith('/dashboard/horses') },
        { name: 'Jockeys', href: '/dashboard/jockeys', icon: Users, current: location.pathname.startsWith('/dashboard/jockeys') },
        { name: 'Calendrier', href: '/dashboard/calendar', icon: Calendar, current: location.pathname.startsWith('/dashboard/calendar') },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, current: location.pathname.startsWith('/dashboard/analytics') },
        { name: 'Paramètres', href: '/dashboard/settings', icon: Settings, current: location.pathname.startsWith('/dashboard/settings') },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            🏇 Tunisia Jockey Club
                        </h1>
                    </Link>
                </div>
                <nav className="flex flex-1 flex-col px-4 py-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-2">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={`
                                        group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors
                                        ${item.current
                                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`h-5 w-5 shrink-0 ${
                                            item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                        }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="pl-64">
                <main className="py-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
