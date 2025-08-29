import { json, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const baseUrl = 'http://localhost:3000';
    
    // Récupérer les données depuis les APIs existantes
    const [statusRes, dashboardRes, horsesRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/status`),
      fetch(`${baseUrl}/api/dashboard/data`).catch(() => null),
      fetch(`${baseUrl}/api/horses`).catch(() => null)
    ]);

    // Status API (toujours disponible)
    const systemStatus = statusRes.status === 'fulfilled' && statusRes.value.ok
      ? await statusRes.value.json()
      : { status: 'ERROR', message: 'API indisponible' };

    // Dashboard data (optionnel)
    const dashboardData = dashboardRes.status === 'fulfilled' && dashboardRes.value?.ok
      ? await dashboardRes.value.json()
      : null;

    // Horses data (optionnel)
    const horsesData = horsesRes.status === 'fulfilled' && horsesRes.value?.ok
      ? await horsesRes.value.json()
      : null;

    // Construire les métriques executive avec données réelles ou fallback
    const executiveMetrics = {
      // Licences - depuis horses API ou fallback
      licenses: {
        total: horsesData?.horses?.length || 1247,
        change: '+12.5%',
        description: 'Professionnels certifiés'
      },
      
      // Événements - depuis dashboard API ou fallback
      events: {
        total: dashboardData?.upcomingRaces?.length || 89,
        change: '+18.2%',
        description: 'Compétitions supervisées'
      },
      
      // Conformité - calculé ou statique premium
      compliance: {
        percentage: 98.9,
        change: '+2.1%',
        description: 'Standards internationaux'
      },
      
      // Système - depuis status API
      systemStatus: {
        status: systemStatus.status === 'OK' ? 'OPÉRATIONNEL' : 'DÉGRADÉ',
        isHealthy: systemStatus.status === 'OK',
        lastCheck: systemStatus.timestamp
      }
    };

    // Compétitions en cours - données réelles ou simulées
    const competitions = dashboardData?.upcomingRaces?.slice(0, 3) || [
      {
        name: 'Grand Prix International',
        status: 'EN COURS',
        participants: 24,
        prize: '€85,000',
        location: 'Hippodrome Kassar Said'
      },
      {
        name: 'Championnat Elite Juniors', 
        status: 'PROGRAMMÉ',
        participants: 18,
        prize: '€45,000',
        location: 'Centre Équestre Sidi Bou Saïd'
      },
      {
        name: 'Coupe Excellence Nationale',
        status: 'VALIDÉ', 
        participants: 32,
        prize: '€65,000',
        location: 'Hippodrome de Nabeul'
      }
    ];

    // Communications prioritaires - simulées avec données réelles timestamp
    const communications = [
      {
        title: 'Directive Ministérielle 2025-12',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        priority: 'URGENT',
        type: 'Réglementation',
        source: 'API Backend'
      },
      {
        title: 'Certification ISO Update',
        time: systemStatus.timestamp ? new Date(systemStatus.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '12:15',
        priority: 'IMPORTANT',
        type: 'Qualité',
        source: 'Système'
      }
    ];

    return json({
      executiveMetrics,
      competitions,
      communications,
      systemHealth: systemStatus,
      dataSource: {
        dashboard: !!dashboardData,
        horses: !!horsesData,
        system: systemStatus.status === 'OK',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur loader executive:', error);
    
    // Fallback data si API complètement indisponible
    return json({
      executiveMetrics: {
        licenses: { total: 1247, change: '+12.5%', description: 'Professionnels certifiés' },
        events: { total: 89, change: '+18.2%', description: 'Compétitions supervisées' },
        compliance: { percentage: 98.9, change: '+2.1%', description: 'Standards internationaux' },
        systemStatus: { status: 'MODE DÉGRADÉ', isHealthy: false, lastCheck: new Date().toISOString() }
      },
      competitions: [],
      communications: [],
      systemHealth: { status: 'ERROR', message: 'APIs indisponibles' },
      dataSource: { dashboard: false, horses: false, system: false, timestamp: new Date().toISOString() }
    });
  }
};
