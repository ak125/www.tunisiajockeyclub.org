import { type LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { 
  Activity, Zap, Clock, Database, ArrowLeft,
  TrendingUp, RefreshCw, CheckCircle, AlertCircle,
  Server, BarChart3, Monitor
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { requirePermission, Permission } from '../utils/auth.server';

interface TestResult {
  success: boolean;
  data?: any;
  timestamp?: string;
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermission(request, Permission.ADMIN);

  try {
    // Récupérer les derniers tests de performance
    const performanceResponse = await fetch('http://localhost:3000/api/rating/ifha/performance/latest');
    const cacheResponse = await fetch('http://localhost:3000/api/rating/ifha/cache/stats');
    
    const performanceData = performanceResponse.ok ? await performanceResponse.json() : {};
    const cacheStats = cacheResponse.ok ? await cacheResponse.json() : {};

    return json({
      lastPerformanceTest: performanceData,
      cacheStatistics: cacheStats,
      systemEndpoints: [
        { name: 'Rating Calculation', endpoint: '/api/rating/ifha/calculate/:id', method: 'POST' },
        { name: 'Rating Conversion', endpoint: '/api/rating/ifha/convert', method: 'POST' },
        { name: 'Rating Statistics', endpoint: '/api/rating/ifha/statistics', method: 'GET' },
        { name: 'Performance Test', endpoint: '/api/rating/ifha/performance/run', method: 'POST' },
        { name: 'Cache Management', endpoint: '/api/rating/ifha/cache/clear', method: 'DELETE' },
        { name: 'Horse Rating', endpoint: '/api/ratings/horse/:id', method: 'GET' },
      ]
    });
  } catch (error) {
    console.error('Erreur chargement données performance:', error);
    return json({
      lastPerformanceTest: {},
      cacheStatistics: {},
      systemEndpoints: []
    });
  }
}

export default function DashboardRatingsPerformance() {
  const { lastPerformanceTest, systemEndpoints } = useLoaderData<typeof loader>();
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Données simulées pour le développement
  const mockPerformanceData = {
    ratingTest: {
      operation: 'Rating Calculation',
      averageTime: 145,
      minTime: 98,
      maxTime: 287,
      successRate: 98.5,
      totalOperations: 1250,
      samples: 100,
      cacheHits: 75,
      cacheMisses: 25
    },
    conversionTest: {
      operation: 'Rating Conversion',
      averageTime: 23,
      minTime: 12,
      maxTime: 45,
      successRate: 100,
      totalOperations: 890,
      samples: 50,
      cacheHits: 42,
      cacheMisses: 8
    },
    statisticsTest: {
      operation: 'Statistics Query',
      averageTime: 67,
      minTime: 45,
      maxTime: 98,
      successRate: 99.2,
      totalOperations: 345,
      samples: 30,
      cacheHits: 28,
      cacheMisses: 2
    },
    cacheEfficiency: 87.3
  };

  const performanceData = Object.keys(lastPerformanceTest).length > 0 ? lastPerformanceTest : mockPerformanceData;

  const runPerformanceTest = async () => {
    setIsRunningTest(true);
    try {
      const response = await fetch('http://localhost:3000/api/rating/ifha/performance/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestResults({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      } else {
        setTestResults({
          success: false,
          error: result.message || 'Erreur lors du test'
        });
      }
    } catch (error) {
      console.error('Erreur test performance:', error);
      setTestResults({
        success: false,
        error: 'Erreur de communication avec le serveur'
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const clearCache = async () => {
    try {
      await fetch('http://localhost:3000/api/rating/ifha/cache/clear', {
        method: 'DELETE'
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur nettoyage cache:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (value: number, thresholds: { good: number, warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600 bg-green-50';
    if (value <= thresholds.warning) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 99) return 'text-green-600';
    if (rate >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Link to="/dashboard/ratings" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Performance Système Rating</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Monitoring et tests de performance des services IFHA • 
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={clearCache}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Database className="h-4 w-4" />
            <span>Vider Cache</span>
          </button>
          
          <button
            onClick={runPerformanceTest}
            disabled={isRunningTest}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isRunningTest ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            <span>{isRunningTest ? 'Test en cours...' : 'Lancer Test'}</span>
          </button>
        </div>
      </div>

      {/* Vue d'ensemble des performances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficacité Cache</p>
              <p className="text-2xl font-bold text-purple-600">{performanceData.cacheEfficiency}%</p>
            </div>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
              <p className="text-2xl font-bold text-blue-600">{performanceData.ratingTest.averageTime}ms</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux Succès</p>
              <p className={`text-2xl font-bold ${getSuccessRateColor(performanceData.ratingTest.successRate)}`}>
                {performanceData.ratingTest.successRate}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Opérations Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData.ratingTest.totalOperations.toLocaleString()}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Détails des tests de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests individuels */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Tests de Performance</h2>
          </div>

          <div className="space-y-4">
            {[performanceData.ratingTest, performanceData.conversionTest, performanceData.statisticsTest].map((test, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{test.operation}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(test.averageTime, { good: 50, warning: 150 })}`}>
                    {test.averageTime}ms
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Min/Max</p>
                    <p className="font-medium">{test.minTime}ms - {test.maxTime}ms</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Échantillons</p>
                    <p className="font-medium">{test.samples} tests</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cache Hits</p>
                    <p className="font-medium text-green-600">{test.cacheHits}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cache Miss</p>
                    <p className="font-medium text-red-600">{test.cacheMisses}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Taux de succès</span>
                    <span>{test.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${test.successRate >= 99 ? 'bg-green-500' : test.successRate >= 95 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${test.successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints système */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Server className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-medium text-gray-900">Endpoints Système</h2>
          </div>

          <div className="space-y-3">
            {systemEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <h3 className="font-medium text-gray-900 text-sm">{endpoint.name}</h3>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">{endpoint.endpoint}</p>
                </div>
                <Monitor className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats des tests */}
      {testResults && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            {testResults.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <h3 className="text-lg font-medium text-gray-900">Résultats du Dernier Test</h3>
            {testResults.timestamp && (
              <span className="text-sm text-gray-500">
                {new Date(testResults.timestamp).toLocaleTimeString('fr-FR')}
              </span>
            )}
          </div>

          {testResults.success ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-sm font-medium text-green-800 mb-2">Test de performance réussi</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-green-700">Temps moyen</p>
                  <p className="font-bold">{testResults.data?.averageTime || 'N/A'}ms</p>
                </div>
                <div>
                  <p className="text-green-700">Taux de succès</p>
                  <p className="font-bold">{testResults.data?.successRate || 'N/A'}%</p>
                </div>
                <div>
                  <p className="text-green-700">Efficacité cache</p>
                  <p className="font-bold">{testResults.data?.cacheEfficiency || 'N/A'}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-sm font-medium text-red-800">{testResults.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Métriques avancées */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-medium text-gray-900">Métriques Système</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {(performanceData.ratingTest.totalOperations + performanceData.conversionTest.totalOperations + performanceData.statisticsTest.totalOperations).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Opérations</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.round((performanceData.ratingTest.cacheHits + performanceData.conversionTest.cacheHits + performanceData.statisticsTest.cacheHits) / (performanceData.ratingTest.samples + performanceData.conversionTest.samples + performanceData.statisticsTest.samples) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Taux Cache Hit Global</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((performanceData.ratingTest.averageTime + performanceData.conversionTest.averageTime + performanceData.statisticsTest.averageTime) / 3)}ms
            </p>
            <p className="text-sm text-gray-600">Temps Réponse Moyen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
