import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, Activity, AlertTriangle } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { ErrorBoundary } from '~/shared/components/ErrorBoundary';
import { createSecureLoader, createSecureAction, withValidation } from '~/shared/middleware/security';
import { adminSchema } from '~/shared/validation/schemas';
import { headers } from '~/shared/security/headers';

// Export security headers
export { headers };

// Loader sécurisé pour les administrateurs
export const loader = createSecureLoader(
  async (args, context) => {
    // Cette route nécessite une authentification et le rôle admin
    const securityMetrics = await getSecurityMetrics();
    const recentEvents = await getRecentSecurityEvents();
    
    return json({
      user: context.user,
      securityMetrics,
      recentEvents,
      csrfToken: generateCSRFToken(context.sessionId || 'default'),
    });
  },
  {
    requireAuth: true,
    requireRole: ['admin'],
    rateLimit: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30,
    },
  }
);

// Action sécurisée avec validation
export const action = createSecureAction(
  withValidation(
    adminSchema.updateSecuritySettings,
    async (args, context, validatedData) => {
      // Logic pour mettre à jour les paramètres de sécurité
      await updateSecuritySettings(validatedData);
      
      return json({ 
        success: true, 
        message: 'Paramètres de sécurité mis à jour avec succès' 
      });
    }
  ),
  {
    requireAuth: true,
    requireRole: ['admin'],
    rateLimit: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 10,
    },
  }
);

interface SecurityMetrics {
  totalUsers: number;
  activeSessions: number;
  failedLogins24h: number;
  suspiciousActivity: number;
  lastSecurityScan: string;
}

interface SecurityEvent {
  id: string;
  type: 'login_success' | 'login_failure' | 'suspicious_activity' | 'admin_action';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: string;
}

interface LoaderData {
  user: {
    id: string;
    email: string;
    role: string;
  };
  securityMetrics: SecurityMetrics;
  recentEvents: SecurityEvent[];
  csrfToken: string;
}

export default function AdminSecurity() {
  const { user, securityMetrics, recentEvents, csrfToken } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  const handleSecurityAction = (action: string) => {
    fetcher.submit(
      { 
        _csrf: csrfToken,
        action,
        timestamp: Date.now().toString() 
      },
      { method: 'post' }
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-800">
                Centre de Sécurité
              </h1>
            </div>
            <p className="text-slate-600">
              Surveillance et gestion de la sécurité système - Utilisateur: {user.email}
            </p>
          </div>

          {/* Métriques de sécurité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Utilisateurs Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {securityMetrics.totalUsers.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Sessions Actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {securityMetrics.activeSessions.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Échecs Connexion (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {securityMetrics.failedLogins24h}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Activité Suspecte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {securityMetrics.suspiciousActivity}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions de sécurité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleSecurityAction('force_logout_all')}
                    variant="destructive"
                    className="flex items-center gap-2"
                    disabled={fetcher.state !== 'idle'}
                  >
                    <Lock className="h-4 w-4" />
                    Déconnecter Tous les Utilisateurs
                  </Button>
                  
                  <Button
                    onClick={() => handleSecurityAction('security_scan')}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={fetcher.state !== 'idle'}
                  >
                    <Shield className="h-4 w-4" />
                    Scan de Sécurité
                  </Button>
                  
                  <Button
                    onClick={() => handleSecurityAction('clear_suspicious')}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={fetcher.state !== 'idle'}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Nettoyer Activités Suspectes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Événements récents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Événements de Sécurité Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="mt-1">
                        {event.type === 'login_success' && (
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                        )}
                        {event.type === 'login_failure' && (
                          <div className="h-2 w-2 bg-red-500 rounded-full" />
                        )}
                        {event.type === 'suspicious_activity' && (
                          <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                        )}
                        {event.type === 'admin_action' && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {event.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(event.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-700 mb-1">
                          {event.details}
                        </p>
                        
                        <div className="text-xs text-slate-500 space-x-2">
                          <span>IP: {event.ipAddress}</span>
                          {event.userId && <span>User: {event.userId}</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}

// Mock functions - En production, ces fonctions seraient dans des services séparés
async function getSecurityMetrics(): Promise<SecurityMetrics> {
  // Simulation d'appel API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    totalUsers: 1247,
    activeSessions: 89,
    failedLogins24h: 23,
    suspiciousActivity: 3,
    lastSecurityScan: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  };
}

async function getRecentSecurityEvents(): Promise<SecurityEvent[]> {
  // Simulation d'appel API
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return [
    {
      id: '1',
      type: 'login_success',
      userId: 'user_123',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      details: 'Connexion réussie depuis un nouvel appareil',
    },
    {
      id: '2',
      type: 'login_failure',
      ipAddress: '203.0.113.42',
      userAgent: 'curl/7.68.0',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      details: 'Tentative de connexion avec mot de passe incorrect (5 essais)',
    },
    {
      id: '3',
      type: 'suspicious_activity',
      ipAddress: '198.51.100.23',
      userAgent: 'Suspicious-Bot/1.0',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      details: 'Tentative d\'accès à des ressources restreintes',
    },
  ];
}

async function updateSecuritySettings(settings: any): Promise<void> {
  // Simulation de mise à jour
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('Security settings updated:', settings);
}

// Import des fonctions nécessaires depuis le middleware
function generateCSRFToken(sessionId: string): string {
  const timestamp = Date.now();
  return `csrf-${sessionId}-${timestamp}`;
}
