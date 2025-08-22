import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API service layer
export const raceService = {
  getAll: async () => {
    const response = await fetch('/api/races');
    if (!response.ok) throw new Error('Failed to fetch races');
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`/api/races/${id}`);
    if (!response.ok) throw new Error('Failed to fetch race');
    return response.json();
  },
  
  create: async (raceData: any) => {
    const response = await fetch('/api/races', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(raceData)
    });
    if (!response.ok) throw new Error('Failed to create race');
    return response.json();
  },
  
  update: async ({ id, ...data }: { id: string } & any) => {
    const response = await fetch(`/api/races/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update race');
    return response.json();
  }
};

// Query keys factory
export const raceKeys = {
  all: ['races'] as const,
  lists: () => [...raceKeys.all, 'list'] as const,
  list: (filters: string) => [...raceKeys.lists(), filters] as const,
  details: () => [...raceKeys.all, 'detail'] as const,
  detail: (id: string) => [...raceKeys.details(), id] as const,
  stats: () => [...raceKeys.all, 'stats'] as const,
};

// Custom hooks with optimized caching
export function useRaces(filters?: { status?: string; search?: string }) {
  const filterKey = filters ? JSON.stringify(filters) : 'all';
  
  return useQuery({
    queryKey: raceKeys.list(filterKey),
    queryFn: () => raceService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useRace(id: string) {
  return useQuery({
    queryKey: raceKeys.detail(id),
    queryFn: () => raceService.getById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes for individual races
    gcTime: 60 * 60 * 1000, // 1 hour (renamed from cacheTime)
  });
}

export function useCreateRace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: raceService.create,
    onMutate: async (newRace) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: raceKeys.lists() });
      
      // Snapshot previous value
      const previousRaces = queryClient.getQueryData(raceKeys.list('all'));
      
      // Optimistically update
      queryClient.setQueryData(raceKeys.list('all'), (old: any[]) => {
        return old ? [...old, { ...newRace, id: 'temp-' + Date.now() }] : [newRace];
      });
      
      return { previousRaces };
    },
    onError: (err, newRace, context) => {
      // Rollback on error
      if (context?.previousRaces) {
        queryClient.setQueryData(raceKeys.list('all'), context.previousRaces);
      }
    },
    onSuccess: (data) => {
      // Update with real data from server
      queryClient.setQueryData(raceKeys.detail(data.id), data);
    },
    onSettled: () => {
      // Refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: raceKeys.lists() });
    },
  });
}

export function useUpdateRace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: raceService.update,
    onMutate: async (updatedRace) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: raceKeys.detail(updatedRace.id) });
      
      // Snapshot previous value
      const previousRace = queryClient.getQueryData(raceKeys.detail(updatedRace.id));
      
      // Optimistically update
      queryClient.setQueryData(raceKeys.detail(updatedRace.id), updatedRace);
      
      return { previousRace };
    },
    onError: (err, updatedRace, context) => {
      if (context?.previousRace) {
        queryClient.setQueryData(raceKeys.detail(updatedRace.id), context.previousRace);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: raceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: raceKeys.lists() });
    },
  });
}

// Background sync for offline support
export function useBackgroundSync() {
  const queryClient = useQueryClient();
  
  return {
    syncWhenOnline: () => {
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: raceKeys.all });
      }
    },
    prefetchRaces: () => {
      queryClient.prefetchQuery({
        queryKey: raceKeys.list('all'),
        queryFn: raceService.getAll,
        staleTime: 5 * 60 * 1000,
      });
    }
  };
}
