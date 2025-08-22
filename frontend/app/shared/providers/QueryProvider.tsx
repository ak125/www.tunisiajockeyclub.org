import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Configuration du client React Query
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Temps de cache - renommé de cacheTime vers gcTime en React Query v5
      gcTime: 5 * 60 * 1000, // 5 minutes
      // Temps avant de considérer les données comme obsolètes
      staleTime: 1 * 60 * 1000, // 1 minute
      // Retry automatique sur les erreurs
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs d'authentification
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry maximum 3 fois
        return failureCount < 3;
      },
      // Délai entre les retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch quand la fenêtre regagne le focus
      refetchOnWindowFocus: true,
      // Refetch lors de la reconnexion réseau
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry pour les mutations uniquement sur les erreurs réseau
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false; // Erreurs client - ne pas retry
        }
        return failureCount < 2; // Maximum 2 retries pour les erreurs serveur
      },
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Créer le client une seule fois par composant
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Utilitaires pour la gestion des erreurs React Query
export function isQueryError(error: unknown): error is { status: number; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isQueryError(error)) {
    switch (error.status) {
      case 401:
        return 'Non autorisé. Veuillez vous reconnecter.';
      case 403:
        return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
      case 404:
        return 'Ressource non trouvée.';
      case 429:
        return 'Trop de requêtes. Veuillez patienter avant de réessayer.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return error.message || 'Une erreur inattendue s\'est produite.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Une erreur inconnue s\'est produite.';
}

// Hook pour invalider des queries spécifiques
export function useInvalidateQueries() {
  const queryClient = new QueryClient();
  
  return {
    // Invalider toutes les queries races
    invalidateRaces: () => queryClient.invalidateQueries({ 
      queryKey: ['races'] 
    }),
    
    // Invalider une race spécifique
    invalidateRace: (raceId: string) => queryClient.invalidateQueries({ 
      queryKey: ['races', raceId] 
    }),
    
    // Invalider les statistiques
    invalidateStats: () => queryClient.invalidateQueries({ 
      queryKey: ['stats'] 
    }),
    
    // Invalider toutes les queries utilisateur
    invalidateUser: () => queryClient.invalidateQueries({ 
      queryKey: ['user'] 
    }),
    
    // Invalider tout
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}

// Configuration des query keys pour la cohérence
export const queryKeys = {
  // Queries utilisateur
  user: ['user'] as const,
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
  userPreferences: (userId: string) => ['user', 'preferences', userId] as const,
  
  // Queries courses
  races: ['races'] as const,
  racesList: (filters?: any) => ['races', 'list', filters] as const,
  raceDetail: (raceId: string) => ['races', raceId] as const,
  raceParticipants: (raceId: string) => ['races', raceId, 'participants'] as const,
  raceResults: (raceId: string) => ['races', raceId, 'results'] as const,
  
  // Queries paris
  bets: ['bets'] as const,
  userBets: (userId: string) => ['bets', 'user', userId] as const,
  raceBets: (raceId: string) => ['bets', 'race', raceId] as const,
  
  // Queries statistiques
  stats: ['stats'] as const,
  dashboardStats: ['stats', 'dashboard'] as const,
  raceStats: (raceId: string) => ['stats', 'race', raceId] as const,
  userStats: (userId: string) => ['stats', 'user', userId] as const,
  
  // Queries admin
  admin: ['admin'] as const,
  adminUsers: (filters?: any) => ['admin', 'users', filters] as const,
  adminSecurityEvents: ['admin', 'security', 'events'] as const,
  adminSystemHealth: ['admin', 'system', 'health'] as const,
} as const;

// Type pour les query keys
export type QueryKeys = typeof queryKeys;

// Hook pour la synchronisation en temps réel avec WebSockets
export function useRealtimeSync(enabled = false) {
  const queryClient = new QueryClient();
  
  // En production, connecter aux WebSockets pour les mises à jour en temps réel
  // useEffect(() => {
  //   if (!enabled) return;
  //   
  //   const ws = new WebSocket(process.env.WS_URL || 'ws://localhost:3001');
  //   
  //   ws.onmessage = (event) => {
  //     const { type, data } = JSON.parse(event.data);
  //     
  //     switch (type) {
  //       case 'race_updated':
  //         queryClient.setQueryData(queryKeys.raceDetail(data.raceId), data);
  //         break;
  //       case 'new_bet':
  //         queryClient.invalidateQueries({ queryKey: queryKeys.raceBets(data.raceId) });
  //         break;
  //       case 'race_started':
  //         queryClient.invalidateQueries({ queryKey: queryKeys.races });
  //         break;
  //     }
  //   };
  //   
  //   return () => ws.close();
  // }, [enabled, queryClient]);
}

export default QueryProvider;
