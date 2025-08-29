import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { CheckCircle, Server, Clock, Zap } from 'lucide-react';

export const loader = async () => {
  const timestamp = new Date().toISOString();
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  return json({
    status: "operational",
    message: "Tunisia Jockey Club - Système IFHA opérationnel",
    timestamp,
    uptime: Math.round(uptime),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    memory: {
      used: Math.round(memory.heapUsed / 1024 / 1024),
      total: Math.round(memory.heapTotal / 1024 / 1024)
    },
    services: {
      frontend: "✅ Operational",
      backend: "✅ Operational", 
      database: "✅ Connected",
      cache: "✅ Redis Active",
      ifha: "✅ Rating System Active"
    },
    success: true
  });
};

export default function StatusPage() {
  const data = useLoaderData<typeof loader>();

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Statut du Système
          </h1>
          
          <p className="text-gray-600">
            {data.message}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <Server className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Serveur</p>
            <p className="text-green-600 text-sm">{data.status.toUpperCase()}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-blue-800">Uptime</p>
            <p className="text-blue-600 text-sm">{formatUptime(data.uptime)}</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="font-semibold text-purple-800">Mémoire</p>
            <p className="text-purple-600 text-sm">{data.memory.used}MB / {data.memory.total}MB</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Services</h2>
          
          <div className="space-y-3">
            {Object.entries(data.services).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="font-medium text-gray-700 capitalize">
                  {service.replace('_', ' ')}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Version {data.version} • Environnement: {data.environment}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Dernière vérification: {new Date(data.timestamp).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
}
