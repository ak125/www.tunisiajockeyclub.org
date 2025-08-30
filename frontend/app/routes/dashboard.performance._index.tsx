import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Activity, Server, Clock, AlertCircle,
  CheckCircle, XCircle, Zap, Monitor, HardDrive, Cpu,
  MemoryStick, Network, RefreshCw, Bell
} from "lucide-react";
import { useEffect, useState } from "react";
import { requirePermission, Permission } from '../utils/auth.server';

interface SystemMetrics {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastCheck: string;
  uptime: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Vérifier les permissions d'accès aux performances système
  await requirePermission(request, Permission.ADMIN);

  try {
    // Simuler des métriques système réelles
    const systemMetrics: SystemMetrics = {
      status: 'healthy',
      uptime: 99.8,
      responseTime: Math.floor(Math.random() * 50) + 100,
      cpuUsage: Math.floor(Math.random() * 30) + 15,
      memoryUsage: Math.floor(Math.random() * 40) + 45,
      diskUsage: Math.floor(Math.random() * 20) + 25,
      activeConnections: Math.floor(Math.random() * 50) + 150
    };

    const services: ServiceStatus[] = [
      {
        name: 'Base de données Supabase',
        status: 'online',
        responseTime: Math.floor(Math.random() * 20) + 25,
        lastCheck: new Date().toISOString(),
        uptime: 99.9
      },
      {
        name: 'API Backend NestJS',
        status: 'online',
        responseTime: Math.floor(Math.random() * 30) + 50,
        lastCheck: new Date().toISOString(),
        uptime: 99.7
      },
      {
        name: 'Cache Redis',
        status: 'online',
        responseTime: Math.floor(Math.random() * 10) + 5,
        lastCheck: new Date().toISOString(),
        uptime: 100
      },
      {
        name: 'Frontend Remix',
        status: 'online',
        responseTime: Math.floor(Math.random() * 40) + 80,
        lastCheck: new Date().toISOString(),
        uptime: 99.8
      }
    ];

    return json({
      systemMetrics,
      services,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur chargement métriques performance:', error);
    
    // Données de fallback en cas d'erreur
    return json({
      systemMetrics: {
        status: 'warning' as const,
        uptime: 0,
        responseTime: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        activeConnections: 0
      },
      services: [],
      lastUpdated: new Date().toISOString(),
      error: 'Erreur de chargement des métriques'
    });
  }
}

export default function DashboardPerformance() {
  const { systemMetrics, services, lastUpdated } = useLoaderData<typeof loader>();
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoRefresh) {
      interval = setInterval(() => {
        // Rafraîchissement automatique toutes les 30 secondes
        window.location.reload();
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-50';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'degraded':
        return <AlertCircle className="h-4 w-4" />;
      case 'critical':
      case 'offline':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Performance Système</h1>
          <p className="text-sm text-gray-500 mt-1">
            Surveillance des métriques et services • Dernière mise à jour: {new Date(lastUpdated).toLocaleTimeString('fr-FR')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAutoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            <span>{isAutoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualiser</span>
          </motion.button>
        </div>
      </div>

      {/* Vue d'ensemble du système */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Status général */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status Système</p>
              <div className={`flex items-center space-x-2 mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemMetrics.status)}`}>
                {getStatusIcon(systemMetrics.status)}
                <span className="capitalize">{systemMetrics.status === 'healthy' ? 'Sain' : systemMetrics.status}</span>
              </div>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Temps de disponibilité */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibilité</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemMetrics.uptime}%</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Temps de réponse */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temps Réponse</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemMetrics.responseTime}ms</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        {/* Connexions actives */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connexions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{systemMetrics.activeConnections}</p>
            </div>
            <Network className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </motion.div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation des ressources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Ressources Système</h2>
            <Monitor className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {/* CPU */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">CPU</span>
                </div>
                <span className="text-sm text-gray-600">{systemMetrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${systemMetrics.cpuUsage}%` }}
                />
              </div>
            </div>

            {/* Mémoire */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Mémoire</span>
                </div>
                <span className="text-sm text-gray-600">{systemMetrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                />
              </div>
            </div>

            {/* Disque */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Stockage</span>
                </div>
                <span className="text-sm text-gray-600">{systemMetrics.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${systemMetrics.diskUsage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* État des services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Services</h2>
            <Server className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    <span className="capitalize">{service.status === 'online' ? 'En ligne' : service.status}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">Disponibilité: {service.uptime}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{service.responseTime}ms</p>
                  <p className="text-xs text-gray-500">
                    {new Date(service.lastCheck).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alertes et notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Alertes Système</h2>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          {systemMetrics.status === 'healthy' ? (
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Système fonctionnel</p>
                <p className="text-xs text-green-600">Tous les services sont opérationnels</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Surveillance active</p>
                <p className="text-xs text-yellow-600">Monitoring des performances en cours</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
