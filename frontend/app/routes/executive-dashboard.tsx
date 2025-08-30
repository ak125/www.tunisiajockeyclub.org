import { json, type LoaderFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExecutiveBadge, ExecutiveButton, ExecutiveStatus, ExecutiveProgress } from "~/components/ui/executive-components";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Fetch system status
    const statusResponse = await fetch('http://localhost:3000/api/status');
    let systemHealth = {
      status: 'maintenance',
      isHealthy: false,
      lastCheck: new Date().toISOString(),
      environment: 'development'
    };

    if (statusResponse.ok) {
      systemHealth = await statusResponse.json();
    }

    // Fetch dashboard metrics
    const dashboardResponse = await fetch('http://localhost:3000/api/dashboard/data');
    let metrics = {
      horses: { total: '45', change: '+5.2%', description: 'Chevaux enregistrés' },
      users: { total: '10', change: '+12.1%', description: 'Utilisateurs actifs' },
      races: { total: '5', change: '+8.3%', description: 'Courses programmées' },
      jockeys: { total: '5', change: '+3.7%', description: 'Jockeys certifiés' }
    };

    if (dashboardResponse.ok) {
      const data = await dashboardResponse.json();
      metrics = {
        horses: {
          total: data.totalHorses?.toString() || '45',
          change: '+5.2%',
          description: 'Chevaux enregistrés'
        },
        users: {
          total: data.users?.toString() || '10',
          change: '+12.1%',
          description: 'Utilisateurs actifs'
        },
        races: {
          total: data.races?.toString() || '5',
          change: '+8.3%',
          description: 'Courses programmées'
        },
        jockeys: {
          total: data.jockeys?.toString() || '5',
          change: '+3.7%',
          description: 'Jockeys certifiés'
        }
      };
    }

    // Mock recent activity data
    const recentActivity = [
      {
        id: '1',
        type: 'license',
        description: 'Nouvelle licence jockey approuvée',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: 'success' as const
      },
      {
        id: '2',
        type: 'race',
        description: 'Course programmée - Hippodrome de Sousse',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: 'success' as const
      },
      {
        id: '3',
        type: 'compliance',
        description: 'Audit de conformité en cours',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        status: 'warning' as const
      }
    ];

    // Mock upcoming events
    const upcomingEvents = [
      {
        id: '1',
        name: 'Grand Prix National',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        location: 'Hippodrome de Tunis',
        status: 'scheduled' as const
      },
      {
        id: '2',
        name: 'Course des Professionnels',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        location: 'Hippodrome de Sousse',
        status: 'scheduled' as const
      }
    ];

    return json({ 
      systemHealth, 
      metrics, 
      recentActivity, 
      upcomingEvents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Loader error:', error);
    return json({ 
      systemHealth: {
        status: 'error',
        isHealthy: false,
        lastCheck: new Date().toISOString(),
        environment: 'development'
      },
      metrics: {
        horses: { total: '---', change: '--', description: 'Données indisponibles' },
        users: { total: '---', change: '--', description: 'Données indisponibles' },
        races: { total: '---', change: '--', description: 'Données indisponibles' },
        jockeys: { total: '---', change: '--', description: 'Données indisponibles' }
      },
      recentActivity: [],
      upcomingEvents: []
    });
  }
};

export default function ExecutiveDashboard() {
  const { systemHealth, metrics, recentActivity, upcomingEvents } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  
  // State management
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      revalidator.revalidate();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, revalidator]);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'Toutes les activités' },
    { value: 'license', label: 'Licences' },
    { value: 'race', label: 'Courses' },
    { value: 'compliance', label: 'Conformité' }
  ];

  // Time range options
  const timeRangeOptions = [
    { value: '24h', label: 'Dernières 24h' },
    { value: '7d', label: 'Derniers 7 jours' },
    { value: '30d', label: 'Derniers 30 jours' },
    { value: '90d', label: 'Derniers 90 jours' }
  ];

  // Filter activity based on selected filter and search term
  const filteredActivity = recentActivity.filter(activity => {
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter;
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🏇</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Club Jockey Tunisie</h1>
                  <p className="text-sm text-slate-600">Dashboard Exécutif</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-8">
                <div className={`w-2 h-2 rounded-full ${systemHealth.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-slate-600">
                  Système {systemHealth.isHealthy ? 'Opérationnel' : 'En Maintenance'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  autoRefresh
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {autoRefresh ? '🔄 Auto' : '⏸ Manuel'}
              </button>

              {/* Manual refresh */}
              <ExecutiveButton
                onClick={() => revalidator.revalidate()}
                disabled={revalidator.state === 'loading'}
                className="px-4 py-2"
              >
                {revalidator.state === 'loading' ? '⏳' : '🔄'} Actualiser
              </ExecutiveButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">Filtrer:</span>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {filterOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">Période:</span>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {timeRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full lg:w-auto">
                <span className="text-sm font-medium text-slate-700">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher dans les activités..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1 lg:w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {[
            { key: 'horses', icon: '🐎', color: 'from-blue-500 to-blue-600' },
            { key: 'users', icon: '👥', color: 'from-green-500 to-green-600' },
            { key: 'races', icon: '🏆', color: 'from-purple-500 to-purple-600' },
            { key: 'jockeys', icon: '🏅', color: 'from-orange-500 to-orange-600' }
          ].map((item, index) => {
            const metric = metrics[item.key as keyof typeof metrics];
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
                      {item.icon}
                    </div>
                    <ExecutiveBadge variant="premium" size="sm">
                      {metric.change}
                    </ExecutiveBadge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {metric.total}
                    </h3>
                    <p className="text-sm text-slate-600">{metric.description}</p>
                    <ExecutiveProgress 
                      value={75} 
                      size={300}
                      strokeWidth={4}
                      showValue={false}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Activité Récente</h2>
                <ExecutiveBadge variant="authority" size="sm">
                  {filteredActivity.length} activités
                </ExecutiveBadge>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.description}</p>
                        <p className="text-xs text-slate-600">
                          {new Date(activity.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>

                      <ExecutiveBadge 
                        variant={activity.status === 'success' ? 'certified' : 
                               activity.status === 'warning' ? 'premium' : 'ministerial'}
                        size="sm"
                      >
                        {activity.type}
                      </ExecutiveBadge>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredActivity.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p>Aucune activité correspondant aux critères</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Événements à Venir</h2>
              
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                  >
                    <h3 className="font-medium text-slate-800 mb-2">{event.name}</h3>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</p>
                      <p>📍 {event.location}</p>
                    </div>
                    <div className="mt-3">
                      <ExecutiveBadge variant="authority" size="sm">
                        {event.status === 'scheduled' ? 'Programmé' : event.status}
                      </ExecutiveBadge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">État du Système</h2>
              
              <div className="space-y-4">
                <ExecutiveStatus
                  status={systemHealth.isHealthy ? 'operational' : 'critical'}
                  label="Système Principal"
                />
                
                <ExecutiveStatus
                  status="operational"
                  label="Base de Données"
                />
                
                <ExecutiveStatus
                  status="warning"
                  label="Sauvegarde"
                />
                
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Dernière vérification: {new Date(systemHealth.lastCheck).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
