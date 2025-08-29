import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { requireAuth } from "../utils/auth.server";
import { 
  useResponsive, 
  MobileNavigation, 
  ResponsiveHeader, 
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveMetrics,
  ResponsiveModal
} from "../components/ui/responsive-components";
import { ExportPanel } from "../components/ui/export-panel";
import { NotificationPanel } from "../components/ui/notification-panel";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  
  let dashboardData;
  
  try {
    // Récupérer les vraies données depuis l'API backend
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/dashboard/data`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const apiData = await response.json();
      
      // Adapter les données API au format mobile dashboard
      dashboardData = {
        stats: {
          totalLicenses: apiData.overview?.totalHorses || 847,
          activeLicenses: apiData.overview?.totalJockeys || 673,
          pendingApplications: apiData.overview?.totalRaces || 34,
          totalRevenue: 125430, // À récupérer de l'API
          monthlyGrowth: 12.5,   // À récupérer de l'API
          systemStatus: "operational"
        },
        systemHealth: {
          isHealthy: true,
          apiStatus: 'operational',
          databaseStatus: 'operational',
          lastCheck: new Date().toISOString(),
          responseTime: 127
        },
        recentActivity: apiData.recentActivity || [
          {
            id: 1,
            type: 'license_approved',
            user: 'Mohamed Salhi',
            timestamp: new Date(Date.now() - 30000).toISOString(),
            description: 'Licence jockey approuvée'
          },
          {
            id: 2,
            type: 'payment_received',
            user: 'Ahmed Ben Ali',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            description: 'Paiement licence - 850 TND'
          }
        ],
        upcomingEvents: apiData.upcomingRaces || [
          {
            id: 1,
            title: 'Course Hippique Nationale',
            date: '2024-12-25',
            location: 'Hippodrome de Tunis',
            participants: 24
          },
          {
            id: 2,
            title: 'Formation Jockeys Débutants',
            date: '2024-12-28',
            location: 'Centre de Formation',
            participants: 12
          }
        ]
      };
    } else {
      // Fallback vers données simulées si API non disponible
      dashboardData = {
        stats: {
          totalLicenses: 847,
          activeLicenses: 673,
          pendingApplications: 34,
          totalRevenue: 125430,
          monthlyGrowth: 12.5,
          systemStatus: "fallback"
        },
        systemHealth: {
          isHealthy: false,
          apiStatus: 'unavailable',
          databaseStatus: 'unknown',
          lastCheck: new Date().toISOString(),
          responseTime: 0
        },
        recentActivity: [
          {
            id: 1,
            type: 'license_approved',
            user: 'Mohamed Salhi (Demo)',
            timestamp: new Date(Date.now() - 30000).toISOString(),
            description: 'Licence jockey approuvée - données simulées'
          }
        ],
        upcomingEvents: [
          {
            id: 1,
            title: 'Course Hippique Nationale (Demo)',
            date: '2024-12-25',
            location: 'Hippodrome de Tunis',
            participants: 24
          }
        ]
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données dashboard:', error);
    
    // Données de secours en cas d'erreur
    dashboardData = {
      stats: {
        totalLicenses: 847,
        activeLicenses: 673,
        pendingApplications: 34,
        totalRevenue: 125430,
        monthlyGrowth: 12.5,
        systemStatus: "error"
      },
      systemHealth: {
        isHealthy: false,
        apiStatus: 'error',
        databaseStatus: 'error',
        lastCheck: new Date().toISOString(),
        responseTime: 0
      },
      recentActivity: [
        {
          id: 1,
          type: 'system_error',
          user: 'Système',
          timestamp: new Date().toISOString(),
          description: 'Erreur de connexion à l\'API'
        }
      ],
      upcomingEvents: []
    };
  }

  return json({ user, dashboardData });
}
    systemHealth: {
      isHealthy: true,
      apiStatus: 'operational',
      databaseStatus: 'operational',
      lastCheck: new Date().toISOString(),
      responseTime: 127
    },
    recentActivity: [
      {
        id: 1,
        type: 'license_approved',
        user: 'Mohamed Salhi',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        description: 'Licence jockey approuvée'
      },
      {
        id: 2,
        type: 'payment_received',
        user: 'Ahmed Ben Ali',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        description: 'Paiement licence - 850 TND'
      },
      {
        id: 3,
        type: 'application_submitted',
        user: 'Fatma Khouja',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        description: 'Nouvelle demande de licence'
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: 'Course Hippique Nationale',
        date: '2024-12-25',
        location: 'Hippodrome de Tunis',
        participants: 24
      },
      {
        id: 2,
        title: 'Formation Jockeys Débutants',
        date: '2024-12-28',
        location: 'Centre de Formation',
        participants: 12
      }
    ]
  };

  return json({ user, dashboardData });
}

export default function MobileDashboard() {
  const { user, dashboardData } = useLoaderData<typeof loader>();
  const { isMobile, isTablet } = useResponsive();
  
  // États pour la navigation mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Fermer le menu mobile lors du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Métriques pour l'affichage responsive
  const metrics = [
    {
      label: "Licences Totales",
      value: dashboardData.metrics.totalLicenses.toLocaleString(),
      change: "+12%",
      icon: "📋",
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Licences Actives",
      value: dashboardData.metrics.activeLicenses.toLocaleString(),
      change: "+8%",
      icon: "✅",
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "En Attente",
      value: dashboardData.metrics.pendingApplications.toString(),
      change: "-3%",
      icon: "⏳",
      color: "from-orange-500 to-amber-500"
    },
    {
      label: "Revenus Mensuels",
      value: `${(dashboardData.metrics.monthlyRevenue / 1000).toFixed(0)}K TND`,
      change: "+15%",
      icon: "💰",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Mobile */}
      <AnimatePresence>
        <MobileNavigation
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={user}
          systemHealth={dashboardData.systemHealth}
        />
      </AnimatePresence>

      {/* Header Responsive */}
      <ResponsiveHeader
        title="Dashboard Sécurisé"
        subtitle="Système de gestion TJC"
        user={user}
        systemHealth={dashboardData.systemHealth}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        actions={
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <NotificationPanel
              isOpen={isNotificationsOpen}
              onToggle={() => setIsNotificationsOpen(!isNotificationsOpen)}
            />
            
            {/* Export - masqué sur mobile très petit */}
            {!isMobile && (
              <button
                onClick={() => setSelectedModal('export')}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="text-lg">📊</span>
              </button>
            )}
          </div>
        }
      />

      {/* Contenu Principal */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Actions rapides mobile */}
        {isMobile && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedModal('export')}
                className="flex items-center justify-center space-x-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <span>📊</span>
                <span className="text-sm font-semibold">Exporter</span>
              </button>
              <button
                onClick={() => setSelectedModal('quick-actions')}
                className="flex items-center justify-center space-x-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <span>⚡</span>
                <span className="text-sm font-semibold">Actions</span>
              </button>
            </div>
          </div>
        )}

        {/* Métriques Principales */}
        <div className="mb-6">
          <ResponsiveMetrics metrics={metrics} />
        </div>

        {/* Contenu en grille responsive */}
        <ResponsiveGrid 
          cols={{ mobile: 1, tablet: 2, desktop: 3, large: 3 }}
          className="mb-6"
        >
          {/* État Système */}
          <ResponsiveCard className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">État Système</h3>
              <div className={`w-3 h-3 rounded-full ${
                dashboardData.systemHealth.isHealthy ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">API</span>
                <span className="text-sm font-semibold text-green-600 capitalize">
                  {dashboardData.systemHealth.apiStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Base de données</span>
                <span className="text-sm font-semibold text-green-600 capitalize">
                  {dashboardData.systemHealth.databaseStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Temps de réponse</span>
                <span className="text-sm font-semibold text-slate-800">
                  {dashboardData.systemHealth.responseTime}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Disponibilité</span>
                <span className="text-sm font-semibold text-green-600">
                  {dashboardData.metrics.systemUptime}%
                </span>
              </div>
            </div>
          </ResponsiveCard>

          {/* Activité Récente */}
          <ResponsiveCard className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Activité Récente</h3>
              <button
                onClick={() => setSelectedModal('activity')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Tout voir
              </button>
            </div>
            
            <div className="space-y-3">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-slate-600 mb-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(activity.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ResponsiveCard>

          {/* Événements à venir */}
          <ResponsiveCard className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Événements</h3>
              <button
                onClick={() => setSelectedModal('events')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Planning
              </button>
            </div>
            
            <div className="space-y-3">
              {dashboardData.upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">
                    📍 {event.location}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600 font-semibold">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="text-slate-600">
                      {event.participants} participants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>

        {/* Actions rapides desktop */}
        {!isMobile && (
          <ResponsiveCard className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Actions Rapides</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setSelectedModal('new-license')}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all border border-green-100"
              >
                <span className="text-2xl">📝</span>
                <div className="text-left">
                  <p className="font-semibold text-green-800">Nouvelle</p>
                  <p className="text-sm text-green-600">Licence</p>
                </div>
              </button>

              <button 
                onClick={() => setSelectedModal('reports')}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-md transition-all border border-blue-100"
              >
                <span className="text-2xl">📊</span>
                <div className="text-left">
                  <p className="font-semibold text-blue-800">Rapports</p>
                  <p className="text-sm text-blue-600">Analytics</p>
                </div>
              </button>

              <button 
                onClick={() => setSelectedModal('settings')}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all border border-purple-100"
              >
                <span className="text-2xl">⚙️</span>
                <div className="text-left">
                  <p className="font-semibold text-purple-800">Paramètres</p>
                  <p className="text-sm text-purple-600">Config</p>
                </div>
              </button>

              <button 
                onClick={() => setSelectedModal('support')}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl hover:shadow-md transition-all border border-orange-100"
              >
                <span className="text-2xl">💬</span>
                <div className="text-left">
                  <p className="font-semibold text-orange-800">Support</p>
                  <p className="text-sm text-orange-600">Aide</p>
                </div>
              </button>
            </div>
          </ResponsiveCard>
        )}
      </main>

      {/* Modales Responsives */}
      <AnimatePresence>
        {/* Modal Export */}
        <ResponsiveModal
          isOpen={selectedModal === 'export'}
          onClose={() => setSelectedModal(null)}
          title="Exporter les Données"
          size="medium"
        >
          <ExportPanel onClose={() => setSelectedModal(null)} />
        </ResponsiveModal>

        {/* Modal Actions Rapides Mobile */}
        <ResponsiveModal
          isOpen={selectedModal === 'quick-actions'}
          onClose={() => setSelectedModal(null)}
          title="Actions Rapides"
          size="small"
        >
          <div className="space-y-4">
            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all border border-green-100">
              <span className="text-2xl">📝</span>
              <span className="font-semibold text-green-800">Nouvelle Licence</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-md transition-all border border-blue-100">
              <span className="text-2xl">📊</span>
              <span className="font-semibold text-blue-800">Voir Rapports</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all border border-purple-100">
              <span className="text-2xl">⚙️</span>
              <span className="font-semibold text-purple-800">Paramètres</span>
            </button>
          </div>
        </ResponsiveModal>

        {/* Modal Activité Complète */}
        <ResponsiveModal
          isOpen={selectedModal === 'activity'}
          onClose={() => setSelectedModal(null)}
          title="Historique d'Activité"
          size="large"
        >
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{activity.user}</h4>
                  <p className="text-slate-600 mb-2">{activity.description}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(activity.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ResponsiveModal>
      </AnimatePresence>
    </div>
  );
}
