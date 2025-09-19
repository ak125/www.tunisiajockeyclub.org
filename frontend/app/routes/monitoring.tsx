import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Activity, Server, Database, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";

export async function loader() {
  try {
    // Simuler des métriques de performance en temps réel
    const startTime = Date.now();
    
    // Test de l'API principale
    const apiResponse = await fetch('http://localhost:3000/api/courses');
    const apiTime = Date.now() - startTime;
    const apiStatus = apiResponse.ok;
    
    // Métriques simulées (en réalité ces données viendraient d'un service de monitoring)
    const metrics = {
      api: {
        status: apiStatus ? 'online' : 'offline',
        responseTime: apiTime,
        uptime: 99.8,
        requests24h: 15847
      },
      database: {
        status: 'online',
        responseTime: Math.floor(Math.random() * 15) + 5, // 5-20ms
        connections: Math.floor(Math.random() * 20) + 15, // 15-35 connections
        uptime: 99.9
      },
      cache: {
        status: 'online',
        hitRate: 0.847,
        memory: 67.3,
        keys: 1247
      },
      system: {
        cpuUsage: Math.floor(Math.random() * 30) + 25, // 25-55%
        memoryUsage: Math.floor(Math.random() * 25) + 60, // 60-85%
        diskUsage: 34.7
      }
    };
    
    return json({ 
      metrics,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur de monitoring:', error);
    return json({ 
      metrics: {
        api: { status: 'offline', responseTime: 0, uptime: 0, requests24h: 0 },
        database: { status: 'offline', responseTime: 0, connections: 0, uptime: 0 },
        cache: { status: 'offline', hitRate: 0, memory: 0, keys: 0 },
        system: { cpuUsage: 0, memoryUsage: 0, diskUsage: 0 }
      },
      lastUpdate: new Date().toISOString() 
    });
  }
}

export default function MonitoringPage() {
  const { metrics: initialMetrics, lastUpdate } = useLoaderData<typeof loader>();
  const [metrics, setMetrics] = useState(initialMetrics);

  // Simuler une mise à jour en temps réel toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const startTime = Date.now();
        await fetch('/monitoring').catch(() => {}); // Ignore les erreurs de fetch
        const apiTime = Date.now() - startTime;
        
        // Mettre à jour quelques métriques
        setMetrics(prev => ({
          ...prev,
          api: {
            ...prev.api,
            responseTime: apiTime,
            requests24h: prev.api.requests24h + Math.floor(Math.random() * 3)
          },
          system: {
            ...prev.system,
            cpuUsage: Math.max(10, Math.min(80, prev.system.cpuUsage + Math.floor(Math.random() * 11) - 5)),
            memoryUsage: Math.max(40, Math.min(90, prev.system.memoryUsage + Math.floor(Math.random() * 7) - 3))
          },
          cache: {
            ...prev.cache,
            hitRate: Math.max(0.7, Math.min(0.95, prev.cache.hitRate + (Math.random() * 0.02 - 0.01))),
            keys: prev.cache.keys + Math.floor(Math.random() * 5) - 2
          }
        }));
      } catch (error) {
        console.log('Erreur mise à jour monitoring:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (status: string) => {
    return status === 'online' ? CheckCircle : AlertTriangle;
  };

  const getPerformanceColor = (value: number, thresholds: { good: number, warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600 bg-green-100';
    if (value <= thresholds.warning) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Monitoring & Performance
          </h1>
          <p className="text-gray-600">
            Surveillance en temps réel de l'infrastructure Tunisia Jockey Club
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Dernière mise à jour: {new Date(lastUpdate).toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* API Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Server className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">API Backend</h3>
              </div>
              {(() => {
                const Icon = getStatusIcon(metrics.api.status);
                return <Icon className={`h-5 w-5 ${getStatusColor(metrics.api.status)}`} />;
              })()}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Temps réponse:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getPerformanceColor(metrics.api.responseTime, { good: 100, warning: 300 })
                }`}>
                  {metrics.api.responseTime}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium text-green-600">{metrics.api.uptime}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requêtes 24h:</span>
                <span className="font-medium">{metrics.api.requests24h.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Database className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Base de données</h3>
              </div>
              {(() => {
                const Icon = getStatusIcon(metrics.database.status);
                return <Icon className={`h-5 w-5 ${getStatusColor(metrics.database.status)}`} />;
              })()}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Temps réponse:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getPerformanceColor(metrics.database.responseTime, { good: 10, warning: 25 })
                }`}>
                  {metrics.database.responseTime}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connexions:</span>
                <span className="font-medium">{metrics.database.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium text-green-600">{metrics.database.uptime}%</span>
              </div>
            </div>
          </div>

          {/* Cache Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Cache Redis</h3>
              </div>
              {(() => {
                const Icon = getStatusIcon(metrics.cache.status);
                return <Icon className={`h-5 w-5 ${getStatusColor(metrics.cache.status)}`} />;
              })()}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hit rate:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getPerformanceColor(1 - metrics.cache.hitRate, { good: 0.1, warning: 0.3 })
                }`}>
                  {(metrics.cache.hitRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mémoire:</span>
                <span className="font-medium">{metrics.cache.memory}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clés:</span>
                <span className="font-medium">{metrics.cache.keys.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Système</h3>
              </div>
              <Circle className="h-5 w-5 text-green-500 animate-pulse" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CPU:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getPerformanceColor(metrics.system.cpuUsage, { good: 50, warning: 70 })
                }`}>
                  {metrics.system.cpuUsage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mémoire:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  getPerformanceColor(metrics.system.memoryUsage, { good: 70, warning: 85 })
                }`}>
                  {metrics.system.memoryUsage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disque:</span>
                <span className="font-medium text-green-600">{metrics.system.diskUsage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Response Time Chart */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Temps de Réponse (dernière heure)
            </h3>
            <div className="flex items-end space-x-2 h-32">
              {Array.from({ length: 12 }, (_, i) => {
                const height = Math.random() * 80 + 20;
                const color = height > 60 ? 'bg-red-400' : height > 40 ? 'bg-yellow-400' : 'bg-green-400';
                return (
                  <div
                    key={i}
                    className={`${color} rounded-t flex-1 transition-all duration-500`}
                    style={{ height: `${height}%` }}
                    title={`${Math.floor(height * 2)}ms`}
                  />
                );
              })}
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Moyenne: {metrics.api.responseTime}ms
            </div>
          </div>

          {/* System Load Chart */}
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Charge Système (dernière heure)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">CPU</span>
                  <span className="text-sm font-medium">{metrics.system.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metrics.system.cpuUsage > 70 ? 'bg-red-500' : 
                      metrics.system.cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${metrics.system.cpuUsage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Mémoire</span>
                  <span className="text-sm font-medium">{metrics.system.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metrics.system.memoryUsage > 85 ? 'bg-red-500' : 
                      metrics.system.memoryUsage > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${metrics.system.memoryUsage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className="text-sm font-medium">{(metrics.cache.hitRate * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.cache.hitRate * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Alertes & Notifications
          </h3>
          <div className="space-y-3">
            {metrics.api.responseTime > 300 && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <div className="font-medium text-red-800">Temps de réponse API élevé</div>
                  <div className="text-sm text-red-600">API répond en {metrics.api.responseTime}ms (seuil: 300ms)</div>
                </div>
              </div>
            )}
            {metrics.system.cpuUsage > 70 && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <div className="font-medium text-yellow-800">Charge CPU élevée</div>
                  <div className="text-sm text-yellow-600">CPU à {metrics.system.cpuUsage}% (seuil: 70%)</div>
                </div>
              </div>
            )}
            {metrics.system.memoryUsage > 85 && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <div className="font-medium text-red-800">Mémoire critique</div>
                  <div className="text-sm text-red-600">Mémoire à {metrics.system.memoryUsage}% (seuil: 85%)</div>
                </div>
              </div>
            )}
            {metrics.api.responseTime <= 100 && metrics.system.cpuUsage <= 50 && metrics.cache.hitRate > 0.8 && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <div className="font-medium text-green-800">Système en bonne santé</div>
                  <div className="text-sm text-green-600">Toutes les métriques sont dans les seuils acceptables</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
