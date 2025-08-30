import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { 
  Activity, Server, Clock, AlertCircle,
  CheckCircle, XCircle, Zap, Monitor, HardDrive, Cpu,
  MemoryStick, Network, TrendingUp, RefreshCw, Bell
} from "lucide-react";
import { useEffect, useState } from "react";

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
        responseTime: Math.floor(Math.random() * 30) + 45,
        lastCheck: new Date().toISOString(),
        uptime: 99.7
      },
      {
        name: 'Frontend Remix',
        status: 'online',
        responseTime: Math.floor(Math.random() * 15) + 20,
        lastCheck: new Date().toISOString(),
        uptime: 99.8
      },
      {
        name: 'Cache Redis',
        status: 'online',
        responseTime: Math.floor(Math.random() * 10) + 5,
        lastCheck: new Date().toISOString(),
        uptime: 99.9
      },
      {
        name: 'File Storage',
        status: 'online',
        responseTime: Math.floor(Math.random() * 40) + 80,
        lastCheck: new Date().toISOString(),
        uptime: 99.5
      }
    ];

    // Métriques de performance historiques (dernières 24h)
    const performanceHistory = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      responseTime: Math.floor(Math.random() * 50) + 80 + Math.sin(i / 4) * 20,
      requests: Math.floor(Math.random() * 200) + 300 + Math.cos(i / 3) * 100,
      errors: Math.floor(Math.random() * 10) + Math.sin(i / 6) * 5
    }));

    return json({
      systemMetrics,
      services,
      performanceHistory,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur monitoring:', error);
    return json({
      systemMetrics: {
        status: 'critical' as const,
        uptime: 0,
        responseTime: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        activeConnections: 0
      },
      services: [],
      performanceHistory: [],
      timestamp: new Date().toISOString()
    });
  }
}

export default function DashboardPerformance() {
  const { systemMetrics, services, performanceHistory, timestamp } = useLoaderData<typeof loader>();
  const [realTimeData, setRealTimeData] = useState(systemMetrics);
  const [lastUpdate, setLastUpdate] = useState(timestamp);

  // Simuler des mises à jour temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50) + 100,
        cpuUsage: Math.floor(Math.random() * 30) + 15,
        memoryUsage: Math.floor(Math.random() * 40) + 45,
        activeConnections: Math.floor(Math.random() * 50) + 150
      }));
      setLastUpdate(new Date().toISOString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
      case 'offline': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'bg-red-500';
    if (usage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Monitor className="h-10 w-10 text-blue-500" />
              Monitoring Performance
            </h1>
            <p className="text-gray-600 mt-2">
              Surveillance système en temps réel • Dernière mise à jour: {new Date(lastUpdate).toLocaleTimeString('fr-FR')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alertes
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </motion.div>

        {/* Status général */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tous les systèmes opérationnels</h2>
                <p className="text-gray-600">Uptime: {realTimeData.uptime}% • Temps de réponse moyen: {realTimeData.responseTime}ms</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <Activity className="w-5 h-5" />
                <span className="pulse-dot bg-green-500"></span>
                LIVE
              </div>
            </div>
          </div>
        </motion.div>

        {/* Métriques système temps réel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{realTimeData.cpuUsage}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CPU Usage</span>
                <span className={`font-medium ${realTimeData.cpuUsage > 70 ? 'text-red-500' : 'text-green-500'}`}>
                  {realTimeData.cpuUsage > 70 ? 'Élevé' : 'Normal'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full ${getUsageColor(realTimeData.cpuUsage)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${realTimeData.cpuUsage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MemoryStick className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{realTimeData.memoryUsage}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">RAM Usage</span>
                <span className={`font-medium ${realTimeData.memoryUsage > 80 ? 'text-red-500' : 'text-green-500'}`}>
                  {realTimeData.memoryUsage > 80 ? 'Élevé' : 'Normal'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full ${getUsageColor(realTimeData.memoryUsage)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${realTimeData.memoryUsage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{realTimeData.diskUsage}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disque Usage</span>
                <span className="font-medium text-green-500">Normal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${realTimeData.diskUsage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Network className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{realTimeData.activeConnections}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Connexions Actives</span>
                <span className="font-medium text-green-500">Stable</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Zap className="w-3 h-3" />
                <span>Temps réel</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Status des services */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Server className="w-6 h-6" />
              Status des Services
            </h2>
            
            <div className="space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        Uptime: {service.uptime}% • Dernière vérification: {new Date(service.lastCheck).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{service.responseTime}ms</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Graphique de performance */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Performance 24h
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(performanceHistory.reduce((sum, h) => sum + h.responseTime, 0) / performanceHistory.length)}ms</p>
                  <p className="text-sm text-gray-500">Temps réponse moyen</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{Math.round(performanceHistory.reduce((sum, h) => sum + h.requests, 0) / performanceHistory.length)}</p>
                  <p className="text-sm text-gray-500">Requêtes/h moyennes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{Math.round(performanceHistory.reduce((sum, h) => sum + h.errors, 0))}</p>
                  <p className="text-sm text-gray-500">Erreurs totales</p>
                </div>
              </div>

              {/* Graphique simple en CSS */}
              <div className="h-40 flex items-end justify-between gap-1 bg-gray-50 rounded-lg p-4">
                {performanceHistory.slice(-12).map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full bg-blue-500 rounded-sm min-h-1"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.responseTime / 200) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    />
                    <span className="text-xs text-gray-400">{data.hour}h</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alertes récentes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Alertes & Événements Récents
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Système de sauvegarde completé</p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <Activity className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mise à jour de sécurité appliquée</p>
                <p className="text-xs text-gray-500">Il y a 6 heures</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pic de trafic détecté</p>
                <p className="text-xs text-gray-500">Il y a 12 heures</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Link
            to="/dashboard-main"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Monitor className="h-5 w-5" />
            Dashboard Principal
          </Link>
          <Link
            to="/dashboard/analytics"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            Analytics
          </Link>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
            }
          }
        `
      }} />
    </div>
  );
}
